import { toApiPayload } from "../utils/formMappings";
import { buildFeatureRecommendations } from "../utils/recommendationEngine";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

function normalizeConfidencePct(value) {
  if (value == null || Number.isNaN(Number(value))) return null;
  let pct = Number(value);
  if (pct <= 1) pct *= 100;
  return Math.round(Math.min(93, Math.max(54, pct)));
}

export async function predictWellness(form) {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiPayload(form)),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `API error ${res.status}`);
  }

  const data = await res.json();
  return mapApiToUi(data, form);
}

function mapApiToUi(data, form) {
  const featureRecs = buildFeatureRecommendations(form);
  const confidence = normalizeConfidencePct(data.confidence) ?? 82;

  return {
    wellnessScore: data.wellness_score,
    category: data.lifestyle_category,
    confidence,
    scores: {
      sleep: data.scores?.sleep_score ?? 0,
      activity: data.scores?.activity_score ?? 0,
      stress: data.scores?.stress_index ?? 0,
      fatigue: data.scores?.energy_score ?? 100 - (data.scores?.fatigue_score ?? 0),
    },
    cluster: {
      id: data.cluster_label,
      label: data.cluster_name || "Lifestyle Group",
      averages: { sleep: 7.0, activity: 60, stress: 5.5, steps: 6500 },
    },
    recommendations: featureRecs.map((r) => ({
      id: r.id,
      priority: r.tone === "warning" ? "high" : "low",
      title: r.text,
      description: r.text,
      text: r.text,
      category: r.category,
      tone: r.tone,
      icon: "heart",
    })),
    form,
    analyzedAt: new Date().toISOString(),
    modelName: data.model_name,
    apiPrediction: data.prediction,
  };
}
