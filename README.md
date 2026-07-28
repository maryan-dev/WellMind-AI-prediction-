# WellMind AI

**Lifestyle wellness classification** — predict **Healthy / Average / Poor** from sleep and lifestyle data, with a **FastAPI** backend, **React** web app, and **Flutter** mobile app.

| | |
|---|---|
| **Author** | Maryan |
| **GitHub** | [https://github.com/maryan-dev/WellMind-AI](https://github.com/maryan-dev/WellMind-AI) |
| **Docs** | [project-proposal.md](project-proposal.md) · [project_paper.md](project_paper.md) |

---

## Results summary

We classify lifestyle wellness on **15,000** sleep/lifestyle records using **10** input features. Five algorithms were trained on the same 80/20 split; **XGBoost** achieved the best **Macro F1 ≈ 0.793** (test accuracy **≈ 0.839**) and is deployed for production **`POST /predict`**. Inference follows **`notebook/4_inference.ipynb`** via **`notebook/inference.py`**. Optional UIs show wellness scores, recommendations, and multi-model comparison.

---

## Features

- **ML pipeline:** preprocessing → train ≥5 models → pick best by Macro F1 → save artifacts
- **API:** `/predict` (production model), `/predict/all-models`, `/models/comparison`, `/health`
- **Web (React + Vite):** wellness check, dashboard, ML models page, history
- **Mobile (Flutter):** landing, multi-step wellness check, dashboard, models, profile
- **Clustering (extra):** K-Means / hierarchical analysis in notebook 3
- **Sanity script:** three fixed test payloads in `scripts/run_sanity_checks.py`

---

## Dataset

| Item | Detail |
|------|--------|
| **File** | `notebook/data/raw/Sleep_Data_Sampled.csv` |
| **Rows** | **15,000** (≥ 1,000 required) |
| **Columns** | **13** |
| **Source** | Sleep Health Data (Kaggle) by Imaginative_Coder |
| **Dataset link** | https://www.kaggle.com/datasets/imaginativecoder/sleep-health-data-sampled |
| **Preprocessing** | `notebook/1_preprocessing.ipynb` → `notebook/data/train_processed.csv`, `test_processed.csv` |

This dataset contains **15,000 rows** and **13 columns**, published on Kaggle by **Imaginative_Coder**.

**Model inputs (10):** Age, Gender, Occupation, Sleep Duration, Quality of Sleep, Physical Activity Level, Stress Level, BMI Category, Daily Steps, Sleep Disorder.

**Target:** Lifestyle category — **Healthy**, **Average**, **Poor** (3-class classification).

---

## Algorithms (5 — minimum 3 required)

| Algorithm | Role |
|-----------|------|
| Logistic Regression | Linear baseline |
| Decision Tree | Non-linear baseline |
| Random Forest | Ensemble |
| K-Nearest Neighbors | Instance-based |
| **XGBoost** | **Best model (deployed)** |

Training: **`notebook/2_train_models.ipynb`**. Metrics: **`notebook/outputs/model_comparison.csv`**.

| Algorithm | Test accuracy | Macro F1 | Deployed |
|-----------|---------------|----------|----------|
| **XGBoost** | 0.839 | **0.793** | **Yes** |
| K-Nearest Neighbors | 0.831 | 0.788 | |
| Random Forest | 0.788 | 0.764 | |
| Logistic Regression | 0.780 | 0.764 | |
| Decision Tree | 0.774 | 0.754 | |

**Selection rule:** highest **test Macro F1** on the hold-out set.

**Artifacts (after training):** `notebook/artifacts/best_model.pkl`, encoders, scaler, feature lists (not committed — regenerate with notebook 2).

---

## Project structure

```
WellMind-AI/
├── api/
│   app.py                 # FastAPI entry
│   multi_model_predict.py # /predict/all-models
│   user_preprocess.py     # Payload → model features
│   notebook_data.py       # Load comparison CSV
│   predict_service.py     # Offline fallback (sanity --offline only)
├── notebook/
│   1_preprocessing.ipynb
│   2_train_models.ipynb
│   3_clustering.ipynb
│   4_inference.ipynb
│   inference.py           # Production logic (mirrors notebook 4)
│   paths.py
│   data/raw/              # Raw CSV
│   data/                  # Processed train/test
│   outputs/               # model_comparison.csv, clustering
│   artifacts/             # .pkl (generate locally)
├── scripts/
│   run_sanity_checks.py   # 3 API sanity checks
├── frontend/              # React + Vite
├── mobile/                # Flutter
├── project-proposal.md
├── project_paper.md
├── requirements.txt
└── README.md
```

---

## Setup

### 1. Python dependencies

```bash
py -3 -m pip install -r requirements.txt
```

### 2. Notebooks (run in order)

Open `notebook/` in Jupyter and run:

1. **`1_preprocessing.ipynb`** — clean data, split, export CSVs  
2. **`2_train_models.ipynb`** — train all models, write `outputs/model_comparison.csv`, save **`artifacts/*.pkl`**  
3. **`3_clustering.ipynb`** — optional clustering  
4. **`4_inference.ipynb`** — documents inference; production code is **`notebook/inference.py`**

Without **`notebook/artifacts/best_model.pkl`**, **`POST /predict`** returns **503** (ML not loaded).

### 3. Start API

```bash
py -3 -m uvicorn api.app:app --reload --host 127.0.0.1 --port 8000
```

- Health: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)  
- Swagger: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 4. Sanity checks (3 samples)

