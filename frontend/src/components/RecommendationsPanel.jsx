import { useState } from "react";
import { Languages } from "lucide-react";
import { groupByCategory, normalizeRecommendationItem } from "../utils/recommendationEngine";
import {
  LANGS,
  getUiCopy,
  loadRecLang,
  saveRecLang,
  translateCategory,
  translateText,
} from "../utils/recommendationI18n";

const toneIcon = {
  positive: "✅",
  warning: "⚠️",
  neutral: "•",
};

export default function RecommendationsPanel({ items, className = "" }) {
  const [lang, setLang] = useState(loadRecLang);
  const ui = getUiCopy(lang);

  const structured = (items || [])
    .map(normalizeRecommendationItem)
    .filter((r) => r.text.length > 0);

  const groups = groupByCategory(structured);

  const onLangChange = (next) => {
    setLang(next);
    saveRecLang(next);
  };

  return (
    <section className={`glass-card p-5 md:p-6 ${className}`}>
      <header className="mb-5 border-b border-[var(--border)] pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="section-label">{ui.nextSteps}</p>
            <h3 className="mt-1 text-lg font-semibold">{ui.title}</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{ui.subtitle}</p>
          </div>

          <label className="relative inline-flex shrink-0 items-center gap-2">
            <span className="sr-only">{ui.language}</span>
            <Languages className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-brand" aria-hidden />
            <select
              value={lang}
              onChange={(e) => onLangChange(e.target.value)}
              className="appearance-none rounded-xl border border-[var(--border)] bg-white/50 py-2 pl-8 pr-8 text-xs font-semibold outline-none transition hover:border-brand focus:border-brand focus:ring-2 focus:ring-brand/30 dark:bg-slate-900/50"
              aria-label={ui.language}
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <span
              className="pointer-events-none absolute right-2.5 text-[10px] text-[var(--text-muted)]"
              aria-hidden
            >
              ▾
            </span>
          </label>
        </div>
      </header>

      {groups.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">{ui.empty}</p>
      ) : (
        <div className="space-y-6">
          {groups.map(([category, recs]) => (
            <div key={category}>
              <h4 className="mb-2 text-sm font-semibold text-brand">
                {translateCategory(category, lang)}
              </h4>
              <ul className="space-y-2">
                {recs.map((rec) => (
                  <li key={rec.id} className="flex gap-2 text-sm leading-relaxed md:text-[15px]">
                    <span className="shrink-0" aria-hidden>
                      {toneIcon[rec.tone] || "•"}
                    </span>
                    <span>{translateText(rec.text, lang)}</span>
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
