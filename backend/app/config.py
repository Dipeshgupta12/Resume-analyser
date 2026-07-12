from pydantic_settings import BaseSettings


import os


class Settings(BaseSettings):
    groq_api_key: str = ""
    database_url: str = ""
    max_file_size_mb: int = 5
    groq_model: str = "llama-3.3-70b-versatile"
    allowed_extensions: set[str] = {".pdf", ".docx"}

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Priority: 1) explicit DATABASE_URL env var, 2) Vercel Postgres URL, 3) SQLite fallback
        if not self.database_url:
            # Vercel Postgres automatically sets POSTGRES_URL when you add Postgres
            pg_url = os.environ.get("POSTGRES_URL")
            if pg_url:
                self.database_url = pg_url
            else:
                on_vercel = os.environ.get("VERCEL") == "1" or os.environ.get("VERCEL_ENV")
                db_dir = "/tmp" if on_vercel else "."
                self.database_url = f"sqlite:///{db_dir}/resume.db"


settings = Settings()
