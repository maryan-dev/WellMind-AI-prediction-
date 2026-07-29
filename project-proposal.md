# WellMind AI ÔÇö Final Project Proposal

**Student name:** Maryan  
**GitHub username:** maryan-dev  
**Repository:** https://github.com/maryan-dev/WellMind-AI  
**Submitted:** July 12, 2026 (update if resubmitting)

---

## 1. Problem statement

Predict a personÔÇÖs **lifestyle wellness category** ÔÇö **Healthy**, **Average**, or **Poor** ÔÇö from daily sleep, activity, stress, and related health signals. The goal is to support awareness and personalized recommendations, not clinical diagnosis.

**Why it matters:** Sleep and lifestyle strongly affect productivity and long-term health. A reproducible ML pipeline plus a simple API makes it easy to demo predictions on new user inputs.

---

## 2. Dataset

| Item | Detail |
|------|--------|
| **Name** | Sleep Health & Lifestyle (sampled) |
| **Source** | Public sleep/lifestyle dataset (Kaggle-style sleep health records); bundled as `notebook/Sleep_Data_Sampled.csv` |
| **Link** | _Add your Kaggle or original source URL here_ |
| **Size** | **15,000** rows, 13 columns (meets ÔëÑ1,000 requirement) |
| **Target** | `Lifestyle Category` (3-class classification), derived from engineered wellness score + label noise in preprocessing |

**Features used for modeling (10):** Age, Gender, Occupation, Sleep Duration, Quality of Sleep, Physical Activity Level, Stress Level, BMI Category, Daily Steps, Sleep Disorder.

---

## 3. Algorithms (minimum three)

| # | Algorithm | Type |
|---|-----------|------|
| 1 | Logistic Regression | Bootcamp ÔÇö linear classifier |
| 2 | Decision Tree | Bootcamp |
| 3 | Random Forest | Bootcamp ÔÇö ensemble |
| 4 | K-Nearest Neighbors | Bootcamp |
| 5 | XGBoost | Research / gradient boosting |

All models share the **same 80/20 train/test split** on processed data (`notebook/data/`).

---

## 4. Evaluation metric & winner rule

**Primary metric:** **Macro F1** on the **held-out test set**.

**Why:** Three classes (Healthy / Average / Poor) are imbalanced; macro F1 treats each class equally and matches bootcamp classification best practice.

**Winner:** Model with **highest test Macro F1** ÔåÆ **XGBoost** (see `notebook/model_comparison.csv`).

---

## 5. Deployment plan

- **Framework:** FastAPI  
- **Endpoint:** `POST /predict` ÔÇö JSON in, JSON out (category, wellness score, recommendations)  
- **Artifacts:** `notebook/best_model.pkl`, encoders/scaler in `notebook/*.pkl`  
- **Optional UI:** React web app + Flutter mobile (extra credit / demo)

---

## 6. Changes from this proposal (if any)

| Planned | Final repo |
|---------|------------|
| Folders `dataset/`, `src/` | Data and training live in **`notebook/`**; inference in **`api/`** (documented in README) |
| Flask (optional) | **FastAPI** chosen for typing and auto docs |

---

## 7. Timeline (self)

| Milestone | Target |
|-----------|--------|
| Preprocessing notebook | Week 1 |
| Train + compare ÔëÑ3 models | Week 2 |
| API + sanity checks | Week 3 |
| README + paper + GitHub | Before July 25, 2026 |

---

**Instructor approval:** _[Initials / date if applicable]_
