import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export default function CircularProgress({ value, max = 100, label = "Wellness Score" }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const data = [
    { name: "score", value: pct },
    { name: "rest", value: 100 - pct },
  ];

  return (
    <div className="relative mx-auto h-52 w-52">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={90}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill="url(#wellnessGradient)" />
            <Cell fill="var(--border)" opacity={0.35} />
          </Pie>
          <defs>
            <linearGradient id="wellnessGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{Math.round(value)}</span>
        <span className="text-xs text-[var(--text-muted)]">/ {max}</span>
        <span className="mt-1 text-xs font-medium text-health dark:text-ai-light">{label}</span>
      </div>
    </div>
  );
}
