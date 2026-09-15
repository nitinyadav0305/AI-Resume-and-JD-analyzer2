"""
CareerLens AI — Scoring Service
Produces the full weighted score breakdown across 5 categories.
Extends main_code.py's skill_score with experience, projects, education, and other.
"""

import json
import logging
from dataclasses import dataclass

from app.schemas.resume import Resume
from app.schemas.job_description import JobDescription
from app.services.skill_service import SkillMatchResult
from app.services import llm_service
from app.schemas.analysis import ScoreBreakdown

logger = logging.getLogger("careerlens.scoring")

# Weights per Section 8 of the system design
WEIGHTS = {
    "skills": 0.45,
    "experience": 0.25,
    "projects": 0.15,
    "education": 0.10,
    "other": 0.05,
}


@dataclass
class ScoringResult:
    overall: float
    summary: str
    breakdown: ScoreBreakdown
    experience_detail: dict
    project_detail: dict


async def score(
    resume: Resume,
    jd: JobDescription,
    skills: SkillMatchResult,
) -> ScoringResult:
    """
    Compute the full score breakdown.
    skills_score comes from skill_service (main_code.py logic).
    experience, projects are LLM-scored. education and other are rule-based.
    """

    # 1. Skills score (from main_code.py matching)
    skills_score = skills.skill_score

    # Add small bonus for matched preferred skills
    if skills.matched_preferred:
        preferred_bonus = min(len(skills.matched_preferred) * 3, 10)
        skills_score = min(100, skills_score + preferred_bonus)

    # 2. Experience score via LLM
    experience_detail = {}
    try:
        exp_score, exp_detail = await _score_experience(resume, jd)
    except Exception as e:
        logger.warning(f"Experience scoring failed: {e}")
        exp_score = 50.0
        exp_detail = {"summary": "Could not fully analyze experience.", "details": []}
    experience_detail = exp_detail

    # 3. Projects score via LLM
    project_detail = {}
    try:
        proj_score, proj_detail = await _score_projects(resume, jd)
    except Exception as e:
        logger.warning(f"Project scoring failed: {e}")
        proj_score = 50.0
        proj_detail = {"summary": "Could not fully analyze projects.", "details": []}
    project_detail = proj_detail

    # 4. Education score (rule-based)
    edu_score = _score_education(resume, jd)

    # 5. Other score (certifications + extras)
    other_score = _score_other(resume, jd)

    # Weighted overall
    overall = round(
        skills_score * WEIGHTS["skills"]
        + exp_score * WEIGHTS["experience"]
        + proj_score * WEIGHTS["projects"]
        + edu_score * WEIGHTS["education"]
        + other_score * WEIGHTS["other"]
    )

    overall = min(100, max(0, overall))

    # Generate summary
    if overall >= 85:
        summary = f"Excellent match! Your profile strongly aligns with this {jd.job_title} role at {jd.company or 'the company'}."
    elif overall >= 70:
        summary = f"Strong match for this {jd.job_title} position. A few skill gaps to address, but your background is well-suited."
    elif overall >= 50:
        summary = f"Moderate match for this {jd.job_title} role. There are notable gaps, but your transferable skills provide a foundation."
    else:
        summary = f"This {jd.job_title} role requires significant additional skills and experience. Focus on the learning priorities below."

    breakdown = ScoreBreakdown(
        skills=round(skills_score, 1),
        experience=round(exp_score, 1),
        projects=round(proj_score, 1),
        education=round(edu_score, 1),
        other=round(other_score, 1),
    )

    logger.info(
        f"Scores: overall={overall}, skills={skills_score:.1f}, "
        f"exp={exp_score:.1f}, proj={proj_score:.1f}, "
        f"edu={edu_score:.1f}, other={other_score:.1f}"
    )

    return ScoringResult(
        overall=overall,
        summary=summary,
        breakdown=breakdown,
        experience_detail=experience_detail,
        project_detail=project_detail,
    )


