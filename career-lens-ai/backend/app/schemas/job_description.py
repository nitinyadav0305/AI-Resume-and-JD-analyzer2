"""
CareerLens AI — Job Description Schema
Lifted directly from main_code.py for structured LLM extraction.
"""

from pydantic import BaseModel


class JobDescription(BaseModel):
    """Structured JD data extracted by the LLM."""
    job_title: str = ""
    company: str = ""
    summary: str = ""
    required_skills: list[str] = []
    preferred_skills: list[str] = []
    responsibilities: list[str] = []
    experience_requirements: list[str] = []
    education_requirements: list[str] = []
    certifications: list[str] = []
