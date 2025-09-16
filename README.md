## Heart Classification Web App

End-to-end web application for heart disease risk prediction with:
- Backend: FastAPI serving a trained model (Keras/Pickle) and feature order
- Frontend: Vite + React + TypeScript + Tailwind + shadcn-ui

The app collects clinical parameters, calls the API for prediction, and displays the risk with recent results history. Not for medical use.

---

## Project Structure

```
backend/           FastAPI app, model loader, API routes
frontend/          Vite React app (UI + API client)
dataset/           CSV data used during development
models_saved/      Bundled model + feature_order.json (if provided)
notebooks/         Exploratory/validation notebooks
```

---

## Prerequisites

- Python 3.10+ recommended
- Node.js 18+ and npm
- Windows PowerShell (commands below are PowerShell-ready)

---

## Backend Setup (FastAPI)

1) Create a virtual environment and install dependencies

```powershell
cd "C:\Users\Musab Sarmad\Desktop\Heart Classification Web App"
python -m venv .venv
. .venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r backend/requirements.txt
```

2) Environment variables (`backend/.env`)

Create `backend/.env` (see example values):

```
# Backend
APP_NAME=Heart Disease Predictor API
LOG_LEVEL=INFO
API_PREFIX=/api

# Model & data
MODEL_PATH=backend/models_saved/model.keras
FEATURE_ORDER_PATH=backend/models_saved/feature_order.json
DATASET_PATH=dataset/heart_cleveland_secondary.csv

# CORS (for Vite dev server)
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

3) Run the API

```powershell
. .venv\Scripts\Activate.ps1
uvicorn backend.app.main:app --reload --port 8000
```

API base: `http://localhost:8000`

### API Endpoints

- `GET /api/health` → `{ status: "ok" | "model-not-loaded" }`
- `GET /api/model-info` → `{ name, version, features: string[] }`
- `POST /api/predict` → `{ probability: number, label: 0|1 }`
- `POST /api/batch-predict` → `{ probabilities: number[], labels: number[] }`
- `GET /api/config` → diagnostic info about paths and model readiness

Predict request body example:

```json
{
  "features": {
    "age": 57, "sex": 1, "cp": 3, "trestbps": 150, "chol": 276,
    "fbs": 0, "restecg": 2, "thalach": 112, "exang": 1,
    "oldpeak": 0.6, "slope": 1, "ca": 1, "thal": 1
  }
}
```

---

## Frontend Setup (Vite React)

1) Install dependencies

```powershell
cd "C:\Users\Musab Sarmad\Desktop\Heart Classification Web App\frontend"
npm install
```

2) Configure API URL (`frontend/.env`)

```
VITE_API_URL=http://localhost:8000
```

3) Run in development

```powershell
npm run dev
```

Frontend dev server: `http://localhost:5173`

4) Build & preview production

```powershell
npm run build
npm run preview
```

---

## Features

- Modern UI with Tailwind/shadcn-ui components
- Feature guide accordion with animation and persistence of open section
- Prediction result panel with probabilities
- Recent history: last 3 predictions per browser

---

## Troubleshooting

- Blank screen on frontend
  - Check browser console for runtime errors
  - Verify `VITE_API_URL` matches backend URL
  - Run `npm run build` to catch type or import errors

- CORS errors
  - Ensure `CORS_ORIGINS` in backend `.env` includes your frontend origin
  - Restart `uvicorn` after changes

- Model not loaded
  - `GET /api/health` should return `ok`
  - Check paths in backend `.env` for `MODEL_PATH` and `FEATURE_ORDER_PATH`

---

## Notes for Development

- Path aliases: Frontend uses `@/` → `src/`
- UI library: shadcn-ui primitives + Tailwind utility classes
- Run lint: `npm run lint`
- Update animations: see `frontend/tailwind.config.ts`

---

## Disclaimer

This tool is for educational purposes only and does not provide medical advice. Always consult qualified healthcare professionals for diagnosis or treatment.
