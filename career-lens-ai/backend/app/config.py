"""
CareerLens AI — Configuration
Loads environment variables via pydantic-settings.
"""

import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load .env from the backend directory
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))


class Settings(BaseSettings):
    groq_api_key: str = ""
    groq_model: str = "openai/gpt-oss-120b"
    max_upload_mb: int = 10
    cors_origins: str = "http://localhost:5500,http://127.0.0.1:5500"
    log_level: str = "info"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def max_upload_bytes(self) -> int:
        return self.max_upload_mb * 1024 * 1024


settings = Settings()
