"""
CareerLens AI — Custom Exceptions
Maps domain errors to HTTP status codes.
"""

from fastapi import HTTPException


class InvalidFileError(HTTPException):
    """400 — wrong file type or file too large."""
    def __init__(self, message: str = "Please upload a PDF under 10 MB."):
        super().__init__(
            status_code=400,
            detail={"success": False, "error": {"code": "INVALID_FILE", "message": message}},
        )


class MissingJobDescriptionError(HTTPException):
    """400 — neither jd_file nor jd_text provided."""
    def __init__(self, message: str = "Please provide a job description (file or text)."):
        super().__init__(
            status_code=400,
            detail={"success": False, "error": {"code": "MISSING_JD", "message": message}},
        )


class PDFParseError(HTTPException):
    """422 — PDF unreadable or has no extractable text."""
    def __init__(self, message: str = "Could not extract text from the PDF. It may be scanned or corrupted."):
        super().__init__(
            status_code=422,
            detail={"success": False, "error": {"code": "PDF_PARSE_ERROR", "message": message}},
        )


class LLMExtractionError(HTTPException):
    """502 — LLM returned invalid or empty structured output."""
    def __init__(self, message: str = "AI extraction failed. Please try again."):
        super().__init__(
            status_code=502,
            detail={"success": False, "error": {"code": "LLM_ERROR", "message": message}},
        )
