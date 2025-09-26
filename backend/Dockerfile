## Backend Dockerfile for Render (FastAPI + TensorFlow model)
# Simplicity first: single stage using python:3.12-slim.
# If build time or size becomes an issue, introduce a builder stage.

FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PATH="/home/appuser/.local/bin:$PATH"

# System packages sometimes needed by numpy / pandas / TensorFlow wheels.
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
        libglib2.0-0 \
        libhdf5-103-1 \
        liblapack-dev \
        libblas-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements & install first for better layer caching.
# Prefer a slimmer production requirement set if present.
COPY requirements-production.txt requirements.txt /tmp/
RUN pip install --upgrade pip \
 && if [ -f /tmp/requirements-production.txt ]; then pip install -r /tmp/requirements-production.txt; else pip install -r /tmp/requirements.txt; fi

# Copy application code & model artifacts.
COPY backend/app ./backend/app
COPY models_saved ./models_saved

# Default environment values (override in Render dashboard).
ENV MODEL_PATH=/app/models_saved/model.keras \
    FEATURE_ORDER_PATH=/app/models_saved/feature_order.json \
    APP_NAME="Heart Disease Predictor API" \
    LOG_LEVEL=INFO \
    CORS_ORIGINS="https://app.example.com"

# Non-root user for security.
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Production command (no --reload).
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Notes:
# - If TensorFlow dependency errors arise, consider using an official TF image
#   (e.g. tensorflow/tensorflow:2.15.0) or adjust system libs.
# - Remove 'shap' from requirements if not used in production to slim image.
