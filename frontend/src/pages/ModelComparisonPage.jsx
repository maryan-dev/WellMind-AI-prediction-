import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Crosshair,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchAllModelPredictions, fetchModelReport } from "../api/modelMetricsApi";
import { useWellness } from "../context/WellnessContext";
import { toApiPayload } from "../utils/formMappings";

function pct(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `${(Number(value) * 100).toFixed(1)}%`;
}

function normalizeRow(row) {
  return {
    name: row.Model || row.model,
    accuracy: row.Accuracy ?? row.accuracy,
    precision: row["Precision (macro)"] ?? row.precision,
    recall: row["Recall (macro)"] ?? row.recall,
    f1: row["Macro F1"] ?? row.f1 ?? row.macro_f1,
  };
}

export default function ModelComparisonPage() {
  const { latestResult } = useWellness();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchModelReport();
        if (active) setReport(data);
      } catch (e) {
        if (active) setError(e.message || "Could not load model metrics");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const { bestName, models, heroMetrics } = useMemo(() => {
    if (!report?.comparison?.length) {
      return { bestName: report?.best_model || "—", models: [], heroMetrics: null };
    }
    const rows = report.comparison.map(normalizeRow);
    const best = report.best_model || rows[0]?.name;
    const bestRow = rows.find((m) => m.name === best) || rows[0];
    return {
      bestName: best,
      models: rows,
      heroMetrics: bestRow
        ? {
            accuracy: bestRow.accuracy,
            precision: bestRow.precision,
            recall: bestRow.recall,
            f1: bestRow.f1,
          }
        : null,
    };
  }, [report]);

  const heroStats = [
    { label: "Accuracy", value: heroMetrics?.accuracy, icon: Target },
    { label: "Precision", value: heroMetrics?.precision, icon: Crosshair },
    { label: "Recall", value: heroMetrics?.recall, icon: Activity },
    { label: "F1", value: heroMetrics?.f1, icon: Zap },
  ];

  const leakage = report?.leakage_analysis;

  return (
    <DashboardLayout
      title="ML Models"
      subtitle="Production model metrics and per-model predictions on your wellness check"
    >
      {loading ? (
        <LoadingSpinner label="Loading model metrics…" />
      ) : error ? (
        <div className="glass-card border-red-400/30 p-6 text-sm text-red-600 dark:text-red-300">
          {error}
          <p className="mt-2 text-[var(--text-muted)]">
            Run <code className="text-xs">notebook/2_train_models.ipynb</code> then start the API.
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-5 animate-fade-in">
          <section className="model-hero-card rounded-2xl border border-brand/30 p-5 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-deep to-brand text-white">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-brand">Production</p>
                  <h2 className="text-xl font-bold md:text-2xl">{bestName}</h2>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                    <Sparkles className="h-3 w-3 text-brand" />
                    Highest macro F1 on test set
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {heroStats.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-[var(--border)] bg-white/40 px-2 py-2 text-center dark:bg-slate-900/40"
                  >
                    <Icon className="mx-auto mb-0.5 h-3.5 w-3.5 text-brand" />
                    <p className="text-sm font-bold tabular-nums">{pct(value)}</p>
                    <p className="text-[9px] uppercase text-[var(--text-muted)]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <YourDataAllModels form={latestResult?.form} category={latestResult?.category} />

          <section className="glass-card overflow-x-auto p-4">
            <h3 className="mb-2 text-sm font-semibold">Test set metrics</h3>
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
                  <th className="py-2 pr-3">Model</th>
                  <th className="py-2 pr-3">Acc</th>
                  <th className="py-2 pr-3">Prec</th>
                  <th className="py-2 pr-3">Rec</th>
                  <th className="py-2">F1</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.name} className="border-b border-[var(--border)]/50">
                    <td className="py-2.5 pr-3 font-medium">
                      {m.name}
                      {m.name === bestName && (
                        <span className="ml-1.5 rounded bg-brand/15 px-1.5 py-0.5 text-[9px] text-brand">BEST</span>
                      )}
                    </td>
                    <td className="py-2.5 pr-3 tabular-nums text-[var(--text-muted)]">{pct(m.accuracy)}</td>
                    <td className="py-2.5 pr-3 tabular-nums text-[var(--text-muted)]">{pct(m.precision)}</td>
                    <td className="py-2.5 pr-3 tabular-nums text-[var(--text-muted)]">{pct(m.recall)}</td>
                    <td className="py-2.5 tabular-nums font-semibold">{pct(m.f1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {leakage?.model_training_features && (
            <details className="glass-card group p-4 text-sm">
              <summary className="cursor-pointer list-none font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="text-[var(--text-muted)] group-open:text-[var(--text)]">
                  Training features & target (10 inputs)
                </span>
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">
                {leakage.model_training_features.join(" · ")}
              </p>
              {leakage.target_definition && (
                <ul className="mt-2 space-y-1 text-xs text-[var(--text-muted)]">
                  {Object.entries(leakage.target_definition).map(([k, v]) => (
                    <li key={k}>
                      <strong className="text-[var(--text)]">{k}:</strong> {v}
                    </li>
                  ))}
                </ul>
              )}
            </details>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

function categoryClass(label) {
  if (label === "Healthy") return "bg-brand/15 text-brand";
  if (label === "Poor") return "bg-red-500/15 text-red-400";
  return "bg-amber-500/15 text-amber-600 dark:text-amber-300";
}

function YourDataAllModels({ form, category }) {
  const [votes, setVotes] = useState(null);
  const [loadingVotes, setLoadingVotes] = useState(false);
  const [voteError, setVoteError] = useState("");

  useEffect(() => {
    if (!form?.sleepDuration) return;
    let active = true;
    setLoadingVotes(true);
    setVoteError("");
    (async () => {
      try {
        const data = await fetchAllModelPredictions(toApiPayload(form));
        if (active) setVotes(data);
      } catch (e) {
        if (active) setVoteError(e.message || "Could not run all models");
      } finally {
        if (active) setLoadingVotes(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [form]);

  if (!form?.sleepDuration) {
    return (
      <section className="glass-card p-5 text-center">
        <h3 className="text-sm font-semibold">Your predictions</h3>
        <p className="mt-1 text-xs text-[var(--text-muted)]">Complete a wellness check to compare models on your data.</p>
        <Link to="/wellness-check" className="btn-primary mt-3 inline-flex text-sm">
          Wellness Check
        </Link>
      </section>
    );
  }

  const production = votes?.predictions?.find((r) => r.is_best_model);

  return (
    <section className="glass-card p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold">Your predictions</h3>
        {votes?.best_model && votes?.best_model_prediction && (
          <p className="text-xs text-[var(--text-muted)]">
            Final ·{" "}
            <strong className="text-[var(--text)]">{votes.best_model}</strong>{" "}
            <span className={`ml-1 rounded px-1.5 py-0.5 font-medium ${categoryClass(votes.best_model_prediction)}`}>
              {votes.best_model_prediction}
            </span>
            {production?.confidence_pct != null && (
              <span className="ml-1 tabular-nums">{production.confidence_pct}%</span>
            )}
          </p>
        )}
      </div>
      {category && (
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Dashboard category:{" "}
          <span className={`rounded px-1.5 py-0.5 font-medium ${categoryClass(category)}`}>{category}</span>
        </p>
      )}

      {loadingVotes && <p className="mt-3 text-xs text-[var(--text-muted)]">Running models…</p>}
      {voteError && <p className="mt-3 text-xs text-red-400">{voteError}</p>}

      {votes?.predictions?.length > 0 && (
        <ul className="mt-3 divide-y divide-[var(--border)]/60 rounded-xl border border-[var(--border)]">
          {votes.predictions.map((row) => (
            <li
              key={row.model}
              className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-sm ${
                row.is_best_model ? "bg-brand/[0.06]" : ""
              }`}
            >
              <span className="min-w-0 font-medium">
                {row.model}
                {row.is_best_model && (
                  <span className="ml-1.5 rounded bg-brand/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-brand">
                    Live
                  </span>
                )}
              </span>
              <span className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${categoryClass(row.prediction)}`}>
                  {row.prediction}
                </span>
                {row.confidence_pct != null && (
                  <span className="w-12 text-right text-xs tabular-nums text-[var(--text-muted)]">
                    {row.confidence_pct}%
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
