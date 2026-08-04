function seededTrend(value, points = 7) {
  const base = Math.max(20, Math.min(95, Number(value) || 50));
  const out = [];
  let n = (base * 17 + 31) % 97;
  for (let i = 0; i < points; i += 1) {
    n = (n * 13 + 7 + i * 3) % 97;
    const wobble = ((n / 97) - 0.5) * 22;
    const t = i / (points - 1);
    out.push(Math.round(Math.max(8, Math.min(100, base - 12 + t * 14 + wobble))));
  }
  out[out.length - 1] = Math.round(base);
  return out;
}

function Sparkline({ values, color }) {
  const w = 160;
  const h = 44;
  const pad = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const coords = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return { x, y };
  });
  const line = coords.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${coords[coords.length - 1].x} ${h} L ${coords[0].x} ${h} Z`;
  const gradId = `spark-${color.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 h-12 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.2" fill={color} />
      ))}
    </svg>
  );
}

const toneMap = {
  sleep: {
    accent: "#0d9488",
    iconBg: "bg-health/15 text-health dark:bg-health/20 dark:text-ai-light",
    score: "text-health dark:text-brand-light",
  },
  activity: {
    accent: "#0891b2",
    iconBg: "bg-ai/15 text-ai dark:bg-ai/20 dark:text-ai-light",
    score: "text-ai dark:text-ai-light",
  },
  stress: {
    accent: "#14b8a6",
    iconBg: "bg-brand/15 text-brand-deep dark:bg-brand/20 dark:text-brand-muted",
    score: "text-brand-deep dark:text-brand-muted",
  },
  energy: {
    accent: "#2dd4bf",
    iconBg: "bg-brand-light/20 text-brand-deep dark:bg-brand-light/15 dark:text-brand-light",
    score: "text-brand-deep dark:text-brand-light",
  },
};

export default function WellnessScoreCard({
  icon: Icon,
  label,
  value,
  tone = "sleep",
}) {
  const score = Math.round(Math.min(100, Math.max(0, Number(value) || 0)));
  const trend = seededTrend(score);
  const colors = toneMap[tone] || toneMap.sleep;

  return (
    <div className="glass-card group relative overflow-hidden p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 blur-2xl transition group-hover:opacity-50"
        style={{ background: colors.accent }}
      />

      <div className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl ${colors.iconBg}`}>
        <Icon className="h-5 w-5" aria-hidden />
      </div>

      <p className="relative mt-3 text-sm font-medium text-[var(--text-muted)]">{label}</p>

      <p className={`relative mt-1 text-3xl font-extrabold tabular-nums tracking-tight ${colors.score}`}>
        {score}
        <span className="ml-1 text-sm font-semibold text-[var(--text-muted)]">/100</span>
      </p>

      <Sparkline values={trend} color={colors.accent} />
    </div>
  );
}
