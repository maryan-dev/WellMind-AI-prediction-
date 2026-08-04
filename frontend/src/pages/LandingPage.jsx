import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Battery,
  Moon,
  Sparkles,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";

const previewMetrics = [
  { label: "Sleep", value: 85, icon: Moon, tone: "from-health to-ai" },
  { label: "Activity", value: 75, icon: Activity, tone: "from-ai to-cyan-400" },
  { label: "Stress", value: 30, icon: Zap, tone: "from-amber-400 to-orange-400", invert: true },
  { label: "Energy", value: 75, icon: Battery, tone: "from-emerald-400 to-health" },
];

const RING_CIRCUMFERENCE = 2 * Math.PI * 40;
const PREVIEW_SCORE = 85;
const ringOffset = RING_CIRCUMFERENCE - (PREVIEW_SCORE / 100) * RING_CIRCUMFERENCE;

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <Navbar />

      <section className="mx-auto flex max-w-7xl items-center px-4 pb-16 pt-12 md:px-6 md:pt-20 lg:min-h-[calc(100vh-4rem)]">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          <div className="animate-slide-up">
            <p className="section-label-brand mb-3">Machine learning wellness tool</p>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-ai" /> AI-powered wellness platform
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Understand Your Wellness{" "}
              <span className="bg-gradient-to-r from-health to-ai bg-clip-text text-transparent">
                With AI
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-[var(--text-muted)]">
              Analyze your lifestyle habits and receive personalized recommendations for a healthier
              daily routine.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/wellness-check" className="btn-primary">
                Start Wellness Check <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/dashboard" className="btn-secondary">
                View Dashboard
              </Link>
            </div>
          </div>

          <div className="glass-card relative overflow-hidden p-6 shadow-glass animate-fade-in dark:shadow-glass-dark md:p-7">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-health/25 blur-3xl animate-pulse-soft" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-ai/20 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

            <div className="relative mb-5 flex items-center justify-between">
              <p className="section-label-brand">Live prediction</p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand">
                <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-soft" />
                Sample result
              </span>
            </div>

            <div className="relative space-y-4">
              <div className="flex flex-col items-center rounded-2xl border border-brand/20 bg-gradient-to-b from-white/50 to-white/20 px-4 py-6 dark:from-slate-900/50 dark:to-slate-950/30">
                <div className="relative animate-float-soft">
                  <svg viewBox="0 0 100 100" className="h-36 w-36 -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-[var(--border)] opacity-50"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#previewScoreGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={RING_CIRCUMFERENCE}
                      strokeDashoffset={ringOffset}
                      className="animate-ring-draw"
                    />
                    <defs>
                      <linearGradient id="previewScoreGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0f766e" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                      Score
                    </span>
                    <span className="bg-gradient-to-br from-health to-ai bg-clip-text text-4xl font-extrabold text-transparent">
                      {PREVIEW_SCORE}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">/ 100</span>
                  </div>
                </div>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-health/30 bg-health/10 px-3 py-1 text-xs font-semibold text-health dark:text-ai-light">
                  <Sparkles className="h-3.5 w-3.5" />
                  Healthy lifestyle
                </div>
                <p className="mt-2 max-w-xs text-center text-xs text-[var(--text-muted)]">
                  AI category + live score after your wellness check.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {previewMetrics.map(({ label, value, icon: Icon, tone, invert }, i) => (
                  <div
                    key={label}
                    className="rounded-xl border border-[var(--border)] bg-white/40 p-3 dark:bg-slate-900/35"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
                        <Icon className="h-3.5 w-3.5 text-brand" />
                        {label}
                      </span>
                      <span className="text-sm font-bold tabular-nums">
                        {value}%
                        {invert ? (
                          <span className="ml-1 text-[10px] font-medium text-emerald-500">low</span>
                        ) : null}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]/60">
                      <div
                        className={`h-full origin-left rounded-full bg-gradient-to-r ${tone} animate-bar-fill`}
                        style={{
                          width: `${value}%`,
                          animationDelay: `${0.2 + i * 0.1}s`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