```bash
py -3 scripts/run_sanity_checks.py
```

Offline (rule-based fallback, not production inference):

```bash
py -3 scripts/run_sanity_checks.py --offline
```

### 5. Web frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). API must run on port **8000**.

### 6. Mobile (Flutter)

```bash
cd mobile
flutter pub get
flutter run
```

- **Android emulator:** API default `http://10.0.2.2:8000`  
- **Physical device:** `flutter run --dart-define=API_BASE=http://YOUR_PC_LAN_IP:8000`

---

## API reference

### `POST /predict`

Production prediction (**XGBoost** + wellness score + recommendations from `notebook/inference.py`).

**Body (JSON):**

| Field | Type | Notes |
|-------|------|--------|
| `age` | int | 1–120 |
| `gender` | string | e.g. Male, Female |
| `occupation` | string | UI labels mapped in API |
| `sleep_duration` | float | hours, 0–24 |
| `sleep_quality` | int | 1–10 |
| `stress_level` | int or string | 1–10 or Low/Medium/High |
| `physical_activity_level` | int/float/string | or Low/Moderate/High |
| `daily_steps` | int | ≥ 0 |
| `bmi_category` | string | optional, default Normal Weight |
| `sleep_disorder` | string | optional, default Healthy |

**Example (Windows cmd):**

```bash
curl -X POST http://127.0.0.1:8000/predict ^
  -H "Content-Type: application/json" ^
  -d "{\"age\":32,\"gender\":\"Male\",\"occupation\":\"Engineer\",\"sleep_duration\":8,\"sleep_quality\":9,\"stress_level\":\"Medium\",\"physical_activity_level\":\"Moderate\",\"daily_steps\":9500,\"bmi_category\":\"Normal Weight\",\"sleep_disorder\":\"Healthy\"}"
```

**Response (summary):** `lifestyle_category`, `wellness_score`, `confidence`, `scores`, `recommendations`, `cluster_name`, `model_name`, …

### Other endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Service status, `ml_loaded`, `predict_source` |
| GET | `/models/comparison` | Test-set metrics table for all trained models |
| POST | `/predict/all-models` | Same body as `/predict`; prediction per algorithm |

---

## Evaluation

- **Classification:** accuracy, macro precision/recall, **Macro F1**, confusion matrix (notebook 2)
- **Clustering:** silhouette / cluster profiles (notebook 3)
- **Live checks:** `scripts/run_sanity_checks.py` against running API

---

## Capstone submission (portal)

Upload to your portal folder (proposal + paper only; **full code stays on GitHub**):

| File | Required |
|------|----------|
| `project-proposal.md` | Yes |
| `project_paper.md` (or PDF) | Yes |
| Short README with **this GitHub link** | Recommended |

**GitHub repo URL for graders:**  
**https://github.com/maryan-dev/WellMind-AI**

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `/predict` → 503 | Run `2_train_models.ipynb`; ensure `notebook/artifacts/best_model.pkl` exists |
| sklearn version warnings on load | Re-save pickles with same sklearn as runtime, or ignore if predictions work |
| Web cannot reach API | Start uvicorn on `127.0.0.1:8000`; check CORS / Vite proxy |
| Mobile `API 422` | Complete all wellness fields; age, sleep quality 1–10, daily steps required |
| `model_comparison.csv` missing | Run notebook 2 |

---

## License

Educational / capstone use. Verify dataset license before commercial deployment.

---

## Acknowledgments

Bootcamp ML curriculum (Logistic Regression, Decision Tree, Random Forest, KNN) plus XGBoost for final model selection.
