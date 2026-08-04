import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export default function CircularProgress({ value, max = 100, label = "Wellness Score", size = "md" }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const data = [
    { name: "score", value: pct },
    { name: "rest", value: 100 - pct },
  ];
  const box = size === "lg" ? "h-56 w-56" : "h-52 w-52";
  const inner = size === "lg" ? 74 : 70;
  const outer = size === "lg" ? 94 : 90;

  return (
    <div className={`relative mx-auto ${box}`}>
      <div className="pointer-events-none absolute inset-6 rounded-full bg-gradient-to-br from-brand/25 to-ai/15 blur-xl" />
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={inner}
            outerRadius={outer}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            cornerRadius={6}
          >
            <Cell fill="url(#wellnessGradient)" />
            <Cell fill="var(--border)" opacity={0.35} />
          </Pie>
          <defs>
            <linearGradient id="wellnessGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="55%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="bg-gradient-to-br from-health to-ai bg-clip-text text-4xl font-extrabold text-transparent">
          {Math.round(value)}
        </span>
        <span className="text-xs text-[var(--text-muted)]">/ {max}</span>
        <span className="mt-1 text-xs font-semibold tracking-wide text-health dark:text-ai-light">
          {label}
        </span>
      </div>
    </div>
  );
}
