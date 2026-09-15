"""
CareerLens AI — Analysis Response Schemas
Built to satisfy the frontend contract exactly.
"""

from pydantic import BaseModel


class ScoreBreakdown(BaseModel):
    skills: float = 0
    experience: float = 0
    projects: float = 0
    education: float = 0
    other: float = 0


class EvidenceItem(BaseModel):
    skill: str
    matched: bool
    source: str        # short quote/paraphrase from resume
    reasoning: str


class Recommendation(BaseModel):
    title: str
    detail: str
    priority: str       # "high" | "medium" | "low"


class LearningPriority(BaseModel):
    skill: str
    reason: str
    suggestedResources: list[str] = []


class InterviewQuestion(BaseModel):
    question: str
    category: str        # "technical" | "behavioral" | "gap-focused"
    relatedSkill: str | None = None


class ExperienceAnalysis(BaseModel):
    score: float = 0
    summary: str = ""
    details: list[str] = []


class ProjectAnalysis(BaseModel):
    score: float = 0
    summary: str = ""
    details: list[str] = []


class AnalysisResult(BaseModel):
    overallScore: float
    summary: str
    scoreBreakdown: ScoreBreakdown
    matchedSkills: list[str]
    partialMatches: list[str]
    missingSkills: list[str]
    experienceAnalysis: dict = {}
    projectAnalysis: dict = {}
    evidence: list[EvidenceItem] = []
    recommendations: list[Recommendation] = []
    learningPriorities: list[LearningPriority] = []
    interviewQuestions: list[InterviewQuestion] = []
    ragInsights: list[str] = []


class AnalyzeResponse(BaseModel):
    success: bool
    analysisId: str
    result: AnalysisResult


class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail
