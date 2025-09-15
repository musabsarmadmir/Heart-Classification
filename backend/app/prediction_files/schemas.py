from pydantic import BaseModel, Field
from typing import List, Dict, Any
import json
from pathlib import Path


def load_feature_order(path: str) -> List[str]:
    p = Path(path)
    with p.open("r", encoding="utf-8") as f:
        return json.load(f)


class HealthResponse(BaseModel):
    status: str = "ok"


class ModelInfo(BaseModel):
    name: str
    version: str
    features: List[str]


class PredictRequest(BaseModel):
    features: Dict[str, float] = Field(
        ..., description="Mapping of feature name to numeric value"
    )


class PredictResponse(BaseModel):
    probability: float = Field(..., ge=0.0, le=1.0)
    label: int
    details: Dict[str, Any] | None = None


class BatchPredictRequest(BaseModel):
    rows: List[Dict[str, float]]


class BatchPredictResponse(BaseModel):
    probabilities: List[float]
    labels: List[int]
