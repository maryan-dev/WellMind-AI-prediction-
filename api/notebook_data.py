"""Load ML metrics from notebook/ data (CSV + optional JSON)."""

from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Any, Dict, List

ROOT = Path(__file__).resolve().parent.parent
NOTEBOOK_DIR = ROOT / "notebook"

FEATURES = [
    "Age",
    "Gender",
    "Occupation",
    "Sleep Duration",
    "Quality of Sleep",
    "Physical Activity Level",
    "Stress Level",
    "BMI Category",
    "Daily Steps",
    "Sleep Disorder",
]


def _report_from_csv(csv_path: Path) -> Dict[str, Any]:
    rows: List[Dict[str, Any]] = []
    with csv_path.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for raw in reader:
            model = raw.get("Model") or raw.get("model") or ""
            acc = raw.get("Test Accuracy") or raw.get("Accuracy") or "0"
            f1 = raw.get("Macro F1") or raw.get("macro_f1") or "0"
            prec = raw.get("Precision (macro)") or raw.get("Precision") or acc
            rec = raw.get("Recall (macro)") or raw.get("Recall") or acc
            rows.append(
                {
                    "Model": model,
                    "Accuracy": float(acc),
                    "Precision (macro)": float(prec),
                    "Recall (macro)": float(rec),
                    "Macro F1": float(f1),
                }
            )
    if not rows:
        raise ValueError("model_comparison.csv is empty")
    best = max(rows, key=lambda r: r["Macro F1"])["Model"]
    return {
        "best_model": best,
        "comparison": rows,
        "source": str(csv_path.relative_to(ROOT)),
        "leakage_analysis": {
            "model_training_features": FEATURES,
            "target_definition": {
                "Healthy": "Wellness Score >= 75",
                "Average": "Wellness Score 50–74",
                "Poor": "Wellness Score < 50",
            },
            "design_note": "Metrics from notebook/2_train_models.ipynb on notebook/data train & test CSVs.",
        },
    }


def load_model_report() -> Dict[str, Any]:
    for json_path in (
        NOTEBOOK_DIR / "outputs" / "best_model_report.json",
        NOTEBOOK_DIR / "best_model_report.json",
    ):
        if json_path.is_file():
            return json.loads(json_path.read_text(encoding="utf-8"))
    for csv_path in (
        NOTEBOOK_DIR / "outputs" / "model_comparison.csv",
        NOTEBOOK_DIR / "model_comparison.csv",
    ):
        if csv_path.is_file():
            return _report_from_csv(csv_path)
    raise FileNotFoundError(
        f"No model data in {NOTEBOOK_DIR}. Run notebook/2_train_models.ipynb first."
    )
