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
        # On Vercel, the filesystem is read-only except /tmp
        # Default to /tmp/resume.db so SQLite works in serverless
        if not self.database_url:
            db_dir = "/tmp" if os.environ.get("VERCEL") else "."
            self.database_url = f"sqlite:///{db_dir}/resume.db"


settings = Settings()
