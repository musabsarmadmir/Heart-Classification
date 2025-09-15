import os
from functools import lru_cache
from pydantic import BaseModel
from dotenv import load_dotenv


load_dotenv()


class Settings(BaseModel):
    api_prefix: str = "/api"
    app_name: str = os.getenv("APP_NAME", "Heart Disease Predictor API")
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    model_path: str = os.getenv(
        "MODEL_PATH",
        os.path.join("backend", "ml_model", "heart_disease_model.pkl"),
    )
    feature_order_path: str = os.getenv(
        "FEATURE_ORDER_PATH", os.path.join("backend", "feature_order.json")
    )
    dataset_path: str = os.getenv(
        "DATASET_PATH", os.path.join("dataset", "heart_cleveland_secondary.csv")
    )
    cors_origins: str = os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()
