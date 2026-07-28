/** Internal tiredness 0–100 (higher = more fatigued). */
export function fatigueBurdenFromInputs({ sleepScore, activityScore, stressIndex }) {
  return Math.round(
    Math.min(100, (100 - sleepScore) * 0.4 + stressIndex * 0.35 + (100 - activityScore) * 0.25) * 10
  ) / 10;
}

/** Shown on dashboard — higher = more rested (moves with wellness). */
export function energyScoreFromBurden(burden) {
  return Math.round((100 - burden) * 10) / 10;
}

/** Wellness total; fatigue term is light to avoid double-penalty with sleep/stress/activity. */
export function wellnessScoreFromComponents({ sleepScore, activityScore, stressIndex, fatigueBurden }) {
  return Math.round(
    Math.min(
      100,
      sleepScore * 0.38 +
        activityScore * 0.32 +
        (100 - stressIndex) * 0.2 +
        (100 - fatigueBurden) * 0.1
    )
  );
}
