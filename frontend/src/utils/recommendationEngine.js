import { ACTIVITY_MAP, STRESS_MAP, SLEEP_DISORDER_MAP } from "./formMappings";

function parseStress(val) {
  if (STRESS_MAP[val] != null) return STRESS_MAP[val];
  const n = Number(val);
  return Number.isNaN(n) ? 5 : Math.min(10, Math.max(1, n));
}

function parseActivityLabel(val) {
  if (typeof val === "string" && ACTIVITY_MAP[val] != null) return val;
  const n = Number(val);
  if (n <= 40) return "Low";
  if (n >= 75) return "High";
  return "Moderate";
}

function normalizeBmi(ui) {
  const k = String(ui || "Normal").toLowerCase();
  if (k.includes("under")) return "Underweight";
  if (k.includes("over") && !k.includes("obese")) return "Overweight";
  if (k.includes("obese")) return "Obese";
  return "Normal";
}

function normalizeDisorder(ui) {
  const raw = SLEEP_DISORDER_MAP[ui] || ui || "Healthy";
  const s = String(raw).toLowerCase();
  if (s.includes("insomnia")) return "Insomnia";
  if (s.includes("apnea")) return "Sleep Apnea";
  return "None";
}

/** @returns {{ id: string, category: string, tone: 'positive'|'warning'|'neutral', text: string }[]} */
export function buildFeatureRecommendations(form) {
  const sleep = Number(form.sleepDuration) || 7;
  const stress = parseStress(form.stressLevel);
  const steps = Number(form.dailySteps) || 0;
  const activity = parseActivityLabel(form.physicalActivityLevel);
  const bmi = normalizeBmi(form.bmiCategory);
  const disorder = normalizeDisorder(form.sleepDisorder);
  const sleepQuality = Number(form.sleepQuality) || 7;

  const out = [];

  const push = (category, tone, text) => {
    out.push({
      id: `${category}-${out.length}`,
      category,
      tone,
      text,
    });
  };

  // 😴 Sleep Duration
  if (sleep < 5) {
    push("Sleep Duration", "warning", "Sleep is critically low.");
    push("Sleep Duration", "warning", "Increase your sleep by 2–3 hours.");
    push("Sleep Duration", "warning", "Avoid screen time before bed.");
    push("Sleep Duration", "warning", "Try sleeping before 10:30 PM.");
  } else if (sleep < 7) {
    push("Sleep Duration", "warning", "Increase sleep by about 1 hour.");
    push("Sleep Duration", "warning", "Maintain a consistent bedtime.");
    push("Sleep Duration", "warning", "Reduce caffeine in the evening.");
  } else if (sleep <= 9) {
    push("Sleep Duration", "positive", "Excellent sleep duration.");
    push("Sleep Duration", "positive", "Keep your current routine.");
    push("Sleep Duration", "positive", "Continue maintaining good sleep habits.");
  } else {
    push("Sleep Duration", "neutral", "You are sleeping longer than average.");
    push(
      "Sleep Duration",
      "neutral",
      "If you still feel tired, consider consulting a healthcare professional."
    );
  }

  if (sleepQuality <= 5) {
    push("Sleep Quality", "warning", "Your sleep quality score is low — darken the room and limit late caffeine.");
  } else if (sleepQuality >= 8) {
    push("Sleep Quality", "positive", "Your sleep quality is strong — keep your wind-down routine.");
  }

  // 😰 Stress
  if (stress <= 3) {
    push("Stress Level", "positive", "Great job managing stress.");
    push("Stress Level", "positive", "Continue your current routine.");
  } else if (stress <= 6) {
    push("Stress Level", "warning", "Take short breaks during work.");
    push("Stress Level", "warning", "Practice breathing exercises.");
    push("Stress Level", "warning", "Balance work and rest.");
  } else {
    push("Stress Level", "warning", "Your stress level is high.");
    push("Stress Level", "warning", "Consider relaxation techniques.");
    push("Stress Level", "warning", "Reduce workload if possible.");
    push("Stress Level", "warning", "Get adequate sleep.");
  }

  // 🚶 Daily Steps
  if (steps < 4000) {
    push("Daily Steps", "warning", "Increase walking gradually.");
    push("Daily Steps", "warning", "Aim for 6,000–8,000 steps.");
  } else if (steps < 8000) {
    push("Daily Steps", "warning", "Good progress.");
    push("Daily Steps", "warning", "Try reaching 8,000–10,000 daily.");
  } else {
    push("Daily Steps", "positive", "Excellent activity level.");
    push("Daily Steps", "positive", "Maintain your current routine.");
  }

  // 🏃 Physical Activity
  if (activity === "Low") {
    push("Physical Activity", "warning", "Add 20–30 minutes of exercise.");
    push("Physical Activity", "warning", "Start with walking.");
  } else if (activity === "Moderate") {
    push("Physical Activity", "positive", "Good activity level.");
    push("Physical Activity", "positive", "Continue exercising regularly.");
  } else {
    push("Physical Activity", "positive", "Excellent physical activity.");
    push("Physical Activity", "positive", "Remember to rest and stay hydrated.");
  }

  // ⚖ BMI
  if (bmi === "Underweight") {
    push("BMI Category", "warning", "Eat nutrient-rich foods.");
    push("BMI Category", "warning", "Increase healthy calories.");
    push("BMI Category", "warning", "Include eggs, fish, beans, milk, and nuts.");
  } else if (bmi === "Normal") {
    push("BMI Category", "positive", "Maintain your balanced diet.");
    push("BMI Category", "positive", "Continue exercising.");
  } else if (bmi === "Overweight") {
    push("BMI Category", "warning", "Reduce sugary drinks.");
    push("BMI Category", "warning", "Eat more vegetables and lean protein.");
    push("BMI Category", "warning", "Walk daily.");
    push("BMI Category", "warning", "Reduce processed foods.");
  } else {
    push("BMI Category", "warning", "Consult a healthcare professional.");
    push("BMI Category", "warning", "Follow a balanced diet.");
    push("BMI Category", "warning", "Increase physical activity gradually.");
    push("BMI Category", "warning", "Avoid excessive sugar and fast food.");
  }

  // 😴 Sleep Disorder
  if (disorder === "None") {
    push("Sleep Disorder", "positive", "No sleep disorder reported.");
    push("Sleep Disorder", "positive", "Maintain healthy sleep habits.");
  } else if (disorder === "Insomnia") {
    push("Sleep Disorder", "warning", "Keep a regular bedtime.");
    push("Sleep Disorder", "warning", "Avoid caffeine late in the day.");
    push("Sleep Disorder", "warning", "Limit screen use before sleep.");
  } else {
    push("Sleep Disorder", "warning", "Consider medical evaluation.");
    push("Sleep Disorder", "warning", "Maintain a healthy weight.");
    push("Sleep Disorder", "warning", "Sleep on your side if advised.");
  }

  return out.slice(0, 15);
}