async def _score_experience(resume: Resume, jd: JobDescription) -> tuple[float, dict]:
    """Score experience relevance via LLM."""
    prompt = f"""You are an expert recruiter. Score how well this candidate's experience matches the job requirements.

Job Title: {jd.job_title}
Company: {jd.company}
Experience Requirements: {json.dumps(jd.experience_requirements)}
Responsibilities: {json.dumps(jd.responsibilities)}

Candidate's Experience: {json.dumps(resume.experience)}

Return ONLY a JSON object with:
- "score": number 0-100
- "summary": one sentence assessment
- "details": list of 2-4 specific observations

Example: {{"score": 75, "summary": "Good relevant experience", "details": ["Has 2 years React experience matching requirement", "Missing backend experience"]}}
"""
    response = await llm_service.score_with_llm(prompt)
    try:
        # Try to extract JSON from response
        text = response.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        data = json.loads(text)
        return float(data.get("score", 50)), {
            "summary": data.get("summary", ""),
            "details": data.get("details", []),
        }
    except (json.JSONDecodeError, ValueError, KeyError) as e:
        logger.warning(f"Failed to parse experience score: {e}")
        return 50.0, {"summary": "Experience partially matches requirements.", "details": []}


async def _score_projects(resume: Resume, jd: JobDescription) -> tuple[float, dict]:
    """Score project relevance via LLM."""
    prompt = f"""You are an expert recruiter. Score how well this candidate's projects match the job.

Job Title: {jd.job_title}
Required Skills: {json.dumps(jd.required_skills)}
Responsibilities: {json.dumps(jd.responsibilities)}

Candidate's Projects: {json.dumps(resume.projects)}

Return ONLY a JSON object with:
- "score": number 0-100
- "summary": one sentence assessment
- "details": list of 2-4 specific observations

Example: {{"score": 70, "summary": "Projects show relevant technical skills", "details": ["Built a React dashboard aligned with frontend requirements"]}}
"""
    response = await llm_service.score_with_llm(prompt)
    try:
        text = response.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        data = json.loads(text)
        return float(data.get("score", 50)), {
            "summary": data.get("summary", ""),
            "details": data.get("details", []),
        }
    except (json.JSONDecodeError, ValueError, KeyError) as e:
        logger.warning(f"Failed to parse project score: {e}")
        return 50.0, {"summary": "Projects show some relevant skills.", "details": []}


def _score_education(resume: Resume, jd: JobDescription) -> float:
    """Rule-based education scoring."""
    if not jd.education_requirements:
        return 100.0  # No education requirements

    if not resume.education:
        return 30.0  # Has requirements but no education listed

    # Simple text matching
    edu_text = json.dumps(resume.education).lower()
    req_text = " ".join(jd.education_requirements).lower()

    score = 50.0  # Base score for having education

    # Check for degree keywords
    degree_keywords = ["bachelor", "master", "phd", "b.tech", "b.e.", "m.tech", "mba", "bsc", "msc", "bca", "mca"]
    for keyword in degree_keywords:
        if keyword in edu_text and keyword in req_text:
            score += 30
            break
        elif keyword in edu_text:
            score += 15
            break

    # Check for field match
    field_keywords = ["computer science", "information technology", "software", "engineering", "it"]
    for keyword in field_keywords:
        if keyword in edu_text and keyword in req_text:
            score += 20
            break
        elif keyword in edu_text:
            score += 10
            break

    return min(100.0, score)


def _score_other(resume: Resume, jd: JobDescription) -> float:
    """Score certifications and other factors."""
    if not jd.certifications or all(
        c.lower() in ["not required", "none", "n/a", ""] for c in jd.certifications
    ):
        # No certifications required
        if resume.certifications:
            return 90.0  # Bonus for having certs when not required
        return 70.0  # Neutral

    if not resume.certifications:
        return 40.0  # Required but missing

    # Check for matches
    resume_certs = json.dumps(resume.certifications).lower()
    jd_certs = " ".join(jd.certifications).lower()

    matched = 0
    total = len(jd.certifications)

    for cert in jd.certifications:
        if cert.lower() in resume_certs:
            matched += 1

    if total > 0:
        return min(100.0, (matched / total) * 100 + 20)

    return 60.0
