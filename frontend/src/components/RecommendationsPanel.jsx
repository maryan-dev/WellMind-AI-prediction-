import { groupByCategory, normalizeRecommendationItem } from "../utils/recommendationEngine";

const toneIcon = {
  positive: "✅",
  warning: "⚠️",
  neutral: "•",
};

export default function RecommendationsPanel({ items, className = "" }) {
  const structured = (items || [])
    .map(normalizeRecommendationItem)
    .filter((r) => r.text.length > 0);

  const groups = groupByCategory(structured);

  return (
    <section className={`glass-card p-5 md:p-6 ${className}`}>
      <header className="mb-5 border-b border-[var(--border)] pb-4">
        <p className="section-label">Next steps</p>
        <h3 className="mt-1 text-lg font-semibold">Personalized recommendations</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Tailored from your latest wellness check
        </p>
      </header>

      {groups.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">Complete a wellness check to see personalized tips.</p>
      ) : (
        <div className="space-y-6">
          {groups.map(([category, recs]) => (
            <div key={category}>
              <h4 className="mb-2 text-sm font-semibold text-brand">{category}</h4>
              <ul className="space-y-2">
                {recs.map((rec) => (
                  <li key={rec.id} className="flex gap-2 text-sm leading-relaxed md:text-[15px]">
                    <span className="shrink-0" aria-hidden>
                      {toneIcon[rec.tone] || "•"}
                    </span>
                    <span>{rec.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
