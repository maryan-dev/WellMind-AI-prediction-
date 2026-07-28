/** UI labels -> backend / model values */

export const ACTIVITY_MAP = { Low: 30, Moderate: 60, High: 90 };

export const STRESS_MAP = { Low: 3, Medium: 6, High: 8 };

export const SLEEP_DISORDER_MAP = {
  No: "Healthy",
  Insomnia: "Insomnia",
  "Sleep Apnea": "Sleep Apnea",
};

export const BMI_UI_TO_MODEL = {
  Underweight: "Normal Weight",
  Normal: "Normal Weight",
  Overweight: "Overweight",
  Obese: "Obese",
};

export const OCCUPATION_OPTIONS = [
  { value: "", label: "Select occupation..." },
  { value: "Student", label: "Student" },
  { value: "Office Worker", label: "Office Worker" },
  { value: "Remote Worker", label: "Remote Worker" },
  { value: "Driver", label: "Driver" },
  { value: "Teacher", label: "Teacher" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Business", label: "Business" },
  { value: "Other", label: "Other" },
];

export const DEFAULT_RECOMMENDATIONS = [
  "Sleep at least 7–8 hours",
  "Walk 8,000+ steps daily",
  "Reduce stress through relaxation",
  "Maintain a consistent sleep schedule",
];

export function toApiPayload(form) {
  return {
    age: Number(form.age),
    gender: form.gender,
    occupation: form.occupation,
    sleep_duration: Number(form.sleepDuration),
    sleep_quality: Number(form.sleepQuality),
    stress_level: form.stressLevel,
    physical_activity_level: form.physicalActivityLevel,
    daily_steps: Number(form.dailySteps),
    bmi_category: form.bmiCategory,
    sleep_disorder: form.sleepDisorder,
  };
}
