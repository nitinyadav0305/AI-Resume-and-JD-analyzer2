"""
CareerLens AI — LLM Service
ChatGroq client with structured extraction calls.
Lifted from main_code.py's structured_model pattern.
"""

import asyncio
import logging
from langchain_groq import ChatGroq
from app.config import settings
from app.schemas.resume import Resume
from app.schemas.job_description import JobDescription
from app.prompts.resume_prompt import RESUME_PROMPT
from app.prompts.jd_prompt import JD_PROMPT
from app.core.exceptions import LLMExtractionError

logger = logging.getLogger("careerlens.llm")

# Initialize LLM (same as main_code.py)
_llm = None


def _get_llm():
    global _llm
    if _llm is None:
        _llm = ChatGroq(
            model=settings.groq_model,
            temperature=0,
            api_key=settings.groq_api_key,
        )
    return _llm


def _extract_resume_sync(resume_text: str) -> Resume:
    """Extract structured resume data using LLM."""
    llm = _get_llm()
    structured_model = llm.with_structured_output(Resume)
    prompt = RESUME_PROMPT.invoke({"resume_text": resume_text})
    result = structured_model.invoke(prompt)
    return result


def _extract_jd_sync(jd_text: str) -> JobDescription:
    """Extract structured JD data using LLM."""
    llm = _get_llm()
    structured_model = llm.with_structured_output(JobDescription)
    prompt = JD_PROMPT.invoke({"job_description": jd_text})
    result = structured_model.invoke(prompt)
    return result


async def extract_structured(resume_text: str, jd_text: str) -> tuple[Resume, JobDescription]:
    """
    Run resume and JD extraction concurrently.
    Uses asyncio.gather to parallelize the two independent LLM calls.
    """
    try:
        loop = asyncio.get_event_loop()

        # Run both extractions concurrently in thread pool
        resume_future = loop.run_in_executor(None, _extract_resume_sync, resume_text)
        jd_future = loop.run_in_executor(None, _extract_jd_sync, jd_text)

        resume, jd = await asyncio.gather(resume_future, jd_future)

        logger.info(f"Extracted resume: {resume.name}, {len(resume.skills)} skills")
        logger.info(f"Extracted JD: {jd.job_title} at {jd.company}, {len(jd.required_skills)} required skills")

        return resume, jd

    except Exception as e:
        logger.error(f"LLM extraction failed: {e}")
        raise LLMExtractionError(f"AI extraction failed: {str(e)}")


async def score_with_llm(prompt_text: str) -> dict:
    """
    Generic structured scoring call to the LLM.
    Returns a dict parsed from the LLM's JSON response.
    """
    try:
        llm = _get_llm()
        loop = asyncio.get_event_loop()

        def _invoke():
            response = llm.invoke(prompt_text)
            return response.content

        result = await loop.run_in_executor(None, _invoke)
        return result
    except Exception as e:
        logger.error(f"LLM scoring call failed: {e}")
        return ""
