# WellMind AI — `notebook/` folder

All ML **data, training notebooks, models, and metrics** live here. Paths are defined in **`paths.py`** — notebooks should `from paths import ...` instead of hard-coded filenames.

## Folder layout

```
notebook/
├── paths.py                 # Single source of truth for all paths
├── README.md
├── 1_preprocessing.ipynb    # Clean data → train/test CSV + encoders
├── 2_train_models.ipynb     # Train ≥3 models → metrics + .pkl
├── 3_clustering.ipynb       # K-Means / Agglomerative clusters
├── 4_inference.ipynb        # Inference demo (same as inference.py)
├── inference.py             # API /predict — keep in sync with 4_inference.ipynb
├── data/
│   ├── raw/
│   │   └── Sleep_Data_Sampled.csv   # Original dataset (15k rows)
│   ├── train_processed.csv
│   ├── test_processed.csv
│   └── test_targets.csv
├── artifacts/               # Saved models & encoders (after notebook 1 & 2)
│   ├── encoders.pkl
│   ├── scaler.pkl
│   ├── feature_cols.pkl
│   ├── num_feature_cols.pkl
│   ├── target_encoder.pkl
│   ├── best_model.pkl         # Production winner (XGBoost)
│   └── all_models.pkl         # Optional — all models for API compare
├── outputs/                   # Tables & JSON reports
│   ├── model_comparison.csv
│   ├── clustering_results.csv
│   └── best_model_report.json # Optional export for UI
└── plots/                     # Figures from notebooks (created on run)
```

## Run order

1. **`1_preprocessing.ipynb`** — writes `data/*.csv` and `artifacts/encoders.pkl`, etc.  
2. **`2_train_models.ipynb`** — writes `outputs/model_comparison.csv`, `artifacts/best_model.pkl`  
3. **`3_clustering.ipynb`** — writes `outputs/clustering_results.csv`
4. **`4_inference.ipynb`** — demo + same code as **`notebook/inference.py`** (API `/predict`)

## API `/predict`

**Only** `notebook/inference.py` (from your **4_inference** notebook). No `ml_predict`, no rule-based fallback on `/predict`.

- `outputs/model_comparison.csv` → `/models/comparison`
- `artifacts/*.pkl` → preprocessing & `/predict/all-models`

Do **not** duplicate data under a separate `dataset/` folder — keep everything under this tree.
