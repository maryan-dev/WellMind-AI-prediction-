"""Prediction when ML bundle is unavailable — scores + feature recommendations."""

from __future__ import annotations

from typing import Any, Dict

from recommendation_engine import build_feature_recommendations, recommendations_as_strings

STRESS_MAP = {"Low": 3, "Medium": 6, "High": 8}
ACTIVITY_MAP = {"Low": 30, "Moderate": 60, "High": 90}


def _num_stress(v: Any) -> int:
    if isinstance(v, str) and v in STRESS_MAP:
        return STRESS_MAP[v]
    try:
        return max(1, min(10, int(v)))
    except (TypeError, ValueError):
        return 5


def _num_activity(v: Any) -> float:
    if isinstance(v, str) and v in ACTIVITY_MAP:
        return float(ACTIVITY_MAP[v])
    try:
        return float(v)
    except (TypeError, ValueError):
        return 60.0


def predict_fallback(payload: Dict[str, Any]) -> Dict[str, Any]:
    sleep = float(payload.get("sleep_duration") or 7)
    quality = int(payload.get("sleep_quality") or 7)
    stress = _num_stress(payload.get("stress_level"))
    activity = _num_activity(payload.get("physical_activity_level"))
    steps = int(payload.get("daily_steps") or 6000)

    duration_score = 30 if sleep < 5 else 55 if sleep < 7 else 90 if sleep <= 9 else 70
    sleep_score = round((duration_score * 0.5 + (quality / 10) * 100 * 0.5), 1)
    pal_norm = ((min(90, max(30, activity)) - 30) / 60) * 100
    steps_norm = min(100, steps / 10000 * 100)
    activity_score = round(pal_norm * 0.5 + steps_norm * 0.5, 1)
    stress_index = stress * 10
    fatigue = round(min(100, (100 - sleep_score) * 0.4 + stress_index * 0.35 + (100 - activity_score) * 0.25), 1)
    energy = round(100 - fatigue, 1)
    wellness = round(
        min(
            100,
            sleep_score * 0.38
            + activity_score * 0.32
            + (100 - stress_index) * 0.20
            + (100 - fatigue) * 0.10,
        )
    )

    category = "Average"
    if wellness >= 75:
        category = "Healthy"
    elif wellness < 50:
        category = "Poor"

    if stress >= 7:
        cluster_name = "High Stress User"
    elif wellness >= 70 and sleep >= 7:
        cluster_name = "Healthy Lifestyle User"
    elif steps < 5500:
        cluster_name = "Low Activity User"
    else:
        cluster_name = "Balanced Lifestyle Group"

    rec_items = build_feature_recommendations(payload)
    return {
        "prediction": category,
        "lifestyle_category": category,
        "wellness_score": int(wellness),
        "confidence": 0.82,
        "recommendations": recommendations_as_strings(rec_items),
        "recommendation_details": rec_items,
        "cluster_label": 0,
        "cluster_name": cluster_name,
        "scores": {
            "sleep_score": sleep_score,
            "activity_score": activity_score,
            "stress_index": stress_index,
            "fatigue_score": fatigue,
            "energy_score": energy,
        },
        "model_name": "Rule-based (ML model not loaded)",
    }
