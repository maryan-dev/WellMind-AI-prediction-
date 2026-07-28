const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function fetchAllModelPredictions(formPayload) {
  const res = await fetch(`${API_BASE}/predict/all-models`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formPayload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
}

export async function fetchModelReport() {
  try {
    const res = await fetch(`${API_BASE}/models/comparison`);
    if (res.ok) return res.json();
  } catch {
    /* fall through */
  }
  const fallback = await fetch("/data/best_model_report.json");
  if (!fallback.ok) {
    throw new Error("Model report not available");
  }
  return fallback.json();
}
