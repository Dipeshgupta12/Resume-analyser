"""
Vercel Serverless entry point for the FastAPI backend.
Vercel looks for a variable named `app` in `api/index.py`.
"""
import sys
import os

# Ensure the backend directory is on the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app  # noqa: E402