import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  Heart,
  Moon,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";
import VercelLogotype from "../components/VercelLogotype";

const features = [
  {
    icon: Brain,
    title: "AI Wellness Prediction",
    text: "Machine learning analyzes your lifestyle patterns.",
  },
  {
    icon: Moon,
    title: "Sleep Analysis",
    text: "Understand how your sleep affects your wellness.",
  },
  {
    icon: Heart,
    title: "Personalized Recommendations",
    text: "Receive AI-powered lifestyle suggestions.",
  },
  {
    icon: BarChart3,
    title: "Smart Dashboard",
    text: "Track your wellness score and progress.",
  },
];

const steps = [
  { n: "01", title: "Enter lifestyle data", text: "Sleep, stress, activity, and daily habits." },
  { n: "02", title: "AI analyzes patterns", text: "Models evaluate your wellness category." },
  { n: "03", title: "Get recommendations", text: "Actionable tips for a healthier routine." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-6 md:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-slide-up">
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
              <a href="#how-it-works" className="btn-secondary">
                Learn More
              </a>
            </div>
          </div>

          <div className="glass-card relative overflow-hidden p-6 animate-fade-in">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-health/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-ai/20 blur-3xl" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white/40 p-4 dark:bg-slate-900/30">
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Wellness Score</p>
                  <p className="text-3xl font-bold">85</p>
                </div>
                <Activity className="h-8 w-8 text-health" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["Sleep 85%", "Activity 75%", "Stress 30%", "Energy 75%"].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-[var(--border)] bg-white/30 px-3 py-2 text-sm dark:bg-slate-900/20"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                Preview dashboard — complete a check to see your live results.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="text-center text-3xl font-bold">Features</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="glass-card p-5 transition hover:-translate-y-1">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-health/20 to-ai/20">
                <Icon className="h-5 w-5 text-health dark:text-ai-light" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="glass-card p-8 md:p-10">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-[var(--border)] p-5">
                <span className="text-sm font-bold text-ai">{s.n}</span>
                <h3 className="mt-2 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-health to-ai p-8 text-white md:p-12">
          <h2 className="text-3xl font-bold">Benefits for everyday wellness</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              "Data-driven lifestyle insights",
              "Clear wellness category predictions",
              "Personalized AI recommendations",
              "Track progress over time",
            ].map((b) => (
              <li key={b} className="flex items-center gap-2 text-white/95">
                <CheckCircle /> {b}
              </li>
            ))}
          </ul>
          <Link
            to="/wellness-check"
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-health"
          >
            Start Your Check
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-muted)]">
        <p>© {new Date().getFullYear()} WellMind AI — Personal Wellness Recommendation System</p>
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-[var(--text-muted)] transition hover:bg-white/10 hover:text-[var(--text)]"
        >
          <VercelLogotype className="h-2.5 opacity-80" />
          <span>Deployed on Vercel</span>
        </a>
      </footer>
    </div>
  );
}

function CheckCircle() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
      ✓
    </span>
  );
}
