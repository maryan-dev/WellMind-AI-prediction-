import { Link } from "react-router-dom";
import {
  Activity,
  Brain,
  Layers,
  Leaf,
  Moon,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import EmptyState from "../components/EmptyState";
import WellnessScoreCard from "../components/WellnessScoreCard";
import CircularProgress from "../components/charts/CircularProgress";
import RecommendationsPanel from "../components/RecommendationsPanel";
import { buildFeatureRecommendations } from "../utils/recommendationEngine";
import { useWellness } from "../context/WellnessContext";

const categoryTone = {
  Healthy: {
    badge: "bg-emerald-500/20 text-emerald-100 ring-emerald-300/40",
    glow: "from-emerald-500/30 via-brand/20 to-ai/10",
    message: "Strong lifestyle patterns — keep the momentum.",
  },
  Average: {
    badge: "bg-amber-500/20 text-amber-50 ring-amber-300/40",
    glow: "from-amber-500/25 via-brand/15 to-ai/10",
    message: "Solid baseline — a few habits can lift your score.",
  },
  Poor: {
    badge: "bg-rose-500/25 text-rose-50 ring-rose-300/40",
    glow: "from-rose-500/25 via-brand/15 to-ai/10",
    message: "Priority focus areas detected — start with sleep & stress.",
  },
};

export default function DashboardPage() {
  const { latestResult, profile } = useWellness();

  if (!latestResult) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Your AI wellness overview">
        <EmptyState
          title="No wellness analysis yet"
          description="Complete a wellness check to view your score, prediction, and personalized recommendations."
          action={
            <Link to="/wellness-check" className="btn-primary">
              Start Wellness Check
            </Link>
          }
        />
      </DashboardLayout>
    );
  }

  const { category, confidence, wellnessScore, scores, cluster, modelName, recommendations } = latestResult;
  const checklist =
    recommendations?.length > 0 ? recommendations : buildFeatureRecommendations(latestResult.form || {});
  const tone = categoryTone[category] || categoryTone.Average;

  return (
    <DashboardLayout
      title={`Welcome back, ${profile.name || "there"}`}
      subtitle="Your personalized wellness analysis"
    >
      <div className="space-y-5 animate-fade-in">
        <section className="glass-card relative overflow-hidden p-0 shadow-glass dark:shadow-glass-dark">
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.glow} opacity-60`} />
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-52 w-52 rounded-full bg-ai/20 blur-3xl" />

          <div className="relative overflow-hidden bg-gradient-to-r from-brand-deep via-brand to-ai px-5 py-5 text-white md:px-7">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/30" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI wellness report
                </p>
                <h2 className="mt-1 text-xl font-bold md:text-2xl">Your wellness status</h2>
              </div>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 backdrop-blur ${tone.badge}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-soft" />
                {category}
              </span>
            </div>
          </div>

          <div className="relative grid gap-6 p-5 md:p-7 lg:grid-cols-[minmax(0,1fr)_1.25fr] lg:gap-8">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-brand/15 bg-white/35 px-4 py-6 dark:bg-slate-950/30">
              <CircularProgress value={wellnessScore} size="lg" />
              <p className="mt-2 text-center text-sm text-[var(--text-muted)]">
                Overall score{" "}
                <span className="font-bold text-brand">{wellnessScore}/100</span>
              </p>
              <p className="mt-2 max-w-xs text-center text-xs leading-relaxed text-[var(--text-muted)]">
                {tone.message}
              </p>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              <Stat icon={Target} label="Lifestyle category" value={category} accent={category} />
              <Stat
                icon={ShieldCheck}
                label="Model confidence"
                value={`${confidence}%`}
                meter={Number(confidence)}
              />
              <Stat icon={Layers} label="Cluster" value={cluster?.label || "—"} />
              <Stat icon={Brain} label="Production model" value={modelName || "—"} />
            </dl>
          </div>
        </section>

        <div>
          <p className="section-label mb-3 px-1">Score breakdown</p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <WellnessScoreCard
              icon={Moon}
              label="Sleep Score"
              tone="sleep"
              value={Math.round(scores.sleep)}
            />
            <WellnessScoreCard
              icon={Activity}
              label="Activity Score"
              tone="activity"
              value={Math.round(scores.activity)}
            />
            <WellnessScoreCard
              icon={Leaf}
              label="Stress Index"
              tone="stress"
              value={Math.round(scores.stress)}
            />
            <WellnessScoreCard
              icon={Zap}
              label="Energy Score"
              tone="energy"
              value={Math.round(scores.fatigue)}
            />
          </div>
        </div>

        <RecommendationsPanel items={checklist} />
      </div>
    </DashboardLayout>
  );
}

function Stat({ icon: Icon, label, value, meter, accent }) {
  const accentClass =
    accent === "Healthy"
      ? "text-emerald-600 dark:text-emerald-300"
      : accent === "Poor"
        ? "text-rose-600 dark:text-rose-300"
        : accent === "Average"
          ? "text-amber-600 dark:text-amber-300"
          : "";

  return (
    <div className="group rounded-2xl border border-[var(--border)] bg-white/45 p-4 transition hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-md dark:bg-slate-900/35">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <dt className="text-xs font-medium text-[var(--text-muted)]">{label}</dt>
          <dd className={`mt-1 truncate text-base font-bold ${accentClass}`}>{value}</dd>
        </div>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      {typeof meter === "number" ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--border)]/70">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-deep to-ai transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(0, meter))}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
