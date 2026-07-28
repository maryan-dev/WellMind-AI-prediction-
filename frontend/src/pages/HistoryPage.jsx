import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import EmptyState from "../components/EmptyState";
import { useWellness } from "../context/WellnessContext";

export default function HistoryPage() {
  const { history } = useWellness();

  return (
    <DashboardLayout title="History" subtitle="Previous wellness checks">
      {history.length === 0 ? (
        <EmptyState
          title="No history yet"
          description="Your wellness checks will appear here after you complete an analysis."
          action={<Link to="/wellness-check" className="btn-primary">Start Check</Link>}
        />
      ) : (
        <div className="glass-card overflow-x-auto animate-fade-in">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] text-[var(--text-muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Wellness Category</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr key={row.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-health/10 px-2 py-1 text-xs font-medium text-health dark:bg-ai/10 dark:text-ai-light">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{row.score}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{row.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
