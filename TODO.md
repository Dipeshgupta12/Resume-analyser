# TODO - Fix deployment issues

- [ ] Inspect remaining deployment-related config files (if any) and backend startup assumptions.
- [x] Fix Netlify-to-backend routing so `/api/*` calls succeed when backend URL is known (remove hardcoding or ensure correct default behavior).
- [ ] Add/confirm backend CORS and ensure Render (or any host) exposes correct env vars.
- [ ] Add runtime-safe backend upload/DB handling for hosted environments (SQLite persistence concerns).
- [x] Run local smoke test: build frontend and run backend + verify `/api/resume/upload` works end-to-end.

# Deployment Action Items (Netlify + Render)

- [ ] Render: set `GROQ_API_KEY` env var
- [ ] Render: verify `GET /api/health` returns `{"status":"running"}`
- [ ] Netlify: set environment variable `NETLIFY_BACKEND_URL` = `https://<your-backend-host>`
- [ ] Netlify: redeploy site

