export default function WellnessScoreCard({ icon, label, value, suffix = "%", hint }) {
  return (
    <div className="glass-card p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-bold">{value}{suffix}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-[var(--text-muted)]">{label}</p>
      {hint ? <p className="text-[11px] text-[var(--text-muted)]/80">{hint}</p> : null}
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-deep to-brand transition-all duration-700"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}
