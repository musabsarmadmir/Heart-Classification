from __future__ import annotations

import joblib
import numpy as np
from typing import List, Dict, Tuple, Any
from pathlib import Path


class Predictor:
    def __init__(self, model_path: str, feature_order: List[str]):
        self.model_path = model_path
        self.feature_order = feature_order
        self.model: Any | None = None
        self._load()

    def _load(self) -> None:
        p = Path(self.model_path)
        if not p.exists():
            self.model = None
            return

        suffix = p.suffix.lower()
        if suffix == ".pkl":
            self.model = joblib.load(p)
            return

        # Try TensorFlow/Keras formats if available
        if suffix in {".h5", ".keras"} or (p.is_dir() and (p / "saved_model.pb").exists()):
            try:
                import tensorflow as tf
                from tensorflow import keras # type: ignore
            except Exception as e:  # pragma: no cover - optional dependency
                raise RuntimeError(
                    "TensorFlow model detected but tensorflow is not installed.\n"
                    "Install with: pip install tensorflow==2.20.0"
                ) from e
            self.model = tf.keras.models.load_model(str(p))
            return

        raise ValueError(f"Unsupported model format: {self.model_path}")

    def ready(self) -> bool:
        return self.model is not None

    def preprocess_row(self, features: Dict[str, float]) -> np.ndarray:
        return np.array([[features[name] for name in self.feature_order]], dtype=float)

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        if self.model is None:
            raise RuntimeError("Model not loaded")
        if hasattr(self.model, "predict_proba"):
            return self.model.predict_proba(X)[:, -1]
        # Keras/TF models typically output probabilities with predict
        preds = self.model.predict(X)
        preds = np.array(preds)
        if preds.ndim == 2 and preds.shape[1] == 1:
            preds = preds.ravel()
        elif preds.ndim == 2 and preds.shape[1] == 2:
            preds = preds[:, 1]
        return preds.astype(float)

    def predict_row(self, features: Dict[str, float]) -> Tuple[float, int]:
        X = self.preprocess_row(features)
        proba = float(self.predict_proba(X)[0])
        label = int(round(proba)) if 0.0 <= proba <= 1.0 else int(self.model.predict(X)[0])  # type: ignore[index]
        return proba, label

    def predict_batch(self, rows: List[Dict[str, float]]) -> Tuple[List[float], List[int]]:
        X = np.array([[row[name] for name in self.feature_order] for row in rows], dtype=float)
        probas = self.predict_proba(X)
        y_pred = getattr(self.model, "predict", lambda _: probas)(X)  # type: ignore[call-arg]
        labels = [int(round(p)) if 0.0 <= p <= 1.0 else int(y) for p, y in zip(probas, y_pred)]
        return probas.tolist(), labels
