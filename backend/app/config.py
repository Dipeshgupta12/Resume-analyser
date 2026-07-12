from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    groq_api_key: str = ""
    database_url: str = "sqlite:///./resume.db"
    max_file_size_mb: int = 5
    groq_model: str = "llama-3.3-70b-versatile"
    allowed_extensions: set[str] = {".pdf", ".docx"}

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
