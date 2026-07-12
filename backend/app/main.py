from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routes import resume
from .schemas import HealthResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="AI Resume Analyzer API",
    description="Analyze resumes with AI-powered insights using Groq LLM",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow all origins in production since this is a personal tool.
# Restrict this in production to specific domains if needed.
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS.split(",") if CORS_ORIGINS != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)


@app.get("/api/health", response_model=HealthResponse, tags=["health"])
def health_check():
    return HealthResponse(status="running")
