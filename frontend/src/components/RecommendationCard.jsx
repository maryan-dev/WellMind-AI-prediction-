import { AlertTriangle, CheckCircle2, Heart } from "lucide-react";

const icons = {
  sleep: "😴",
  activity: "🏃",
  stress: "😰",
  heart: "❤️",
};

const priorityStyles = {
  high: "border-red-400/40 bg-red-500/5",
  medium: "border-amber-400/40 bg-amber-500/5",
  low: "border-brand/30 bg-brand/5",
};

export default function RecommendationCard({ title, description, priority = "medium", icon = "heart" }) {
  const PriorityIcon =
    priority === "high" ? AlertTriangle : priority === "low" ? CheckCircle2 : Heart;

  return (
    <article
      className={`glass-card flex gap-4 border p-4 transition hover:-translate-y-0.5 ${priorityStyles[priority]}`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/60 text-xl dark:bg-slate-900/50">
        {icons[icon] || "✨"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{title}</h3>
          <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
            {priority} priority
          </span>
        </div>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
      </div>
      <PriorityIcon className="h-5 w-5 shrink-0 text-[var(--text-muted)]" />
    </article>
  );
}
