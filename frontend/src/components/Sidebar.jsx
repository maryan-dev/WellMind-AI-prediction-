import { NavLink } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import {
  Activity,
  BrainCircuit,
  History,
  LayoutDashboard,
  ScanSearch,
  Settings,
} from "lucide-react";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/wellness-check", label: "Wellness Check", icon: Activity },
  { to: "/models", label: "ML Models", icon: BrainCircuit },
  { to: "/lifestyle", label: "Lifestyle", icon: ScanSearch },
  { to: "/history", label: "History", icon: History },
  { to: "/profile", label: "Settings", icon: Settings },
];

export default function Sidebar({ onNavigate }) {
  return (
    <aside className="flex h-full flex-col p-3 md:p-4">
      <div className="mb-6 hidden px-2 md:block">
        <BrandLogo to={null} showSubtitle={false} compact />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-brand/12 text-brand shadow-sm ring-1 ring-brand/20"
                  : "text-[var(--text-muted)] hover:bg-white/50 hover:text-[var(--text)] dark:hover:bg-slate-800/40"
              }`
            }
          >
            <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-white/30 p-3 text-xs dark:bg-slate-900/30">
        <p className="font-semibold text-[var(--text)]">Tip</p>
        <p className="mt-1 leading-relaxed text-[var(--text-muted)]">
          Run a wellness check to refresh your AI category and tips.
        </p>
      </div>
    </aside>
  );
}
