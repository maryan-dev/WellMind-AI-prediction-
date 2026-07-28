import { ACTIVITY_MAP, STRESS_MAP, SLEEP_DISORDER_MAP, BMI_UI_TO_MODEL } from "./formMappings";
import { buildFeatureRecommendations, recommendationsAsStrings } from "./recommendationEngine";
import {
  energyScoreFromBurden,
  fatigueBurdenFromInputs,
  wellnessScoreFromComponents,
} from "./wellnessScoreMath";

export { buildFeatureRecommendations, recommendationsAsStrings };

function parseActivity(val) {
  if (ACTIVITY_MAP[val] != null) return ACTIVITY_MAP[val];
  const n = Number(val);
  return Number.isNaN(n) ? 60 : n;
}

function parseStress(val) {
  if (STRESS_MAP[val] != null) return STRESS_MAP[val];
  const n = Number(val);
  return Number.isNaN(n) ? 5 : n;
}

export function analyzeWellness(form) {
  const sleepDuration = Number(form.sleepDuration) || 7;
  const sleepQuality = Number(form.sleepQuality) || 7;
  const stressLevel = parseStress(form.stressLevel);
  const activityLevel = parseActivity(form.physicalActivityLevel);
  const dailySteps = Number(form.dailySteps) || 6000;

  const durationScore =
    sleepDuration < 5 ? 30 : sleepDuration < 7 ? 55 : sleepDuration <= 9 ? 90 : 70;
  const qualityScore = (sleepQuality / 10) * 100;
  const sleepScore = Math.round((durationScore * 0.5 + qualityScore * 0.5) * 10) / 10;

  const palNorm = ((Math.min(90, Math.max(30, activityLevel)) - 30) / 60) * 100;
  const stepsNorm = Math.min(100, (dailySteps / 10000) * 100);
  const activityScore = Math.round((palNorm * 0.5 + stepsNorm * 0.5) * 10) / 10;

  const stressIndex = stressLevel * 10;
  const fatigueBurden = fatigueBurdenFromInputs({ sleepScore, activityScore, stressIndex });
  const energyScore = energyScoreFromBurden(fatigueBurden);

  const wellnessScore = wellnessScoreFromComponents({
    sleepScore,
    activityScore,
    stressIndex,
    fatigueBurden,
  });

  let category = "Average";
  if (wellnessScore >= 75) category = "Healthy";
  else if (wellnessScore < 50) category = "Poor";

  const confidence = Math.min(96, Math.round(72 + Math.abs(wellnessScore - 62) / 2));

  let clusterLabel = "Balanced Lifestyle Group";
  if (stressLevel >= 7) clusterLabel = "High Stress User";
  else if (wellnessScore >= 70 && sleepDuration >= 7) clusterLabel = "Healthy Lifestyle User";
  else if (dailySteps < 5500) clusterLabel = "Low Activity User";

  return {
    wellnessScore,
    category,
    confidence,
    scores: {
      sleep: sleepScore,
      activity: activityScore,
      stress: stressIndex,
      fatigue: energyScore,
    },
    cluster: {
      id: 0,
      label: clusterLabel,
      averages: { sleep: 7.0, activity: 60, stress: 5.5, steps: 6500 },
    },
    form: {
      ...form,
      bmiCategory: BMI_UI_TO_MODEL[form.bmiCategory] || form.bmiCategory,
      sleepDisorder: SLEEP_DISORDER_MAP[form.sleepDisorder] || form.sleepDisorder,
    },
    analyzedAt: new Date().toISOString(),
  };
}

export function buildRecommendations(result) {
  const items = buildFeatureRecommendations(result.form);
  return items.map((r) => ({
    id: r.id,
    title: r.text,
    description: r.text,
    priority: r.tone === "warning" ? "high" : "low",
    icon: "heart",
    category: r.category,
    tone: r.tone,
  }));
}
