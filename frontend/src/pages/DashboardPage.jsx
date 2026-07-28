import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import EmptyState from "../components/EmptyState";
import WellnessScoreCard from "../components/WellnessScoreCard";
import CircularProgress from "../components/charts/CircularProgress";
import RecommendationsPanel from "../components/RecommendationsPanel";
import { buildFeatureRecommendations } from "../utils/recommendationEngine";
import { useWellness } from "../context/WellnessContext";

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

  return (
    <DashboardLayout
      title={`Welcome back, ${profile.name || "there"}`}
      subtitle="Your personalized wellness analysis"
    >
      <div className="space-y-5 animate-fade-in">
        <div className="glass-card overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-brand-deep to-brand px-5 py-4 text-white md:px-6">
            <div>
              <p className="section-label text-white/70">AI wellness report</p>
              <h2 className="text-xl font-bold md:text-2xl">Your wellness status</h2>
            </div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white ring-1 ring-white/30">
              {category}
            </span>
          </div>
          <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[minmax(0,1fr)_1.2fr]">
            <div className="flex flex-col items-center justify-center border-[var(--border)] pb-2 lg:border-r lg:pr-6">
              <CircularProgress value={wellnessScore} />
              <p className="mt-3 text-center text-sm text-[var(--text-muted)]">
                Overall score{" "}
                <span className="font-bold text-brand">{wellnessScore}/100</span>
              </p>
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Stat label="Lifestyle category" value={category} />
              <Stat label="Model confidence" value={`${confidence}%`} />
              <Stat label="Cluster" value={cluster?.label || "—"} />
              <Stat label="Production model" value={modelName || "—"} />
            </dl>
          </div>
        </div>

        <div>
          <p className="section-label mb-3 px-1">Score breakdown</p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <WellnessScoreCard icon="😴" label="Sleep Score" value={Math.round(scores.sleep)} />
            <WellnessScoreCard icon="🏃" label="Activity Score" value={Math.round(scores.activity)} />
            <WellnessScoreCard icon="😰" label="Stress Index" value={Math.round(scores.stress)} />
            <WellnessScoreCard
              icon="⚡"
              label="Energy Score"
              hint="Higher = less fatigue"
              value={Math.round(scores.fatigue)}
            />
          </div>
        </div>

        <RecommendationsPanel items={checklist} />
      </div>
    </DashboardLayout>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white/40 px-4 py-3 dark:bg-slate-900/25">
      <dt className="text-xs text-[var(--text-muted)]">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-semibold">{value}</dd>
    </div>
  );
}
