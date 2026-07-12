# Deployment notes (Netlify + backend)

## What caused the “network error on analysing the resume”
The React frontend calls your backend at `/api/...`.
On Netlify, that requires a working redirect/proxy in `netlify.toml`.
The current repo previously hardcoded the Render URL. If your backend isn’t deployed yet (or its URL differs), `/api/*` will not reach a real backend and you’ll see a network error.

## Fix required on Netlify
1. Deploy the backend somewhere reachable (Render, Fly.io, Railway, etc.).
2. In Netlify **Site settings → Environment variables**, set:
   - `NETLIFY_BACKEND_URL` = `https://<your-backend-host>/` (include scheme)
   - Example: `https://resume-analyzer-api.onrender.com`
3. Re-deploy the Netlify site.

## Required behavior
After setting `NETLIFY_BACKEND_URL`, the Netlify rule in `netlify.toml` proxies:
- Frontend route: `https://<netlify-site>/api/resume/upload`
- To backend: `https://<backend-host>/api/resume/upload`

## Backend CORS
Backend code reads `CORS_ORIGINS`.
Ensure your backend has:
- `CORS_ORIGINS=*` (or your Netlify domain) in its environment.

## Local smoke test
Run backend locally on `http://localhost:8000` and ensure:
- `GET http://localhost:8000/api/health` returns `{"status":"running"}`
Then run the frontend and upload a resume.

