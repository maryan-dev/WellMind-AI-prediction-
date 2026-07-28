#!/usr/bin/env python3
"""
Sanity checks for the deployed best model (XGBoost).
Run from project root with API up:
  py -3 scripts/run_sanity_checks.py

Or offline (loads notebook artifacts if present):
  py -3 scripts/run_sanity_checks.py --offline
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "api"))

SAMPLES = [
    {
        "label": "Check 1 — strong sleep & activity (expect Healthy or Average)",
        "payload": {
            "age": 32,
            "gender": "Male",
            "occupation": "Engineer",
            "sleep_duration": 8.0,
            "sleep_quality": 9,
            "stress_level": 3,
            "physical_activity_level": 85,
            "daily_steps": 9500,
            "bmi_category": "Normal Weight",
            "sleep_disorder": "Healthy",
        },
    },
    {
        "label": "Check 2 — high stress, low sleep (expect Poor or Average)",
        "payload": {
            "age": 45,
            "gender": "Female",
            "occupation": "Nurse",
            "sleep_duration": 5.0,
            "sleep_quality": 4,
            "stress_level": 9,
            "physical_activity_level": 35,
            "daily_steps": 3200,
            "bmi_category": "Overweight",
            "sleep_disorder": "Insomnia",
        },
    },
    {
        "label": "Check 3 — moderate lifestyle (expect Average)",
        "payload": {
            "age": 28,
            "gender": "Female",
            "occupation": "Teacher",
            "sleep_duration": 7.0,
            "sleep_quality": 7,
            "stress_level": 6,
            "physical_activity_level": 60,
            "daily_steps": 6500,
            "bmi_category": "Normal Weight",
            "sleep_disorder": "Healthy",
        },
    },
]


def run_api(base: str) -> None:
    try:
        import urllib.request
    except ImportError:
        raise SystemExit("urllib required")

    for item in SAMPLES:
        print("\n" + "=" * 60)
        print(item["label"])
        print("Input:", json.dumps(item["payload"], indent=2))
        req = urllib.request.Request(
            f"{base.rstrip('/')}/predict",
            data=json.dumps(item["payload"]).encode(),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = json.loads(resp.read().decode())
        print(
            "Output:",
            json.dumps(
                {
                    "lifestyle_category": body.get("lifestyle_category"),
                    "wellness_score": body.get("wellness_score"),
                    "confidence": body.get("confidence"),
                    "model_name": body.get("model_name"),
                },
                indent=2,
            ),
        )


def run_offline() -> None:
    from predict_service import predict_fallback

    for item in SAMPLES:
        print("\n" + "=" * 60)
        print(item["label"])
        print("Input:", json.dumps(item["payload"], indent=2))
        out = predict_fallback(item["payload"])
        print(
            "Output:",
            json.dumps(
                {
                    "lifestyle_category": out.get("lifestyle_category"),
                    "wellness_score": out.get("wellness_score"),
                    "confidence": out.get("confidence"),
                    "model_name": out.get("model_name"),
                },
                indent=2,
            ),
        )
    print("\n(Offline mode uses rule-based fallback if ML bundle is not loaded.)")


def main() -> None:
    parser = argparse.ArgumentParser(description="WellMind AI — 3 sanity checks on /predict")
    parser.add_argument("--api", default="http://127.0.0.1:8000", help="API base URL")
    parser.add_argument("--offline", action="store_true", help="Run predict_fallback without HTTP")
    args = parser.parse_args()
    if args.offline:
        run_offline()
    else:
        run_api(args.api)


if __name__ == "__main__":
    main()