/** Flat strings with ✅ / ⚠️ for API compatibility */
export function recommendationsAsStrings(items) {
  return items.map((r) => {
    const icon = r.tone === "positive" ? "✅" : r.tone === "warning" ? "⚠️" : "•";
    return `${icon} ${r.text}`;
  });
}

export function groupByCategory(items) {
  const map = new Map();
  for (const item of items) {
    if (!map.has(item.category)) map.set(item.category, []);
    map.get(item.category).push(item);
  }
  return [...map.entries()];
}

/** Accept strings or { title, description, text, category, tone } from API / context */
export function normalizeRecommendationItem(item, index = 0) {
  if (item == null) {
    return { id: `empty-${index}`, category: "Wellness", tone: "neutral", text: "" };
  }
  if (typeof item === "string") {
    const tone = item.startsWith("⚠") ? "warning" : item.startsWith("✅") ? "positive" : "neutral";
    return {
      id: `str-${index}`,
      category: "Wellness",
      tone,
      text: item.replace(/^[✅⚠️•]\s*/, "").trim(),
    };
  }
  const raw = item.text || item.description || item.title || "";
  const text = String(raw).replace(/^[✅⚠️•]\s*/, "").trim();
  let tone = item.tone;
  if (!tone) {
    tone = text.toLowerCase().includes("consult") || item.priority === "high" ? "warning" : "positive";
  }
  return {
    id: item.id || `obj-${index}`,
    category: item.category || "Wellness",
    tone,
    text,
  };
}
