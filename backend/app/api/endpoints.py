from fastapi import APIRouter, HTTPException
from ..prediction_files.schemas import (
    HealthResponse,
    ModelInfo,
    PredictRequest,
    PredictResponse,
    BatchPredictRequest,
    BatchPredictResponse,
    load_feature_order,
)
from ..core.config import get_settings
from ..prediction_files.predictor import Predictor
from pathlib import Path


router = APIRouter()
settings = get_settings()
_feature_order = load_feature_order(settings.feature_order_path)
_predictor = Predictor(settings.model_path, _feature_order)


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    status = "ok" if _predictor.ready() else "model-not-loaded"
    return HealthResponse(status=status)


@router.get("/model-info", response_model=ModelInfo)
def model_info() -> ModelInfo:
    return ModelInfo(name="heart-disease-model", version="1.0.0", features=_feature_order)


@router.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest) -> PredictResponse:
    missing = [f for f in _feature_order if f not in req.features]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing features: {missing}")
    if not _predictor.ready():
        raise HTTPException(status_code=503, detail="Model not loaded")
    proba, label = _predictor.predict_row(req.features)
    return PredictResponse(probability=proba, label=label)


@router.post("/batch-predict", response_model=BatchPredictResponse)
def batch_predict(req: BatchPredictRequest) -> BatchPredictResponse:
    if not _predictor.ready():
        raise HTTPException(status_code=503, detail="Model not loaded")
    for i, row in enumerate(req.rows):
        missing = [f for f in _feature_order if f not in row]
        if missing:
            raise HTTPException(status_code=400, detail=f"Row {i} missing features: {missing}")
    probas, labels = _predictor.predict_batch(req.rows)
    return BatchPredictResponse(probabilities=probas, labels=labels)


@router.get("/config")
def config_info():
    mp = Path(settings.model_path)
    fp = Path(settings.feature_order_path)
    dp = Path(settings.dataset_path)
    return {
        "app_name": settings.app_name,
        "api_prefix": settings.api_prefix,
        "log_level": settings.log_level,
        "cors_origins": [o.strip() for o in settings.cors_origins.split(",") if o.strip()],
        "model_path": str(mp),
        "model_path_exists": mp.exists(),
        "feature_order_path": str(fp),
        "feature_order_path_exists": fp.exists(),
        "dataset_path": str(dp),
        "dataset_path_exists": dp.exists(),
        "feature_count": len(_feature_order),
        "model_ready": _predictor.ready(),
    }
