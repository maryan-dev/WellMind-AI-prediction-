"""WellMind AI — FastAPI uses notebook/4_inference only (notebook/inference.py)."""

from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any, List, Optional, Union

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "api"))
sys.path.insert(0, str(ROOT / "notebook"))

try:
    from inference import load_artifacts, predict, load_error  # noqa: E402
except ImportError:
    load_artifacts = predict = None  # type: ignore
    load_error = lambda: "notebook/inference.py missing — add 4_inference.ipynb export"  # type: ignore

from notebook_data import load_model_report  # noqa: E402
from multi_model_predict import predict_all_models  # noqa: E402

app = FastAPI(
    title="WellMind AI API",
    description="Production predict = notebook 4_inference only",
    version="1.0.0",
)

_default_cors = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173"
_cors_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", _default_cors).split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_model_bundle = None
_artifacts = None


@app.on_event("startup")
def load_models() -> None:
    global _model_bundle, _artifacts
    if load_artifacts is None:
        _model_bundle, _artifacts = None, None
        print(f"[WellMind] {load_error()}")
        return
    try:
        _model_bundle, _artifacts = load_artifacts()
        print("[WellMind] Loaded notebook/4_inference (notebook/inference.py)")
    except Exception as exc:
        _model_bundle, _artifacts = None, None
        print(f"[WellMind] 4_inference not ready: {exc}")


class PredictRequest(BaseModel):
    age: int = Field(..., ge=1, le=120)
    gender: str
    occupation: str
    sleep_duration: float = Field(..., ge=0, le=24)
    sleep_quality: int = Field(..., ge=1, le=10)
    stress_level: Union[int, str] = Field(..., description="1-10 or Low/Medium/High")
    physical_activity_level: Union[int, float, str]
    daily_steps: int = Field(..., ge=0)
    bmi_category: Optional[str] = "Normal Weight"
    sleep_disorder: Optional[str] = "Healthy"


class PredictResponse(BaseModel):
    prediction: str
    lifestyle_category: str
    wellness_score: int
    confidence: float
    recommendations: List[str]
    recommendation_details: Optional[List[dict[str, Any]]] = None
    cluster_label: int
    cluster_name: str
    scores: dict[str, Any]
    model_name: str


@app.get("/health")
def health() -> dict:
    loaded = bool(_model_bundle is not None and _artifacts is not None)
    err = load_error() if not loaded and load_error else None
    return {
        "status": "ok",
        "service": "WellMind AI",
        "predict_source": "notebook/4_inference.ipynb → notebook/inference.py",
        "ml_loaded": loaded,
        "ml_error": err if not loaded else None,
    }


@app.get("/models/comparison")
def models_comparison() -> dict:
    try:
        return load_model_report()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.post("/predict/all-models")
def predict_all_models_endpoint(body: PredictRequest) -> dict:
    try:
        return predict_all_models(body.model_dump())
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/predict", response_model=PredictResponse)
def predict_endpoint(body: PredictRequest) -> dict:
    if _model_bundle is None or _artifacts is None or predict is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "4_inference not loaded. Run notebooks 1 & 2, ensure notebook/artifacts/*.pkl exist, "
                "then restart API."
            ),
        )
    try:
        return predict(body.model_dump(), _model_bundle, _artifacts)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
