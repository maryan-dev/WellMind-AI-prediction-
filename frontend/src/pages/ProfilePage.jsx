import DashboardLayout from "../components/DashboardLayout";
import InputField from "../components/InputField";
import { useTheme } from "../context/ThemeContext";
import { useWellness } from "../context/WellnessContext";

export default function ProfilePage() {
  const { profile, updateProfile, history, latestResult } = useWellness();
  const { theme, setTheme } = useTheme();

  const checks = history.length;
  const avgScore =
    checks > 0
      ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / checks)
      : latestResult?.wellnessScore ?? "—";

  return (
    <DashboardLayout title="Settings & Profile" subtitle="Manage your account and preferences">
      <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
        <section className="glass-card space-y-4 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">User Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="Name"
              name="name"
              value={profile.name || ""}
              onChange={(e) => updateProfile({ name: e.target.value })}
            />
            <InputField
              label="Age"
              name="age"
              type="number"
              value={profile.age || ""}
              onChange={(e) => updateProfile({ age: e.target.value })}
            />
            <InputField
              label="Gender"
              name="gender"
              value={profile.gender || ""}
              onChange={(e) => updateProfile({ gender: e.target.value })}
            />
            <InputField
              label="Occupation"
              name="occupation"
              value={profile.occupation || ""}
              onChange={(e) => updateProfile({ occupation: e.target.value })}
            />
          </div>
        </section>

        <section className="glass-card space-y-4 p-6">
          <h2 className="text-lg font-semibold">Lifestyle Statistics</h2>
          <Stat label="Total checks" value={checks} />
          <Stat label="Average score" value={avgScore} />
          <Stat label="Latest category" value={latestResult?.category ?? "—"} />

          <div className="pt-2">
            <p className="mb-2 text-sm font-medium">Theme</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`rounded-lg px-3 py-2 text-sm ${theme === "light" ? "btn-primary" : "btn-secondary"}`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`rounded-lg px-3 py-2 text-sm ${theme === "dark" ? "btn-primary" : "btn-secondary"}`}
              >
                Dark
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-3">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
