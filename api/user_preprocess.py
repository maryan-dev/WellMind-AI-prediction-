"""Map API / form payload to raw training columns and scale with notebook artifacts."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List

import joblib
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
NOTEBOOK = ROOT / "notebook"
ARTIFACTS = NOTEBOOK / "artifacts"


def _pkl(name: str) -> Path:
    p = ARTIFACTS / name
    return p if p.is_file() else NOTEBOOK / name


ENCODERS_PKL = _pkl("encoders.pkl")
SCALER_PKL = _pkl("scaler.pkl")
NUM_FEATURE_COLS_PKL = _pkl("num_feature_cols.pkl")
FEATURE_COLS_PKL = _pkl("feature_cols.pkl")

STRESS_MAP = {"Low": 3, "Medium": 6, "High": 8}
ACTIVITY_MAP = {"Low": 30, "Moderate": 60, "High": 90}
OCCUPATION_UI_MAP = {
    "Student": "Accountant",
    "Office Worker": "Accountant",
    "Remote Worker": "Software Engineer",
    "Driver": "Sales Representative",
    "Teacher": "Teacher",
    "Healthcare": "Nurse",
    "Business": "Lawyer",
    "Other": "Engineer",
}
BMI_UI_MAP = {
    "underweight": "Normal Weight",
    "normal": "Normal Weight",
    "overweight": "Overweight",
    "obese": "Obese",
    "normal weight": "Normal Weight",
}


def _parse_stress(v: Any) -> int:
    if isinstance(v, str) and v in STRESS_MAP:
        return STRESS_MAP[v]
    try:
        return int(v)
    except (TypeError, ValueError):
        return 5


def _parse_activity(v: Any) -> float:
    if isinstance(v, str) and v in ACTIVITY_MAP:
        return float(ACTIVITY_MAP[v])
    try:
        return float(v)
    except (TypeError, ValueError):
        return 60.0


def payload_to_raw_row(payload: Dict[str, Any]) -> Dict[str, Any]:
    bmi_raw = str(payload.get("bmi_category") or payload.get("bmiCategory") or "Normal")
    bmi = BMI_UI_MAP.get(bmi_raw.strip().lower(), bmi_raw)

    occ_ui = str(payload.get("occupation") or "Other").strip()
    occupation = OCCUPATION_UI_MAP.get(occ_ui, occ_ui)

    disorder = str(payload.get("sleep_disorder") or payload.get("sleepDisorder") or "No")
    if disorder.lower() in ("no", "healthy"):
        disorder = "Healthy"
    elif disorder.lower() == "insomnia":
        disorder = "Insomnia"
    elif "apnea" in disorder.lower():
        disorder = "Sleep Apnea"

    return {
        "Age": int(payload.get("age") or 30),
        "Gender": str(payload.get("gender") or "Male"),
        "Occupation": occupation,
        "Sleep Duration": float(payload.get("sleep_duration") or payload.get("sleepDuration") or 7),
        "Quality of Sleep": int(payload.get("sleep_quality") or payload.get("sleepQuality") or 7),
        "Physical Activity Level": _parse_activity(
            payload.get("physical_activity_level") or payload.get("physicalActivityLevel")
        ),
        "Stress Level": _parse_stress(payload.get("stress_level") or payload.get("stressLevel")),
        "BMI Category": bmi,
        "Daily Steps": int(payload.get("daily_steps") or payload.get("dailySteps") or 6000),
        "Sleep Disorder": disorder,
    }


def _safe_transform(le, value: str) -> int:
    classes = list(le.classes_)
    if value in classes:
        return int(le.transform([value])[0])
    for c in classes:
        if str(c).lower() == value.lower():
            return int(le.transform([c])[0])
    return int(le.transform([classes[0]])[0])


def raw_row_to_features(row: Dict[str, Any]) -> pd.DataFrame:
    if not all(p.is_file() for p in (ENCODERS_PKL, SCALER_PKL, NUM_FEATURE_COLS_PKL, FEATURE_COLS_PKL)):
        raise FileNotFoundError(
            "Missing notebook encoders/scaler. Run notebook/1_preprocessing.ipynb first."
        )
    encoders = joblib.load(ENCODERS_PKL)
    scaler = joblib.load(SCALER_PKL)
    num_cols: List[str] = joblib.load(NUM_FEATURE_COLS_PKL)
    feature_cols: List[str] = joblib.load(FEATURE_COLS_PKL)

    df = pd.DataFrame([row])
    for col, le in encoders.items():
        df[col] = _safe_transform(le, str(df[col].iloc[0]))

    df[num_cols] = scaler.transform(df[num_cols].astype(float))
    return df[feature_cols]


def form_to_feature_row(form: Dict[str, Any]) -> pd.DataFrame:
    """Frontend camelCase form -> features."""
    payload = {
        "age": form.get("age"),
        "gender": form.get("gender"),
        "occupation": form.get("occupation"),
        "sleep_duration": form.get("sleepDuration"),
        "sleep_quality": form.get("sleepQuality"),
        "physical_activity_level": form.get("physicalActivityLevel"),
        "stress_level": form.get("stressLevel"),
        "bmi_category": form.get("bmiCategory"),
        "daily_steps": form.get("dailySteps"),
        "sleep_disorder": form.get("sleepDisorder"),
    }
    return raw_row_to_features(payload_to_raw_row(payload))
