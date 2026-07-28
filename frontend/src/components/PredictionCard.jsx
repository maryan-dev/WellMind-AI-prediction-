export default function PredictionCard({ category, confidence }) {
  const toneMap = {
    Healthy: {
      grad: "from-health/20 via-emerald-500/10 to-ai/5",
      text: "text-health dark:text-health-light",
    },
    Average: {
      grad: "from-amber-500/15 via-orange-400/10 to-ai/5",
      text: "text-amber-600 dark:text-amber-300",
    },
    Poor: {
      grad: "from-red-500/15 via-rose-400/10 to-slate-500/5",
      text: "text-red-600 dark:text-red-300",
    },
  };
  const tone = toneMap[category] || toneMap.Average;

  return (
    <div className={`glass-card border bg-gradient-to-br p-6 ${tone.grad}`}>
      <p className="text-sm font-medium text-[var(--text-muted)]">Your Wellness Status</p>
      <h2 className={`mt-2 text-3xl font-bold ${tone.text}`}>{category} Lifestyle</h2>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/50 px-3 py-1 text-sm dark:bg-slate-900/40">
        <span className="h-2 w-2 rounded-full bg-gradient-to-r from-health to-ai animate-pulse-soft" />
        Confidence: <strong>{confidence}%</strong>
      </div>
    </div>
  );
}
