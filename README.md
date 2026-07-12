# AI Resume Analyzer

A full-stack AI-powered resume analysis platform. Upload your resume (PDF or DOCX) and receive detailed feedback including ATS scores, strengths, weaknesses, missing skills, and actionable recommendations — powered by the **Groq API**.

## Features

- **AI Resume Analysis** — Expert-level feedback from Groq LLM
- **ATS Score** — Applicant Tracking System compatibility rating
- **Missing Skills Detection** — Identify skill gaps in your profile
- **Keyword Suggestions** — ATS-friendly keywords to improve visibility
- **Drag & Drop Upload** — PDF and DOCX support with progress tracking
- **Premium UI** — Modern SaaS design with dark/light theme, animations, and glassmorphism
- **No Authentication** — Use instantly without creating an account

## Tech Stack

| Layer    | Technologies |
|----------|-------------|
| Backend  | Python 3.11+, FastAPI, SQLAlchemy, SQLite, Groq API, Pydantic |
| Frontend | React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Axios |
| AI       | Groq API |

## Project Structure

```
AI resume Analyzer/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry
│   │   ├── database.py          # SQLAlchemy setup
│   │   ├── models.py            # Resume & Analysis models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── config.py            # Environment settings
│   │   ├── routes/resume.py     # API endpoints
│   │   └── services/            # AI, PDF, DOCX parsers
│   ├── uploads/                 # Uploaded resume files
│   ├── requirements.txt
│   └── .env
├── frontend/
│   └── src/
│       ├── components/          # Reusable UI components
│       ├── pages/               # Home & Analysis pages
│       ├── services/api.ts      # Axios API client
│       └── types/resume.ts      # TypeScript interfaces
└── README.md
```

## Prerequisites

- **Python 3.11+**
- **Node.js 18+** and npm
- **Groq API Key** — Get one at [console.groq.com](https://console.groq.com)

## Installation

### 1. Clone and navigate to the project

```bash
cd "AI resume Analyzer"
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Edit `backend/.env` and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=sqlite:///./resume.db
MAX_FILE_SIZE_MB=5
GROQ_MODEL=llama-3.3-70b-versatile
```

### 3. Frontend Setup

```bash
cd frontend

npm install
```

The frontend `.env` file is pre-configured:

```env
VITE_API_URL=http://localhost:8000
```

## Running the Application

Open **two terminals**:

### Terminal 1 — Backend

```bash
cd backend
uvicorn app.main:app --reload
```

Backend runs at: **http://localhost:8000**  
API docs (Swagger): **http://localhost:8000/docs**

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at: **http://localhost:5173**

## API Endpoints

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| GET    | `/api/health`         | Health check                   |
| POST   | `/api/resume/upload`  | Upload & analyze resume        |
| GET    | `/api/resume/{id}`    | Get stored analysis by ID      |

### Upload Response Example

```json
{
  "id": 1,
  "filename": "resume.pdf",
  "analysis": {
    "overall_score": 85,
    "ats_score": 90,
    "summary": "Strong technical background...",
    "strengths": ["Solid Python experience", "Clear project descriptions"],
    "weaknesses": ["Missing quantified achievements"],
    "missing_skills": ["Docker", "Kubernetes"],
    "formatting_issues": ["Inconsistent bullet points"],
    "recommendations": ["Add metrics to achievements"],
    "keywords": ["Python", "FastAPI", "REST API"]
  }
}
```

## Configuration

| Variable           | Default                          | Description                |
|--------------------|----------------------------------|----------------------------|
| `GROQ_API_KEY`     | —                                | Your Groq API key (required) |
| `DATABASE_URL`     | `sqlite:///./resume.db`          | SQLite database path       |
| `MAX_FILE_SIZE_MB` | `5`                              | Max upload size in MB      |
| `GROQ_MODEL`       | `llama-3.3-70b-versatile`        | Groq model to use          |
| `VITE_API_URL`     | `http://localhost:8000`          | Backend URL for frontend   |

## Building for Production

### Backend

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Deploy to Production

### Step 1: Deploy Backend to Render

**Prerequisite:** A [Render](https://render.com) account (free tier works).

#### Option A: One-click via Blueprint (recommended)

1. Push this repository to GitHub
2. Log in to [Render Dashboard](https://dashboard.render.com)
3. Click **"New +" → "Blueprint"**
4. Connect your GitHub repo
5. Render will detect `render.yaml` and create the service automatically
6. After creation, go to the service **Environment** tab and set the secret:
   - `GROQ_API_KEY` → your actual Groq API key
7. Wait for the deploy to finish, then note your backend URL:
   - `https://resume-analyzer-api.onrender.com`

#### Option B: Manual setup

1. In Render dashboard, click **"New +" → "Web Service"**
2. Connect your GitHub repo
3. Fill in:
   - **Name:** `resume-analyzer-api`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 1`
   - **Plan:** Free
4. Click **"Advanced"** and add environment variables:
   - `GROQ_API_KEY` = your Groq API key
   - `CORS_ORIGINS` = `*`
5. Click **"Create Web Service"**

### Step 2: Deploy Frontend to Netlify

1. In [Netlify Dashboard](https://app.netlify.com), click **"Add new site" → "Import an existing project"**
2. Connect your GitHub repo
3. Netlify will auto-detect the `netlify.toml` config
4. Under **Environment variables**, add:
   - `VITE_API_URL` = leave **blank** (empty string — the frontend will use relative URLs and the Netlify proxy)
5. Click **"Deploy site"**

### Step 3: Verify the connection

1. Open your Netlify site URL
2. The frontend loads via Netlify
3. When you upload a resume, the frontend calls `/api/*` which Netlify proxies to `https://resume-analyzer-api.onrender.com/api/*`
4. The backend on Render processes the resume with Groq API and returns the analysis

> ⚠️ **Important:** If your Render URL is different from `https://resume-analyzer-api.onrender.com`, update the proxy URL in `netlify.toml`:
> ```toml
> [[redirects]]
>   from = "/api/*"
>   to = "https://your-actual-render-url.onrender.com/api/:splat"
>   status = 200
>   force = true
> ```

### Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Network error on resume upload | Backend not deployed | Deploy backend to Render first |
| CORS error in browser console | Backend CORS not configured | Set `CORS_ORIGINS=*` on Render |
| 404 on API calls | Proxy URL wrong in netlify.toml | Update to your actual Render URL |
| "GROQ_API_KEY not configured" | Missing API key | Add `GROQ_API_KEY` in Render env vars |

## License

MIT
