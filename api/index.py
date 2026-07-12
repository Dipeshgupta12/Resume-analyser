"""
Vercel Serverless entry point for the FastAPI backend.

Vercel Python Serverless Functions run with the project root as CWD.
We import from backend/app by adding it to sys.path.
"""
import sys
import os
import traceback

# ---------------------------------------------------------------------------
# 1. Ensure Python can find the backend/app package
# ---------------------------------------------------------------------------
_current = os.path.dirname(os.path.abspath(__file__))
_project_root = os.path.abspath(os.path.join(_current, ".."))
_backend_dir = os.path.join(_project_root, "backend")

# On Vercel, insert these directories so "from app.xxx import yyy" works
for _p in [_backend_dir, _project_root]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

# Tell the rest of the code it's running on Vercel (used by config.py / routes)
os.environ.setdefault("VERCEL", "1")

# ---------------------------------------------------------------------------
# 2. Import the real FastAPI application
#    Vercel requires `app` to be a top-level variable in this module.
# ---------------------------------------------------------------------------
try:
    from app.main import app
except Exception:
    traceback.print_exc()
    # If import fails, create a minimal fallback app at module level
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse

    _fallback_app = FastAPI(title="AI Resume Analyzer (diagnostic)")

    @_fallback_app.get("/api/health")
    async def health_diag():
        return {
            "status": "error",
            "detail": "Backend import failed",
            "sys_path": sys.path,
            "cwd": os.getcwd(),
            "files_in_cwd": os.listdir("."),
            "has_backend_dir": os.path.isdir(_backend_dir),
            "backend_dir": _backend_dir,
        }

    @_fallback_app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
    async def catch_all(path: str):
        return JSONResponse(
            content={
                "error": "Backend import failed",
                "path": path,
                "sys_path": sys.path,
            },
            status_code=500,
        )

    app = _fallback_app