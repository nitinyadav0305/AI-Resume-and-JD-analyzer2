"""
CareerLens AI — FastAPI Application
Main entry point: app creation, CORS, router mounting.
"""

import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.core.logging import setup_logging
from app.api.routes_analyze import router as analyze_router
from app.api.routes_health import router as health_router

# Setup logging
logger = setup_logging()

# Create FastAPI app
app = FastAPI(
    title="CareerLens AI",
    description="AI-powered Resume & Job Fit Analyzer API",
    version="1.0.0",
)

# CORS middleware (Section 14)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list + ["*"],  # Allow all origins in dev
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(analyze_router)
app.include_router(health_router)


# Global exception handler for consistent error shape
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred. Please try again.",
            },
        },
    )


@app.on_event("startup")
async def startup():
    logger.info("CareerLens AI Backend starting...")
    logger.info(f"CORS origins: {settings.cors_origin_list}")
    logger.info(f"LLM model: {settings.groq_model}")
    logger.info(f"Max upload: {settings.max_upload_mb} MB")


@app.get("/")
async def root():
    return {
        "name": "CareerLens AI API",
        "version": "1.0.0",
        "endpoints": {
            "analyze": "POST /api/analyze",
            "health": "GET /api/health",
        },
    }
