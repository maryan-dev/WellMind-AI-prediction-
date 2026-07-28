import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import EmptyState from "../components/EmptyState";
import LifestyleRadarChart from "../components/charts/LifestyleRadarChart";
import WellnessBarChart from "../components/charts/WellnessBarChart";
import { useWellness } from "../context/WellnessContext";

export default function LifestyleAnalysisPage() {
  const { latestResult } = useWellness();

  if (!latestResult) {
    return (
      <DashboardLayout title="Lifestyle Analysis" subtitle="ML clustering insights">
        <EmptyState
          title="No cluster data yet"
          description="Run a wellness check first to see which lifestyle group you belong to."
          action={<Link to="/wellness-check" className="btn-primary">Wellness Check</Link>}
        />
      </DashboardLayout>
    );
  }

  const { cluster, form, scores } = latestResult;
  const barData = [
    { name: "Sleep (h)", value: Number(form.sleepDuration) || 0 },
    { name: "Activity", value: Number(form.physicalActivityLevel) || 0 },
    { name: "Stress", value: Number(form.stressLevel) || 0 },
    { name: "Steps", value: Math.round((Number(form.dailySteps) || 0) / 100) },
  ];

  const radarData = [
    { metric: "Sleep", you: scores.sleep, cluster: (cluster.averages.sleep / 9) * 100 },
    { metric: "Activity", you: scores.activity, cluster: cluster.averages.activity },
    { metric: "Low Stress", you: 100 - scores.stress, cluster: 100 - cluster.averages.stress * 10 },
    { metric: "Steps", you: Math.min(100, (Number(form.dailySteps) / 10000) * 100), cluster: (cluster.averages.steps / 10000) * 100 },
  ];

  return (
    <DashboardLayout title="Lifestyle Analysis" subtitle="Unsupervised clustering profile">
      <div className="space-y-6 animate-fade-in">
        <div className="glass-card border-l-4 border-l-ai bg-gradient-to-r from-ai/10 to-health/5 p-6">
          <p className="text-sm text-[var(--text-muted)]">Your Lifestyle Group</p>
          <h2 className="mt-1 text-2xl font-bold">{cluster.label}</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Based on K-Means / agglomerative patterns similar to your sleep, stress, and activity profile.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="glass-card p-5">
            <h3 className="mb-2 font-semibold">Cluster averages vs you</h3>
            <LifestyleRadarChart data={radarData} />
          </section>
          <section className="glass-card p-5">
            <h3 className="mb-2 font-semibold">Your lifestyle metrics</h3>
            <WellnessBarChart data={barData} />
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Stat label="Avg sleep (cluster)" value={`${cluster.averages.sleep} h`} />
              <Stat label="Avg activity" value={cluster.averages.activity} />
              <Stat label="Avg stress" value={cluster.averages.stress} />
              <Stat label="Avg steps" value={cluster.averages.steps} />
            </dl>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-3">
      <dt className="text-xs text-[var(--text-muted)]">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
