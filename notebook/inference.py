"""
API inference — keep in sync with notebook/4_inference.ipynb.

Do not add separate predict paths (no ml_predict / rule-based on /predict).
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, Optional, Tuple

import joblib
import numpy as np
import pandas as pd

NOTEBOOK_DIR = Path(__file__).resolve().parent
ROOT = NOTEBOOK_DIR.parent

CAT_FEATURE_COLS = ["Gender", "Occupation", "BMI Category", "Sleep Disorder"]

_model = None
_target_encoder = None
_encoders = None
_scaler = None
_num_feature_cols = None
_feature_cols = None
_best_name = "XGBoost"
_load_error: Optional[str] = None


def load_error() -> Optional[str]:
    return _load_error


def load_artifacts() -> Tuple[Any, Dict[str, Any]]:
    global _model, _target_encoder, _encoders, _scaler, _num_feature_cols, _feature_cols, _best_name, _load_error
    import sys

    sys.path.insert(0, str(NOTEBOOK_DIR))
    from paths import (
        BEST_MODEL_PKL,
        ENCODERS_PKL,
        FEATURE_COLS_PKL,
        NUM_FEATURE_COLS_PKL,
        SCALER_PKL,
        TARGET_ENCODER_PKL,
    )

    _load_error = None
    try:
        for path in (
            BEST_MODEL_PKL,
            TARGET_ENCODER_PKL,
            ENCODERS_PKL,
            SCALER_PKL,
            NUM_FEATURE_COLS_PKL,
            FEATURE_COLS_PKL,
        ):
            if not path.is_file():
                raise FileNotFoundError(f"Missing {path} — run 1_preprocessing & 2_train_models first.")

        _model = joblib.load(BEST_MODEL_PKL)
        _target_encoder = joblib.load(TARGET_ENCODER_PKL)
        _encoders = joblib.load(ENCODERS_PKL)
        _scaler = joblib.load(SCALER_PKL)
        _num_feature_cols = joblib.load(NUM_FEATURE_COLS_PKL)
        _feature_cols = joblib.load(FEATURE_COLS_PKL)

        try:
            sys.path.insert(0, str(ROOT / "api"))
            from notebook_data import load_model_report

            _best_name = load_model_report().get("best_model") or "XGBoost"
        except Exception:
            _best_name = "XGBoost"

        artifacts = {
            "target_encoder": _target_encoder,
            "encoders": _encoders,
            "scaler": _scaler,
            "num_feature_cols": _num_feature_cols,
            "feature_cols": _feature_cols,
            "best_name": _best_name,
        }
        return _model, artifacts
    except Exception as exc:
        _load_error = str(exc)
        raise


def _api_payload_to_row(payload: Dict[str, Any]) -> Dict[str, Any]:
    import sys

    sys.path.insert(0, str(ROOT / "api"))
    from user_preprocess import payload_to_raw_row

    return payload_to_raw_row(payload)


def _encode_row(row: Dict[str, Any]) -> pd.DataFrame:
    assert _encoders is not None and _scaler is not None and _num_feature_cols is not None
    assert _feature_cols is not None

    df = pd.DataFrame([row])
    for col in CAT_FEATURE_COLS:
        le = _encoders[col]
        val = df[col].iloc[0]
        if val not in le.classes_:
            val = le.classes_[0]
        df[col] = le.transform([val])

    df[_num_feature_cols] = _scaler.transform(df[_num_feature_cols].astype(float))
    return df[_feature_cols]


def _sleep_hours_points(hours: float) -> float:
    if hours < 5:
        return 30
    if hours < 7:
        return 55
    if hours <= 9:
        return 90
    return 70


def _wellness_from_row(row: Dict[str, Any]) -> Dict[str, float]:
    sleep = float(row["Sleep Duration"])
    quality = float(row["Quality of Sleep"])
    pal = min(max(float(row["Physical Activity Level"]), 30), 90)
    steps = float(row["Daily Steps"])
    stress = float(row["Stress Level"])

    sleep_score = _sleep_hours_points(sleep) * 0.5 + (quality / 10 * 100) * 0.5
    activity_score = ((pal - 30) / 60 * 100) * 0.5 + min(steps / 10000 * 100, 100) * 0.5
    stress_index = stress * 10
    fatigue_score = (100 - sleep_score) * 0.4 + stress_index * 0.35 + (100 - activity_score) * 0.25
    wellness_score = (
        sleep_score * 0.35
        + activity_score * 0.30
        + (100 - stress_index) * 0.20
        + (100 - fatigue_score) * 0.15
    )
    return {
        "sleep_score": round(sleep_score, 1),
        "activity_score": round(activity_score, 1),
        "stress_index": round(stress_index, 1),
        "fatigue_score": round(fatigue_score, 1),
        "energy_score": round(100 - fatigue_score, 1),
        "wellness_score": int(round(wellness_score)),
    }


def _recommendations_notebook4(row: Dict[str, Any]) -> list[str]:
    """Same rules as 4_inference.ipynb section 6 (string format)."""
    icons = {"positive": "\u2705", "warning": "\u26a0\ufe0f", "neutral": "\u2022"}
    out: list[str] = []

    def push(category: str, tone: str, text: str) -> None:
        out.append(f"{icons[tone]} [{category}] {text}")

    sleep = float(row["Sleep Duration"])
    sleep_quality_val = float(row["Quality of Sleep"])
    stress_level_val = float(row["Stress Level"])
    steps_val = float(row["Daily Steps"])
    pal = float(row["Physical Activity Level"])
    activity_label = "Low" if pal <= 40 else "High" if pal >= 75 else "Moderate"

    bmi_raw = str(row["BMI Category"]).lower()
    if "under" in bmi_raw:
        bmi_label = "Underweight"
    elif "obese" in bmi_raw:
        bmi_label = "Obese"
    elif "over" in bmi_raw:
        bmi_label = "Overweight"
    else:
        bmi_label = "Normal"

    disorder_raw = str(row["Sleep Disorder"]).lower()
    if "insomnia" in disorder_raw:
        disorder_label = "Insomnia"
    elif "apnea" in disorder_raw:
        disorder_label = "Sleep Apnea"
    else:
        disorder_label = "None"

    if sleep < 5:
        for t in [
            "You're not sleeping enough - this can hurt your health.",
            "Try to sleep 2-3 hours more each night.",
            "Turn off screens before bed.",
            "Try going to bed before 10:30 PM.",
        ]:
            push("Sleep Duration", "warning", t)
    elif sleep < 7:
        for t in [
            "Try to get about 1 more hour of sleep.",
            "Go to bed at the same time every night.",
            "Skip coffee or tea in the evening.",
        ]:
            push("Sleep Duration", "warning", t)
    elif sleep <= 9:
        for t in [
            "You're getting a great amount of sleep!",
            "Keep doing what you're doing.",
            "Stick to your current sleep routine.",
        ]:
            push("Sleep Duration", "positive", t)
    else:
        push("Sleep Duration", "neutral", "You're sleeping more than most people.")
        push("Sleep Duration", "neutral", "If you still feel tired, it may help to see a doctor.")

    if sleep_quality_val <= 5:
        push(
            "Sleep Quality",
            "warning",
            "Your sleep isn't very restful - try a darker room and less caffeine late in the day.",
        )
    elif sleep_quality_val >= 8:
        push("Sleep Quality", "positive", "You're sleeping well - keep your bedtime routine going.")

    if stress_level_val <= 3:
        push("Stress Level", "positive", "You're handling stress really well.")
        push("Stress Level", "positive", "Keep doing what's working for you.")
    elif stress_level_val <= 6:
        for t in [
            "Take short breaks during your day.",
            "Try some deep breathing when you feel tense.",
            "Make time to rest, not just work.",
        ]:
            push("Stress Level", "warning", t)
    else:
        for t in [
            "Your stress level is high right now.",
            "Try a relaxing activity, like a walk or music.",
            "See if you can lighten your workload.",
            "Getting enough sleep can help lower stress too.",
        ]:
            push("Stress Level", "warning", t)

    if steps_val < 4000:
        push("Daily Steps", "warning", "Try to walk a little more each day.")
        push("Daily Steps", "warning", "Aim for 6,000-8,000 steps a day.")
    elif steps_val < 8000:
        push("Daily Steps", "warning", "You're doing well - keep it up!")
        push("Daily Steps", "warning", "Try to reach 8,000-10,000 steps a day.")
    else:
        push("Daily Steps", "positive", "Great job staying active!")
        push("Daily Steps", "positive", "Keep up your current activity level.")

    if activity_label == "Low":
        push("Physical Activity", "warning", "Try adding 20-30 minutes of exercise to your day.")
        push("Physical Activity", "warning", "A daily walk is a great place to start.")
    elif activity_label == "Moderate":
        push("Physical Activity", "positive", "You have a good activity level.")
        push("Physical Activity", "positive", "Keep exercising regularly.")
    else:
        push("Physical Activity", "positive", "You're very active - great job!")
        push("Physical Activity", "positive", "Remember to rest and drink enough water.")

    if bmi_label == "Underweight":
        for t in [
            "Try eating more nutrient-rich foods.",
            "Add more healthy calories to your meals.",
            "Foods like eggs, fish, beans, milk, and nuts can help.",
        ]:
            push("BMI Category", "warning", t)
    elif bmi_label == "Normal":
        push("BMI Category", "positive", "You're maintaining a healthy weight.")
        push("BMI Category", "positive", "Keep up your balanced diet and exercise.")
    elif bmi_label == "Overweight":
        for t in [
            "Try cutting back on sugary drinks.",
            "Eat more vegetables and lean protein.",
            "A daily walk can help a lot.",
            "Try to eat less processed food.",
        ]:
            push("BMI Category", "warning", t)
    else:
        for t in [
            "It's a good idea to check in with a doctor.",
            "Try to eat a balanced diet.",
            "Slowly add more physical activity to your routine.",
            "Cut back on sugar and fast food where you can.",
        ]:
            push("BMI Category", "warning", t)

    if disorder_label == "None":
        push("Sleep Disorder", "positive", "No sleep problems reported - that's great.")
        push("Sleep Disorder", "positive", "Keep up your healthy sleep habits.")
    elif disorder_label == "Insomnia":
        for t in [
            "Try to go to bed at the same time every night.",
            "Avoid caffeine later in the day.",
            "Put screens away before bed.",
        ]:
            push("Sleep Disorder", "warning", t)
    else:
        for t in [
            "It may help to see a doctor about this.",
            "Maintaining a healthy weight can help.",
            "Sleeping on your side may help, if your doctor recommends it.",
        ]:
            push("Sleep Disorder", "warning", t)

    return out[:15]


def predict(payload: Dict[str, Any], model_bundle: Any, artifacts: Dict[str, Any]) -> Dict[str, Any]:
    row = _api_payload_to_row(payload)
    X = _encode_row(row)

    model = model_bundle
    target_encoder = artifacts["target_encoder"]
    best_name = artifacts.get("best_name") or _best_name

    pred_enc = int(model.predict(X)[0])
    pred_label = str(target_encoder.inverse_transform([pred_enc])[0])

    confidence = 0.85
    if hasattr(model, "predict_proba"):
        confidence = float(np.max(model.predict_proba(X)[0]))

    scores = _wellness_from_row(row)
    wellness = scores["wellness_score"]
    stress = float(row["Stress Level"])
    sleep = float(row["Sleep Duration"])
    steps = int(row["Daily Steps"])

    if stress >= 7:
        cluster_name = "High Stress User"
    elif wellness >= 70 and sleep >= 7:
        cluster_name = "Healthy Lifestyle User"
    elif steps < 5500:
        cluster_name = "Low Activity User"
    else:
        cluster_name = "Balanced Lifestyle Group"

    recommendations = _recommendations_notebook4(row)

    return {
        "prediction": pred_label,
        "lifestyle_category": pred_label,
        "wellness_score": wellness,
        "confidence": round(confidence, 4),
        "recommendations": recommendations,
        "recommendation_details": None,
        "cluster_label": 0,
        "cluster_name": cluster_name,
        "scores": {
            "sleep_score": scores["sleep_score"],
            "activity_score": scores["activity_score"],
            "stress_index": scores["stress_index"],
            "fatigue_score": scores["fatigue_score"],
            "energy_score": scores["energy_score"],
        },
        "model_name": best_name,
    }
