<div align="center">
  <h1>❤️ Heart Classification Web App</h1>
  <p><strong>End-to-end heart disease risk prediction demo.</strong><br/>
  FastAPI backend + ML model • React (Vite + TypeScript + Tailwind + shadcn-ui) frontend • Container-ready • Runtime configurable.</p>
  <em>Not for clinical or diagnostic use.</em>
  <br/>
  <br/>
</div>

---

## 📚 Table of Contents

1. Overview  
2. Architecture  
3. Project Structure  
4. Features (Product & Technical)  
5. Quick Start (Local)  
6. Backend Details  
7. Frontend Details  
8. API Specification  
9. Configuration & Environment  
10. Runtime Config (No Rebuild API URL)  
11. Docker & Deployment  
12. Production Hardening Checklist  
13. Model Lifecycle & Optimization  
14. Testing Strategy (Suggested)  
15. Monitoring & Observability (Optional)  
16. Roadmap / Ideas  
17. Troubleshooting  
18. License & Disclaimer

---

## 1. Overview

This repository contains a demonstration application that collects standard clinical features (age, cholesterol, etc.) and returns a probabilistic risk-style prediction using a trained model (Keras or joblib). It emphasizes clean UI/UX, configurable deployment, and a pathway to future optimization (ONNX / TFLite) without rewriting core logic.

---

## 2. Architecture

Layer | Technology | Notes
----- | ---------- | -----
Frontend | React + Vite + TypeScript + Tailwind + shadcn-ui | Dynamic runtime config for API base
Backend | FastAPI (Uvicorn ASGI) | Synchronous prediction path; easy to extend
Model Runtime | TensorFlow/Keras or scikit-learn/joblib | Auto-detection by file extension
Data Contract | `feature_order.json` | Guarantees consistent input ordering at inference
Containerization | Docker (`backend/Dockerfile`) | Slim Python base; production trimming possible
Runtime Config | `public/runtime-config.js` | Overrides API endpoint post-build

---

## 3. Project Structure

```
backend/              FastAPI app (routers, settings, prediction logic)
  app/
    core/config.py    Settings + env loading
    api/endpoints.py  REST endpoints (health, predict, batch, info)
    prediction_files/ predictor.py, schemas.py, feature loading
frontend/             React client (form, theming, persistence, history)
models_saved/         Model artifact(s) + feature_order.json
dataset/              Development/reference dataset
notebooks/            Exploratory & evaluation notebooks
README.md             (You are here)
deployment.md         Extended deployment notes (Render / alternatives)
docker-compose.yml    Local orchestration (backend focus)
```

---

## 4. Features

### Product Features
- Clean responsive UI with light/dark themes and a neutral beige/red palette
- Input validation with min/max visual feedback
- Feature guide accordion (single open + persistence)
- Last 3 predictions stored per browser (localStorage)
- Accessible focus styles and keyboard-friendly components

### Technical Features
- FastAPI schema-driven validation (Pydantic models)
- Batch prediction endpoint
- Dynamic runtime API base (swap backend URL without rebuilding frontend)
- Model format flexibility: `.pkl`, `.h5`, `.keras`, TensorFlow SavedModel
- Environment-based CORS origin control
- Production dependency slimming via optional `requirements-production.txt`

---

## 5. Quick Start (Local Development)

### Backend
```powershell
cd "C:\Users\Musab Sarmad\Desktop\Heart Classification Web App"
python -m venv .venv
. .venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r backend/requirements.txt
copy backend\.env.example backend\.env  # or create manually
uvicorn backend.app.main:app --reload --port 8000
```
Backend runs at: http://localhost:8000

### Frontend
```powershell
cd "C:\Users\Musab Sarmad\Desktop\Heart Classification Web App\frontend"
npm install
echo VITE_API_URL=http://localhost:8000 > .env
npm run dev
```
Frontend dev server: http://localhost:5173

---

## 6. Backend Details

File | Responsibility
---- | --------------
`core/config.py` | Loads environment (from `backend/.env`), normalizes paths
`api/endpoints.py` | Exposes REST API routes under `API_PREFIX` (default `/api`)
`prediction_files/predictor.py` | Model loader & inference interface
`prediction_files/schemas.py` | Pydantic request/response models

Model loading logic:
- Detect extension: `.pkl` → joblib model (e.g., scikit-learn)
- `.h5` / `.keras` / directory with `saved_model.pb` → TensorFlow/Keras
- Fails fast if TensorFlow model detected but TensorFlow not installed.

Singleton style: model loads once at import (can refactor to lazy load for faster cold starts).

---

## 7. Frontend Details

Highlights:
- Vite + React 18 + TypeScript
- Tailwind 3 + shadcn-ui + Radix primitives
- `src/lib/api.ts` resolves API base from `window.__RUNTIME_CONFIG__` or `VITE_API_URL`
- Local persistence (theme preference, accordion state, recent predictions)

Build & preview:
```powershell
npm run build
npm run preview
```

---

## 8. API Specification

Base path: `http://<host>:8000` (or configured domain) + `API_PREFIX` (default `/api`).

Endpoint | Method | Description | Response (simplified)
-------- | ------ | ----------- | ----------------------
`/health` | GET | Health/status of model availability | `{ status: "ok" | "model-not-loaded" }`
`/model-info` | GET | Model metadata + ordered feature names | `{ name, version, features[] }`
`/predict` | POST | Single prediction | `{ probability: float (0-1), label: int }`
`/batch-predict` | POST | Multiple rows inference | `{ probabilities: float[], labels: int[] }`
`/config` | GET | Diagnostic (paths, existence flags, readiness) | JSON object

