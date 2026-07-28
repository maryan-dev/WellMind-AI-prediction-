/** Map short API / default strings to readable title + longer guidance. */

const COPY = [
  {
    match: /sleep at least|7.?8 hour|7–8/i,
    title: "Get enough sleep each night",
    body:
      "Most adults need about 7–8 hours of sleep. Your body uses this time to repair, restore energy, and support focus. If you sleep less, start by going to bed 15–30 minutes earlier until you reach a steady routine.",
  },
  {
    match: /consistent sleep|sleep schedule|bedtime/i,
    title: "Keep a regular sleep schedule",
    body:
      "Try to wake up and go to bed at the same times every day, including weekends. A fixed rhythm helps you fall asleep faster and wake up feeling more refreshed.",
  },
  {
    match: /walk|step|8000|activity/i,
    title: "Move more during the day",
    body:
      "Aim for at least 8,000 steps daily. Take a 10-minute walk after meals, choose stairs when you can, and break up long sitting with a short stretch every hour.",
  },
  {
    match: /stress|relax/i,
    title: "Ease stress with small pauses",
    body:
      "When stress builds up, stand up, roll your shoulders, and breathe slowly: inhale for 4 seconds, hold for 4, exhale for 6. Repeat a few times. Short breaks like this can lower tension without taking much time.",
  },
  {
    match: /healthy lifestyle|maintain/i,
    title: "Keep up your good habits",
    body:
      "Your current sleep, activity, and stress patterns are working well. Stay consistent, drink enough water, and check in with yourself once a week to notice what still feels good.",
  },
];

const fallback = (raw) => ({
  title: raw.length > 60 ? `${raw.slice(0, 57)}…` : raw,
  body: "Make this a daily habit. Small, repeated actions matter more than perfect days.",
});

export function expandRecommendation(item) {
  const raw =
    typeof item === "string"
      ? item
      : item.description || item.title || "Take one small step for your wellness today.";
  const rule = COPY.find((c) => c.match.test(raw));
  if (rule) return { title: rule.title, body: rule.body, key: raw };
  return { ...fallback(raw), key: raw };
}
