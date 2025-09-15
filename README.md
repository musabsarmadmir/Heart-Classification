# Backend (FastAPI + TensorFlow)

This backend serves a heart disease prediction model via a FastAPI REST API. It supports TensorFlow/Keras SavedModels (`saved_model/`), `.keras`/`.h5`, and optionally `.pkl` models.

## Setup

1) Create/activate a virtual environment and install deps:

```powershell
python -m venv .venv
. .venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r backend/requirements.txt
```

2) Copy environment example if needed and adjust:

```powershell
Copy-Item backend\.env.example backend\.env
```

## Export Model from Notebook

From `backend/testing_eval.ipynb`, after training/evaluating, save the model to one of these paths:

- SavedModel directory: `backend/ml_model/saved_model/` (contains `saved_model.pb`)
- Keras file: `backend/ml_model/heart_disease_model.keras`
- H5 file: `backend/ml_model/heart_disease_model.h5`

The API reads `MODEL_PATH` from `.env` (defaults to `backend/ml_model/heart_disease_model.pkl`, change it for TF):

```env
MODEL_PATH=backend/ml_model/heart_disease_model.keras
```

Example Keras save:

```python
from tensorflow import keras
keras.models.save_model(model, 'backend/ml_model/heart_disease_model.keras')
# or SavedModel directory
model.save('backend/ml_model/saved_model')
```

Ensure the input feature order matches `backend/feature_order.json`.

## Run the API

```powershell
. .venv\Scripts\Activate.ps1
$env:MODEL_PATH = "backend/ml_model/heart_disease_model.keras"  # or your path
uvicorn backend.app.main:app --reload --port 8000
```

Health check: `GET http://localhost:8000/api/health`

Predict: `POST http://localhost:8000/api/predict`

```json
{
  "features": {
    "age": 57, "sex": 1, "cp": 3, "trestbps": 150, "chol": 276,
    "fbs": 0, "restecg": 2, "thalach": 112, "exang": 1,
    "oldpeak": 0.6, "slope": 1, "ca": 1, "thal": 1
  }
}
```

Response:

```json
{"probability": 0.72, "label": 1}
```

## Notes

- For SavedModel directories, set `MODEL_PATH=backend/ml_model/saved_model`.
- CORS is enabled for `http://localhost:5173` by default for the Vite frontend.
- If using `.pkl` models, scikit-learn joblib loading is also supported.
