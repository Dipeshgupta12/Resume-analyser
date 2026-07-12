from datetime import datetime

from pydantic import BaseModel, Field


class AnalysisResult(BaseModel):
    overall_score: int = Field(ge=0, le=100)
    ats_score: int = Field(ge=0, le=100)
    summary: str
    strengths: list[str]
    weaknesses: list[str]
    missing_skills: list[str]
    formatting_issues: list[str] = []
    recommendations: list[str]
    keywords: list[str] = []


class ResumeUploadResponse(BaseModel):
    id: int
    filename: str
    analysis: AnalysisResult


class ResumeAnalysisResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    uploaded_at: datetime
    analysis: AnalysisResult


class HealthResponse(BaseModel):
    status: str
