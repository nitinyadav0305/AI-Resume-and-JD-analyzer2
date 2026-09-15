"""
CareerLens AI — Resume Schema
Lifted directly from main_code.py for structured LLM extraction.
"""

from pydantic import BaseModel


class Resume(BaseModel):
    """Structured resume data extracted by the LLM."""
    name: str = ""
    summary: str = ""
    skills: list[str] = []
    experience: list = []
    education: list = []
    projects: list = []
    certifications: list = []
