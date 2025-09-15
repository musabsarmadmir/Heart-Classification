import os
from functools import lru_cache
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv


ROOT = Path(__file__).resolve().parents[3]
BACKEND_DIR = Path(__file__).resolve().parents[2]

# Ensure we read env from backend/.env even when CWD is project root
load_dotenv(BACKEND_DIR / ".env")


def _resolve_path(p: str) -> str:
    q = Path(p)
    if not q.is_absolute():
        q = ROOT / q
    return str(q)


class Settings(BaseModel):
    model_config = {"protected_namespaces": ()}
    api_prefix: str = "/api"
    app_name: str = os.getenv("APP_NAME", "Heart Disease Predictor API")
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    model_path: str = os.getenv(
        "MODEL_PATH",
        str((BACKEND_DIR / "ml_model" / "heart_disease_model.pkl").resolve()),
    )
    feature_order_path: str = os.getenv(
        "FEATURE_ORDER_PATH", str((BACKEND_DIR / "feature_order.json").resolve())
    )
    dataset_path: str = os.getenv(
        "DATASET_PATH", str((ROOT / "dataset" / "heart_cleveland_secondary.csv").resolve())
    )
    cors_origins: str = os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    )

    def model_post_init(self, __context) -> None:  # type: ignore[override]
        # Normalize env-provided relative paths to absolute
        self.model_path = _resolve_path(self.model_path)
        self.feature_order_path = _resolve_path(self.feature_order_path)
        self.dataset_path = _resolve_path(self.dataset_path)


@lru_cache()
def get_settings() -> Settings:
    return Settings()
