"""
CareerLens AI — RAG Service
Generates evidence, recommendations, learning priorities,
interview questions, and RAG insights.
Per Section 9 of the system design.
"""

import json
import logging

from app.schemas.resume import Resume
from app.schemas.job_description import JobDescription
from app.services.skill_service import SkillMatchResult
from app.services.scoring_service import ScoringResult
from app.services import llm_service
from app.schemas.analysis import (
    EvidenceItem,
    Recommendation,
    LearningPriority,
    InterviewQuestion,
)
from dataclasses import dataclass, field

logger = logging.getLogger("careerlens.rag")


@dataclass
class RAGResult:
    evidence: list[EvidenceItem] = field(default_factory=list)
    recommendations: list[Recommendation] = field(default_factory=list)
    learning_priorities: list[LearningPriority] = field(default_factory=list)
    interview_questions: list[InterviewQuestion] = field(default_factory=list)
    insights: list[str] = field(default_factory=list)


async def build_insights(
    resume_text: str,
    resume: Resume,
    jd: JobDescription,
    skills: SkillMatchResult,
    scores: ScoringResult,
) -> RAGResult:
    """
    Build all RAG-powered insights in a single batched LLM call
    to minimize round trips.
    """
    result = RAGResult()

    try:
        # Build evidence for matched and missing skills
        result.evidence = _build_evidence(resume, skills)

        # Single comprehensive LLM call for recommendations, learning, questions, insights
        rag_data = await _generate_rag_content(resume, jd, skills, scores)

        result.recommendations = rag_data.get("recommendations", [])
        result.learning_priorities = rag_data.get("learning_priorities", [])
        result.interview_questions = rag_data.get("interview_questions", [])
        result.insights = rag_data.get("insights", [])

    except Exception as e:
        logger.error(f"RAG insights generation failed: {e}")
        # Return partial results with defaults
        result.insights = ["Analysis completed with partial insights due to processing limitations."]

    return result


def _build_evidence(resume: Resume, skills: SkillMatchResult) -> list[EvidenceItem]:
    """Build evidence entries for matched and missing skills."""
    evidence = []

    # Evidence for matched skills
    for skill in sorted(skills.matched_required):
        # Find the skill mention in resume data
        source = _find_skill_source(skill, resume)
        evidence.append(EvidenceItem(
            skill=skill,
            matched=True,
            source=source,
            reasoning=f"Found '{skill}' explicitly listed in resume skills.",
        ))

    # Evidence for partial matches
    for skill in skills.partial:
        evidence.append(EvidenceItem(
            skill=skill,
            matched=False,
            source="Related skill found in resume",
            reasoning=f"A related skill was found but '{skill}' is not an exact match.",
        ))

    # Evidence for missing skills
    for skill in sorted(skills.missing_required):
        evidence.append(EvidenceItem(
            skill=skill,
            matched=False,
            source="Not found in resume",
            reasoning=f"'{skill}' is a required skill not found in the resume.",
        ))

    return evidence


def _find_skill_source(skill: str, resume: Resume) -> str:
    """Find where a skill is mentioned in the resume."""
    skill_lower = skill.lower()

    # Check in experience
    for exp in resume.experience:
        exp_text = json.dumps(exp).lower() if isinstance(exp, dict) else str(exp).lower()
        if skill_lower in exp_text:
            if isinstance(exp, dict):
                return f"Used in: {exp.get('title', exp.get('company', 'work experience'))}"
            return "Referenced in work experience"

    # Check in projects
    for proj in resume.projects:
        proj_text = json.dumps(proj).lower() if isinstance(proj, dict) else str(proj).lower()
        if skill_lower in proj_text:
            if isinstance(proj, dict):
                return f"Used in project: {proj.get('name', proj.get('title', 'project'))}"
            return "Referenced in projects"

    return "Listed in resume skills section"