Request body (predict):
```json
{
  "features": { "age": 57, "sex": 1, "cp": 3, "trestbps": 150, "chol": 276, "fbs": 0, "restecg": 2, "thalach": 112, "exang": 1, "oldpeak": 0.6, "slope": 1, "ca": 1, "thal": 1 }
}
```

Error conditions:
- 400: Missing features in payload
- 422: Pydantic validation error
- 503: Model not loaded

---

## 9. Configuration & Environment

Environment variables (via `backend/.env`):

Variable | Default | Purpose
-------- | ------- | -------
`APP_NAME` | Heart Disease Predictor API | FastAPI title
`API_PREFIX` | /api | Route prefix
`LOG_LEVEL` | INFO | Logging verbosity target
`MODEL_PATH` | backend/ml_model/heart_disease_model.pkl | Path to model artifact (override for `.keras` etc.)
`FEATURE_ORDER_PATH` | backend/feature_order.json | JSON list of feature names
`DATASET_PATH` | dataset/heart_cleveland_secondary.csv | Reference dataset path
`CORS_ORIGINS` | http://localhost:5173,http://127.0.0.1:5173 | Allowed browser origins

All relative paths are normalized relative to repository root.

---

## 10. Runtime Config (Frontend)

The file `frontend/public/runtime-config.js` injects a global BEFORE the app bundle loads:
```js
window.__RUNTIME_CONFIG__ = { API_BASE: "https://your-backend.example.com" };
```
Change only this file on the server/CDN to point the frontend at a different backend without rebuilding.

---

## 11. Docker & Deployment

### Backend Docker Build
Dockerfile (simplified): slim Python image → install requirements → copy app + model → run Uvicorn.

Build locally:
```powershell
docker build -f backend/Dockerfile -t heart-backend:local .
docker run -p 8000:8000 heart-backend:local
```

### docker-compose (local)
```powershell
docker compose up --build
```

### Deployment Approaches
- Render / Railway / Fly.io (push image or auto-build)
- CapRover / Coolify (self-hosted PaaS) using existing Dockerfile
- Kubernetes (K3s/MicroK8s) with Deployment + Service + Ingress

### Production Slimming
- Provide `requirements-production.txt` with only runtime deps
- (Optional) Convert model to ONNX or TFLite to remove TensorFlow heavy stack
- Enable lazy model loading to reduce cold memory spike

See `deployment.md` for platform-specific notes and strategies.

---

## 12. Production Hardening Checklist

Category | Action
-------- | ------
Security | Add rate limiting (e.g. slowapi), enable HTTPS at proxy, secret scanning
Observability | Add Prometheus metrics, structured JSON logs, request IDs
Performance | ONNX/TFLite conversion, limit threads (`OMP_NUM_THREADS=1`), lazy load
Reliability | Health endpoint + readiness probe, configure restart policy
CI/CD | Automated build, vulnerability scan (Trivy, pip-audit) before deploy

---

## 13. Model Lifecycle & Optimization

Step | Purpose
---- | -------
Baseline evaluation | Validate accuracy and calibration on held-out set (see notebooks)
Drift monitoring | Compare live feature distributions to training (PSI/KS test)
Conversion (ONNX) | Reduce memory + inference latency; drop TF runtime if not needed
Quantization | Further size/speed gains (TFLite / ONNXRuntime quantization)
Distillation | Train smaller model that mimics original for edge deploys

---

## 14. Testing Strategy (Suggested)

Test Type | Description
--------- | -----------
Unit | Predictor preprocessing, missing feature detection
Golden Prediction | Fixed input vector -> stable probability within tolerance
Schema | OpenAPI spec diff vs previous commit
Load | k6 / Locust small concurrency to record latency distribution

---

## 15. Monitoring & Observability (Optional Additions)

Component | Tooling
--------- | -------
Metrics | prometheus-fastapi-instrumentator + Prometheus + Grafana dashboards
Logs | JSON stdout aggregated by Loki or ELK
Tracing | OpenTelemetry + Jaeger/Tempo (spans for prediction lifecycle)
Alerts | Prometheus Alertmanager (latency/error thresholds)

---

## 16. Roadmap / Ideas

- Lazy model loading (singleton accessor)
- ONNX export path and runtime replacement
- Add metrics & tracing middleware
- GitHub Actions pipeline (lint, build, scan, deploy)
- Multi-model version endpoint with A/B flag
- Edge deploy of frontend + CDN runtime-config injection
- Rate limiting & API key (optional) layer

---

## 17. Troubleshooting

Issue | Likely Cause | Fix
----- | ------------ | ---
Frontend blank | Wrong API base / CORS block | Check `runtime-config.js` & browser console
`model-not-loaded` | Artifact path mismatch | Verify `MODEL_PATH` and file exists in container
400 missing features | Payload incomplete | Ensure client sends all names in `feature_order.json`
CORS errors | Origin not allowed | Add origin to `CORS_ORIGINS` and restart API
High memory usage | TensorFlow overhead | Convert to ONNX/TFLite or prune dependencies

---

## 18. License & Disclaimer

No explicit license provided yet (defaults to “all rights reserved”). Add an OSS license (MIT/Apache-2.0) if you intend public reuse.

Medical Disclaimer: This application is for educational demonstration only and is not a medical device. Do not use for diagnosis or treatment decisions.

---

### ✨ Contributions & Extensions
Issue suggestions, forks, and performance experiments welcome. If you implement ONNX or lazy loading, consider contributing back a PR.

---

<sub>Generated and curated to reflect the current repository state.</sub>
