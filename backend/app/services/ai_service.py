import json
import re

from groq import Groq

from app.config import settings
from app.schemas import AnalysisResult

SYSTEM_PROMPT = """You are an expert technical recruiter and ATS optimization specialist.

Analyze the provided resume.

Return ONLY valid JSON.

Analyze:

1. Overall resume quality
2. ATS compatibility score
3. Candidate summary
4. Key strengths
5. Weaknesses
6. Missing skills
7. Formatting problems
8. Experience evaluation
9. Education evaluation
10. Recommended improvements
11. Suggested keywords

JSON format:

{
"overall_score": number,
"ats_score": number,
"summary": "",
"strengths": [],
"weaknesses": [],
"missing_skills": [],
"formatting_issues": [],
"recommendations": [],
"keywords": []
}"""


def _extract_json(content: str) -> dict:
    """Extract JSON object from AI response, handling markdown fences."""
    content = content.strip()
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", content)
    if fence_match:
        content = fence_match.group(1).strip()

    start = content.find("{")
    end = content.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("AI response did not contain valid JSON.")

    return json.loads(content[start : end + 1])


def analyze_resume(resume_text: str) -> AnalysisResult:
    """Send resume text to Groq API and return structured analysis."""
    if not settings.groq_api_key:
        raise ValueError("GROQ_API_KEY is not configured. Please set it in the .env file.")

    client = Groq(api_key=settings.groq_api_key)

    try:
        response = client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"Analyze this resume:\n\n{resume_text[:12000]}",
                },
            ],
            temperature=0.3,
            max_tokens=4096,
        )
    except Exception as exc:
        raise ValueError(f"AI analysis failed: {exc}") from exc

    raw_content = response.choices[0].message.content
    if not raw_content:
        raise ValueError("AI returned an empty response.")

    try:
        data = _extract_json(raw_content)
        # Ensure numeric scores are integers (AI may return floats like 8.2)
        if "overall_score" in data:
            data["overall_score"] = round(float(data["overall_score"]))
        if "ats_score" in data:
            data["ats_score"] = round(float(data["ats_score"]))
        return AnalysisResult(**data)
    except (json.JSONDecodeError, ValueError) as exc:
        raise ValueError(f"Failed to parse AI response: {exc}") from exc
