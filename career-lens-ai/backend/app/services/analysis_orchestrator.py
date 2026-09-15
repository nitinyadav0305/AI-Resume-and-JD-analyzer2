"""
CareerLens AI — Analysis Orchestrator
Single entry point that ties all services together.
Per Section 11 of the system design.
"""

import logging

from app.schemas.analysis import AnalysisResult
from app.services import pdf_service, llm_service, skill_service, scoring_service, rag_service

logger = logging.getLogger("careerlens.orchestrator")


async def run_analysis(
    resume_bytes: bytes,
    jd_text: str | None = None,
    jd_bytes: bytes | None = None,
) -> AnalysisResult:
    """
    Complete analysis pipeline:
    1. Extract text from PDFs
    2. LLM structured extraction (parallel)
    3. Skill matching
    4. Scoring
    5. RAG insights
    """

    # Step 1: Extract text from PDFs
    logger.info("Step 1: Extracting text from resume PDF...")
    resume_text = pdf_service.extract_text(resume_bytes)

    if jd_bytes:
        logger.info("Step 1b: Extracting text from JD PDF...")
        jd_text_final = pdf_service.extract_text(jd_bytes)
    else:
        jd_text_final = jd_text

    if not jd_text_final or not jd_text_final.strip():
        from app.core.exceptions import MissingJobDescriptionError
        raise MissingJobDescriptionError()

    # Step 2: Parallel LLM extraction
    logger.info("Step 2: Running LLM structured extraction (parallel)...")
    resume, jd = await llm_service.extract_structured(resume_text, jd_text_final)

    # Step 3: Skill matching
    logger.info("Step 3: Matching skills...")
    skills = skill_service.match(
        resume.skills,
        jd.required_skills,
        jd.preferred_skills,
    )

    # Step 4: Scoring
    logger.info("Step 4: Computing score breakdown...")
    scores = await scoring_service.score(resume, jd, skills)

    # Step 5: RAG insights
    logger.info("Step 5: Generating RAG insights...")
    rag = await rag_service.build_insights(resume_text, resume, jd, skills, scores)

    # Assemble final result
    matched_all = sorted(skills.matched_required | skills.matched_preferred)
    partial_all = sorted(set(skills.partial))
    missing_all = sorted(skills.missing_required)

    result = AnalysisResult(
        overallScore=scores.overall,
        summary=scores.summary,
        scoreBreakdown=scores.breakdown,
        matchedSkills=matched_all,
        partialMatches=partial_all,
        missingSkills=missing_all,
        experienceAnalysis=scores.experience_detail,
        projectAnalysis=scores.project_detail,
        evidence=[e.model_dump() for e in rag.evidence],
        recommendations=[r.model_dump() for r in rag.recommendations],
        learningPriorities=[lp.model_dump() for lp in rag.learning_priorities],
        interviewQuestions=[iq.model_dump() for iq in rag.interview_questions],
        ragInsights=rag.insights,
    )

    logger.info(f"Analysis complete: overall={scores.overall}, {len(matched_all)} matched, {len(missing_all)} missing")

    return result