async def _generate_rag_content(
    resume: Resume,
    jd: JobDescription,
    skills: SkillMatchResult,
    scores: ScoringResult,
) -> dict:
    """Generate recommendations, learning priorities, interview questions, and insights via LLM."""

    prompt = f"""You are an expert career advisor and interview coach. Based on the analysis below, generate comprehensive career guidance.

## Analysis Context
- Job Title: {jd.job_title}
- Company: {jd.company}
- Overall Match Score: {scores.overall}/100
- Skills Score: {scores.breakdown.skills}/100
- Experience Score: {scores.breakdown.experience}/100
- Projects Score: {scores.breakdown.projects}/100
- Education Score: {scores.breakdown.education}/100

## Matched Skills: {json.dumps(sorted(skills.matched_required))}
## Missing Skills: {json.dumps(sorted(skills.missing_required))}
## Partial Matches: {json.dumps(skills.partial)}

## Candidate Skills: {json.dumps(resume.skills[:20])}
## Job Responsibilities: {json.dumps(jd.responsibilities)}

Return ONLY a valid JSON object with exactly these keys:

{{
  "recommendations": [
    {{"title": "Short action title", "detail": "1-2 sentence explanation", "priority": "high|medium|low"}}
  ],
  "learning_priorities": [
    {{"skill": "skill name", "reason": "why it matters for this role", "suggestedResources": ["resource type 1", "resource type 2"]}}
  ],
  "interview_questions": [
    {{"question": "The interview question", "category": "technical|behavioral|gap-focused", "relatedSkill": "skill name or null"}}
  ],
  "insights": [
    "Short observation about the candidate's fit (2-4 insights)"
  ]
}}

Generate:
- 3-5 recommendations (mix of high/medium/low priority)
- 3-5 learning priorities for missing skills
- 6-8 interview questions (mix of technical, behavioral, gap-focused)
- 2-4 insights about the overall fit
"""

    response = await llm_service.score_with_llm(prompt)

    try:
        text = response.strip()
        # Extract JSON from potential code blocks
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        data = json.loads(text)

        result = {
            "recommendations": [],
            "learning_priorities": [],
            "interview_questions": [],
            "insights": data.get("insights", []),
        }

        # Parse recommendations
        for rec in data.get("recommendations", []):
            try:
                result["recommendations"].append(Recommendation(
                    title=rec.get("title", ""),
                    detail=rec.get("detail", ""),
                    priority=rec.get("priority", "medium"),
                ))
            except Exception:
                pass

        # Parse learning priorities
        for lp in data.get("learning_priorities", []):
            try:
                result["learning_priorities"].append(LearningPriority(
                    skill=lp.get("skill", ""),
                    reason=lp.get("reason", ""),
                    suggestedResources=lp.get("suggestedResources", []),
                ))
            except Exception:
                pass

        # Parse interview questions
        for iq in data.get("interview_questions", []):
            try:
                result["interview_questions"].append(InterviewQuestion(
                    question=iq.get("question", ""),
                    category=iq.get("category", "technical"),
                    relatedSkill=iq.get("relatedSkill"),
                ))
            except Exception:
                pass

        logger.info(
            f"RAG content: {len(result['recommendations'])} recs, "
            f"{len(result['learning_priorities'])} priorities, "
            f"{len(result['interview_questions'])} questions, "
            f"{len(result['insights'])} insights"
        )

        return result

    except (json.JSONDecodeError, ValueError) as e:
        logger.warning(f"Failed to parse RAG content: {e}")
        return _fallback_content(skills, jd)


def _fallback_content(skills: SkillMatchResult, jd: JobDescription) -> dict:
    """Generate basic fallback content when LLM fails."""
    recommendations = []
    learning_priorities = []
    interview_questions = []

    for skill in sorted(skills.missing_required):
        recommendations.append(Recommendation(
            title=f"Develop {skill} proficiency",
            detail=f"This is a required skill for the {jd.job_title} role. Consider online courses or hands-on projects.",
            priority="high",
        ))
        learning_priorities.append(LearningPriority(
            skill=skill,
            reason=f"Required for the {jd.job_title} position",
            suggestedResources=["Online courses", "Documentation", "Practice projects"],
        ))

    interview_questions = [
        InterviewQuestion(
            question=f"Tell us about your experience with {jd.job_title}-related work.",
            category="behavioral",
            relatedSkill=None,
        ),
        InterviewQuestion(
            question="Walk us through a challenging project you've worked on recently.",
            category="behavioral",
            relatedSkill=None,
        ),
        InterviewQuestion(
            question="How do you approach learning new technologies?",
            category="behavioral",
            relatedSkill=None,
        ),
    ]

    for skill in sorted(skills.missing_required)[:3]:
        interview_questions.append(InterviewQuestion(
            question=f"What is your experience with {skill}? How would you get up to speed?",
            category="gap-focused",
            relatedSkill=skill,
        ))

    return {
        "recommendations": recommendations[:5],
        "learning_priorities": learning_priorities[:5],
        "interview_questions": interview_questions[:8],
        "insights": [
            f"Your profile matches {len(skills.matched_required)} of the required skills.",
            f"Focus on {len(skills.missing_required)} missing required skills to strengthen your application.",
        ],
    }
