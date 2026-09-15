"""
CareerLens AI — Analyze Route
POST /api/analyze

Handles HTTP concerns: validation, temp file lifecycle,
wrapping result in AnalyzeResponse with a generated analysisId.
Per Section 4.1 and 11 of the system design.
"""

import uuid
import logging
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import Optional

from app.config import settings
from app.core.exceptions import InvalidFileError, MissingJobDescriptionError
from app.schemas.analysis import AnalyzeResponse
from app.services.analysis_orchestrator import run_analysis

logger = logging.getLogger("careerlens.api")

router = APIRouter()


@router.post("/api/analyze")
async def analyze(
    resume: UploadFile = File(..., description="Resume PDF file"),
    jd_file: Optional[UploadFile] = File(None, description="Job description PDF file"),
    jd_text: Optional[str] = Form(None, description="Job description text"),
):
    """
    Main analysis endpoint.
    Accepts multipart form data with resume + (jd_file or jd_text).
    """

    # --- Validate resume ---
    if not resume or not resume.filename:
        raise InvalidFileError("Please upload a resume PDF.")

    # Check file type
    if not resume.filename.lower().endswith(".pdf"):
        raise InvalidFileError("Invalid file type. Please upload a PDF.")

    if resume.content_type and resume.content_type != "application/pdf":
        # Some browsers don't set content_type for PDFs, so we also check extension
        if resume.content_type != "application/octet-stream":
            raise InvalidFileError("Invalid file type. Please upload a PDF.")

    # Read resume bytes
    resume_bytes = await resume.read()

    # Check file size
    if len(resume_bytes) > settings.max_upload_bytes:
        raise InvalidFileError(f"File too large. Maximum size is {settings.max_upload_mb} MB.")

    if len(resume_bytes) == 0:
        raise InvalidFileError("Resume file is empty.")

    # --- Validate JD ---
    jd_bytes = None

    if jd_file and jd_file.filename:
        # Validate JD file
        if not jd_file.filename.lower().endswith(".pdf"):
            raise InvalidFileError("Job description must be a PDF.")

        jd_bytes = await jd_file.read()

        if len(jd_bytes) > settings.max_upload_bytes:
            raise InvalidFileError(f"JD file too large. Maximum size is {settings.max_upload_mb} MB.")

        if len(jd_bytes) == 0:
            raise InvalidFileError("JD file is empty.")

        jd_text = None  # Prefer file over text

    elif jd_text and jd_text.strip():
        if len(jd_text) > 20000:
            raise InvalidFileError("Job description text exceeds 20,000 character limit.")
    else:
        raise MissingJobDescriptionError()

    # --- Run analysis ---
    try:
        logger.info(f"Starting analysis: resume={resume.filename}, jd={'file' if jd_bytes else 'text'}")

        result = await run_analysis(
            resume_bytes=resume_bytes,
            jd_text=jd_text,
            jd_bytes=jd_bytes,
        )

        analysis_id = str(uuid.uuid4())

        response = AnalyzeResponse(
            success=True,
            analysisId=analysis_id,
            result=result,
        )

        logger.info(f"Analysis complete: id={analysis_id}, score={result.overallScore}")

        return response.model_dump()

    except (InvalidFileError, MissingJobDescriptionError):
        raise
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": {
                    "code": "ANALYSIS_FAILED",
                    "message": f"An unexpected error occurred during analysis. Please try again.",
                },
            },
        )
