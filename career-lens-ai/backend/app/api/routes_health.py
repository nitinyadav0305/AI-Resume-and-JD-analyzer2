"""
CareerLens AI — Health Check Route
GET /api/health
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/api/health")
async def health_check():
    """Simple liveness check for deployment platforms."""
    return {"status": "ok"}
