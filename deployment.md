# Deployment Guide (Render API + Vercel Frontend)

This document explains how to deploy the FastAPI backend (with the ML model) to **Render** and the React (Vite) frontend to **Vercel** while keeping them separate.

---

## 1. Repository Layout

```text
backend/           FastAPI app source (backend/app/...)
models_saved/      model.keras + feature_order.json
frontend/          React + Vite application
backend/Dockerfile Backend container definition
docker-compose.yml Local convenience (backend only)
```

---

## 2. Environment Variables

### Backend (Render → Service → Environment)

| Name | Example | Purpose |
|------|---------|---------|
| APP_NAME | Heart Disease Predictor API | Display title |
| LOG_LEVEL | INFO | Logging verbosity |
| CORS_ORIGINS | <https://app.example.com>,<https://yourproject.vercel.app> | Exact allowed frontend origins |
| MODEL_PATH | /app/models_saved/model.keras | Model inside container |
| FEATURE_ORDER_PATH | /app/models_saved/feature_order.json | Feature order JSON |

### Frontend (Vercel → Project Settings → Environment Variables)

| Name | Value |
|------|-------|
| VITE_API_URL | <https://api.example.com> |

Deploy backend first; once you have the real API domain, set `VITE_API_URL` before the production frontend build.

---

## 3. Backend Deployment (Render)

1. New → Web Service → Connect GitHub repo.
2. Set **Root** to repository root; specify Dockerfile path: `backend/Dockerfile`.
3. Select an instance type with ≥ 1GB RAM (TensorFlow can be memory hungry).
4. Add environment variables (table above).
5. Deploy. When live, test:

```bash
curl -s https://api.example.com/api/health
```

Expect `{ "status": "ok" }` (after model loads).

To test prediction:

```bash
curl -s -X POST https://api.example.com/api/predict \
  -H 'Content-Type: application/json' \
  -d '{"features":{"age":57,"sex":1,"cp":3,"trestbps":150,"chol":276,"fbs":1,"restecg":2,"thalach":112,"exang":1,"oldpeak":0.6,"slope":1,"ca":1,"thal":1}}'
```

---

## 4. Frontend Deployment (Vercel)

1. Import Project → Select repo.
2. Set **Root Directory** to `frontend`.
3. Vercel auto-detects Vite. Confirm settings:
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output: `dist`
4. Add `VITE_API_URL` (Production & Preview if desired).
5. Deploy. Visit the provided URL and attempt a prediction. Check the browser Network tab for requests to `https://api.example.com/api/predict`.

Add a custom domain (e.g. `app.example.com`) in Vercel and update DNS (CNAME). Add that domain to `CORS_ORIGINS` in Render, redeploy backend.

---

## 5. Local Development (Optional Docker)

```bash
# Build & run backend container
docker build -f backend/Dockerfile -t heart-api:dev .
docker run --rm -p 8000:8000 --env-file backend/.env.example heart-api:dev

# In another terminal (frontend dev):
cd frontend
VITE_API_URL=http://localhost:8000 npm run dev
```

Compose shortcut (backend only):

```bash
docker compose up --build
```

---

## 6. Updating the Model

1. Replace `models_saved/model.keras` (and `feature_order.json` if needed).
2. Commit & push → Render rebuilds the image.
3. Verify new model readiness at `/api/config` (`model_ready: true`).

---

## 7. Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| CORS error | Frontend origin not listed | Update CORS_ORIGINS env & redeploy backend |
| 500 on predict | Model path mismatch | Ensure MODEL_PATH matches copied location in image |
| Stale API URL | Incorrect VITE_API_URL at build | Redeploy frontend with corrected value |
| Slow cold start | Model load time | Keep one warm instance (Render plan) |
| High memory | TensorFlow overhead | Upgrade instance or optimize model |

---

## 8. Future Enhancements

- GitHub Actions for automated image builds.
- Runtime config JSON to avoid rebuilding on API URL changes.
- Add metrics (Prometheus) & structured request logging.
- Rate limiting (e.g., slowapi) if public.

### (Added) Runtime Config in This Repo

Implemented via `frontend/public/runtime-config.js` which defines `window.__RUNTIME_CONFIG__.API_BASE`.
Edit or replace that file on the server/CDN to point to a new API without rebuilding the React bundle.

### (Added) Slim Production Dependencies

`requirements-production.txt` excludes heavy optional libraries (`shap`, `rich`, `pytest`, `python-dotenv`).
Dockerfile installs this file if present; fallbacks to full `requirements.txt` otherwise.

---

## 9. Quick Reference

```bash
curl https://api.example.com/api/health
curl -X POST https://api.example.com/api/predict -H 'Content-Type: application/json' \
  -d '{"features":{"age":57,"sex":1,"cp":3,"trestbps":150,"chol":276,"fbs":1,"restecg":2,"thalach":112,"exang":1,"oldpeak":0.6,"slope":1,"ca":1,"thal":1}}'
```

---

Deployment complete. Adjust domains & environment variables, then ship it.
