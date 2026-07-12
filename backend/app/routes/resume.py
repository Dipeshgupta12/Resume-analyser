import json
import os
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..models import Analysis, Resume
from ..schemas import AnalysisResult, ResumeAnalysisResponse, ResumeUploadResponse
from ..services.ai_service import analyze_resume
from ..services.docx_parser import extract_text_from_docx
from ..services.pdf_parser import extract_text_from_pdf

router = APIRouter(prefix="/api/resume", tags=["resume"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def _serialize_analysis(analysis: Analysis) -> AnalysisResult:
    return AnalysisResult(
        overall_score=analysis.overall_score,
        ats_score=analysis.ats_score,
        summary=analysis.summary,
        strengths=json.loads(analysis.strengths),
        weaknesses=json.loads(analysis.weaknesses),
        missing_skills=json.loads(analysis.missing_skills),
        formatting_issues=json.loads(analysis.formatting_issues or "[]"),
        recommendations=json.loads(analysis.recommendations),
        keywords=json.loads(analysis.keywords or "[]"),
    )


def _extract_text(filename: str, content: bytes) -> str:
    ext = Path(filename).suffix.lower()
    if ext == ".pdf":
        return extract_text_from_pdf(content)
    if ext == ".docx":
        return extract_text_from_docx(content)
    raise HTTPException(status_code=400, detail="Unsupported file type. Allowed: PDF, DOCX.")


@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")

    ext = Path(file.filename).suffix.lower()
    if ext not in settings.allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{ext}'. Allowed formats: PDF, DOCX.",
        )

    content = await file.read()
    max_bytes = settings.max_file_size_mb * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {settings.max_file_size_mb}MB.",
        )

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        extracted_text = _extract_text(file.filename, content)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Failed to extract text from resume: {exc}",
        ) from exc

    if len(extracted_text.strip()) < 50:
        raise HTTPException(
            status_code=422,
            detail="Resume content is too short or could not be extracted properly.",
        )

    safe_filename = os.path.basename(file.filename)
    file_path = UPLOAD_DIR / safe_filename
    with open(file_path, "wb") as f:
        f.write(content)

    resume = Resume(
        filename=safe_filename,
        file_type=ext.lstrip("."),
        extracted_text=extracted_text,
    )
    db.add(resume)
    db.flush()

    try:
        analysis_result = analyze_resume(extracted_text)
    except ValueError as exc:
        db.rollback()
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    analysis = Analysis(
        resume_id=resume.id,
        overall_score=analysis_result.overall_score,
        ats_score=analysis_result.ats_score,
        summary=analysis_result.summary,
        strengths=json.dumps(analysis_result.strengths),
        weaknesses=json.dumps(analysis_result.weaknesses),
        missing_skills=json.dumps(analysis_result.missing_skills),
        recommendations=json.dumps(analysis_result.recommendations),
        formatting_issues=json.dumps(analysis_result.formatting_issues),
        keywords=json.dumps(analysis_result.keywords),
    )
    db.add(analysis)

    try:
        db.commit()
        db.refresh(resume)
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save analysis to database.") from exc

    return ResumeUploadResponse(
        id=resume.id,
        filename=resume.filename,
        analysis=analysis_result,
    )


@router.get("/{resume_id}", response_model=ResumeAnalysisResponse)
def get_resume_analysis(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    if not resume.analysis:
        raise HTTPException(status_code=404, detail="Analysis not found for this resume.")

    return ResumeAnalysisResponse(
        id=resume.id,
        filename=resume.filename,
        file_type=resume.file_type,
        uploaded_at=resume.uploaded_at,
        analysis=_serialize_analysis(resume.analysis),
    )
