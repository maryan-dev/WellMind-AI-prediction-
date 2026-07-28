"""Central paths for Jupyter notebooks and API (single source of truth)."""

from pathlib import Path

NOTEBOOK_DIR = _NOTEBOOK = None  # set below


def _resolve_notebook_dir() -> Path:
    cwd = Path.cwd().resolve()
    candidates = [
        cwd,
        cwd / "notebook",
        cwd.parent / "notebook",
    ]
    for base in candidates:
        if not (base / "paths.py").is_file():
            continue
        # New layout: raw CSV under data/raw/
        if (base / "data" / "raw" / "Sleep_Data_Sampled.csv").is_file():
            return base
        # Legacy layout (before reorganize)
        if (base / "Sleep_Data_Sampled.csv").is_file():
            return base
        if (base / "data" / "train_processed.csv").is_file():
            return base
    raise FileNotFoundError(
        "Could not find notebook/ (need paths.py and data/). "
        "Open Jupyter from project root or notebook/."
    )


NOTEBOOK_DIR = _resolve_notebook_dir()

# --- Data ---
DATA_DIR = NOTEBOOK_DIR / "data"
RAW_CSV = (
    DATA_DIR / "raw" / "Sleep_Data_Sampled.csv"
    if (DATA_DIR / "raw" / "Sleep_Data_Sampled.csv").is_file()
    else NOTEBOOK_DIR / "Sleep_Data_Sampled.csv"
)
TRAIN_CSV = DATA_DIR / "train_processed.csv"
TEST_CSV = DATA_DIR / "test_processed.csv"
TEST_TARGETS_CSV = (
    DATA_DIR / "test_targets.csv"
    if (DATA_DIR / "test_targets.csv").is_file()
    else NOTEBOOK_DIR / "test_targets.csv"
)

# --- Training artifacts (.pkl) ---
ARTIFACTS_DIR = NOTEBOOK_DIR / "artifacts"
if not ARTIFACTS_DIR.is_dir():
    ARTIFACTS_DIR = NOTEBOOK_DIR  # legacy: pkls next to notebooks

def _artifact(name: str) -> Path:
    p = ARTIFACTS_DIR / name
    if p.is_file():
        return p
    legacy = NOTEBOOK_DIR / name
    return legacy


ENCODERS_PKL = _artifact("encoders.pkl")
SCALER_PKL = _artifact("scaler.pkl")
NUM_FEATURE_COLS_PKL = _artifact("num_feature_cols.pkl")
FEATURE_COLS_PKL = _artifact("feature_cols.pkl")
TARGET_ENCODER_PKL = _artifact("target_encoder.pkl")
BEST_MODEL_PKL = _artifact("best_model.pkl")
ALL_MODELS_PKL = _artifact("all_models.pkl")

# --- Reports & exports ---
OUTPUTS_DIR = NOTEBOOK_DIR / "outputs"
if not OUTPUTS_DIR.is_dir():
    OUTPUTS_DIR = NOTEBOOK_DIR

MODEL_COMPARISON_CSV = (
    OUTPUTS_DIR / "model_comparison.csv"
    if (OUTPUTS_DIR / "model_comparison.csv").is_file()
    else NOTEBOOK_DIR / "model_comparison.csv"
)
CLUSTERING_RESULTS_CSV = (
    OUTPUTS_DIR / "clustering_results.csv"
    if (OUTPUTS_DIR / "clustering_results.csv").is_file()
    else NOTEBOOK_DIR / "clustering_results.csv"
)
BEST_MODEL_REPORT_JSON = OUTPUTS_DIR / "best_model_report.json"

# --- Plots ---
PLOTS_DIR = NOTEBOOK_DIR / "plots"
PLOTS_DIR.mkdir(parents=True, exist_ok=True)

DATA_DIR.mkdir(parents=True, exist_ok=True)
(DATA_DIR / "raw").mkdir(parents=True, exist_ok=True)
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)

PROJECT_ROOT = NOTEBOOK_DIR.parent if NOTEBOOK_DIR.name == "notebook" else NOTEBOOK_DIR
