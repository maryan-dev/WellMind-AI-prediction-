"""Feature-based wellness recommendations (8–15 tips per user)."""

from __future__ import annotations

from typing import Any, Dict, List, Union

ACTIVITY_MAP = {"Low": 30, "Moderate": 60, "High": 90}
STRESS_MAP = {"Low": 3, "Medium": 6, "High": 8}
SLEEP_DISORDER_MAP = {"No": "Healthy", "Insomnia": "Insomnia", "Sleep Apnea": "Sleep Apnea"}


def _parse_stress(value: Any) -> int:
    if isinstance(value, str) and value in STRESS_MAP:
        return STRESS_MAP[value]
    try:
        return max(1, min(10, int(value)))
    except (TypeError, ValueError):
        return 5


def _parse_activity_label(value: Any) -> str:
    if isinstance(value, str) and value in ACTIVITY_MAP:
        return value
    try:
        n = float(value)
        if n <= 40:
            return "Low"
        if n >= 75:
            return "High"
        return "Moderate"
    except (TypeError, ValueError):
        return "Moderate"


def _normalize_bmi(raw: Any) -> str:
    s = str(raw or "Normal").lower()
    if "under" in s:
        return "Underweight"
    if "obese" in s:
        return "Obese"
    if "over" in s:
        return "Overweight"
    return "Normal"


def _normalize_disorder(raw: Any) -> str:
    key = str(raw or "No")
    mapped = SLEEP_DISORDER_MAP.get(key, key)
    low = mapped.lower()
    if "insomnia" in low:
        return "Insomnia"
    if "apnea" in low:
        return "Sleep Apnea"
    return "None"


def build_feature_recommendations(payload: Dict[str, Any]) -> List[Dict[str, str]]:
    sleep = float(payload.get("sleep_duration") or payload.get("sleepDuration") or 7)
    stress = _parse_stress(payload.get("stress_level") or payload.get("stressLevel"))
    steps = int(payload.get("daily_steps") or payload.get("dailySteps") or 0)
    activity = _parse_activity_label(
        payload.get("physical_activity_level") or payload.get("physicalActivityLevel")
    )
    bmi = _normalize_bmi(payload.get("bmi_category") or payload.get("bmiCategory"))
    disorder = _normalize_disorder(payload.get("sleep_disorder") or payload.get("sleepDisorder"))
    sleep_quality = int(payload.get("sleep_quality") or payload.get("sleepQuality") or 7)

    out: List[Dict[str, str]] = []

    def push(category: str, tone: str, text: str) -> None:
        out.append(
            {"id": f"{category}-{len(out)}", "category": category, "tone": tone, "text": text}
        )

    if sleep < 5:
        for t in (
            "Sleep is critically low.",
            "Increase your sleep by 2–3 hours.",
            "Avoid screen time before bed.",
            "Try sleeping before 10:30 PM.",
        ):
            push("Sleep Duration", "warning", t)
    elif sleep < 7:
        for t in (
            "Increase sleep by about 1 hour.",
            "Maintain a consistent bedtime.",
            "Reduce caffeine in the evening.",
        ):
            push("Sleep Duration", "warning", t)
    elif sleep <= 9:
        for t in (
            "Excellent sleep duration.",
            "Keep your current routine.",
            "Continue maintaining good sleep habits.",
        ):
            push("Sleep Duration", "positive", t)
    else:
        push("Sleep Duration", "neutral", "You are sleeping longer than average.")
        push(
            "Sleep Duration",
            "neutral",
            "If you still feel tired, consider consulting a healthcare professional.",
        )

    if sleep_quality <= 5:
        push(
            "Sleep Quality",
            "warning",
            "Your sleep quality score is low — darken the room and limit late caffeine.",
        )
    elif sleep_quality >= 8:
        push("Sleep Quality", "positive", "Your sleep quality is strong — keep your wind-down routine.")

    if stress <= 3:
        push("Stress Level", "positive", "Great job managing stress.")
        push("Stress Level", "positive", "Continue your current routine.")
    elif stress <= 6:
        for t in (
            "Take short breaks during work.",
            "Practice breathing exercises.",
            "Balance work and rest.",
        ):
            push("Stress Level", "warning", t)
    else:
        for t in (
            "Your stress level is high.",
            "Consider relaxation techniques.",
            "Reduce workload if possible.",
            "Get adequate sleep.",
        ):
            push("Stress Level", "warning", t)

    if steps < 4000:
        push("Daily Steps", "warning", "Increase walking gradually.")
        push("Daily Steps", "warning", "Aim for 6,000–8,000 steps.")
    elif steps < 8000:
        push("Daily Steps", "warning", "Good progress.")
        push("Daily Steps", "warning", "Try reaching 8,000–10,000 daily.")
    else:
        push("Daily Steps", "positive", "Excellent activity level.")
        push("Daily Steps", "positive", "Maintain your current routine.")

    if activity == "Low":
        push("Physical Activity", "warning", "Add 20–30 minutes of exercise.")
        push("Physical Activity", "warning", "Start with walking.")
    elif activity == "Moderate":
        push("Physical Activity", "positive", "Good activity level.")
        push("Physical Activity", "positive", "Continue exercising regularly.")
    else:
        push("Physical Activity", "positive", "Excellent physical activity.")
        push("Physical Activity", "positive", "Remember to rest and stay hydrated.")

    if bmi == "Underweight":
        for t in (
            "Eat nutrient-rich foods.",
            "Increase healthy calories.",
            "Include eggs, fish, beans, milk, and nuts.",
        ):
            push("BMI Category", "warning", t)
    elif bmi == "Normal":
        push("BMI Category", "positive", "Maintain your balanced diet.")
        push("BMI Category", "positive", "Continue exercising.")
    elif bmi == "Overweight":
        for t in (
            "Reduce sugary drinks.",
            "Eat more vegetables and lean protein.",
            "Walk daily.",
            "Reduce processed foods.",
        ):
            push("BMI Category", "warning", t)
    else:
        for t in (
            "Consult a healthcare professional.",
            "Follow a balanced diet.",
            "Increase physical activity gradually.",
            "Avoid excessive sugar and fast food.",
        ):
            push("BMI Category", "warning", t)

    if disorder == "None":
        push("Sleep Disorder", "positive", "No sleep disorder reported.")
        push("Sleep Disorder", "positive", "Maintain healthy sleep habits.")
    elif disorder == "Insomnia":
        for t in (
            "Keep a regular bedtime.",
            "Avoid caffeine late in the day.",
            "Limit screen use before sleep.",
        ):
            push("Sleep Disorder", "warning", t)
    else:
        for t in (
            "Consider medical evaluation.",
            "Maintain a healthy weight.",
            "Sleep on your side if advised.",
        ):
            push("Sleep Disorder", "warning", t)

    return out[:15]


def recommendations_as_strings(items: List[Dict[str, str]]) -> List[str]:
    icons = {"positive": "✅", "warning": "⚠️", "neutral": "•"}
    return [f"{icons.get(i.get('tone', 'neutral'), '•')} {i['text']}" for i in items]
