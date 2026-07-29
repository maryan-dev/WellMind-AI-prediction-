import { NavLink } from "react-router-dom";
import { Activity, BrainCircuit, LayoutDashboard, UserRound } from "lucide-react";

const tabs = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/wellness-check", label: "Check", icon: Activity },
  { to: "/models", label: "Models", icon: BrainCircuit },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export default function MobileTabBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--bg-card)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-semibold transition ${
                isActive ? "text-brand" : "text-[var(--text-muted)]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    isActive ? "bg-brand/12 ring-1 ring-brand/25" : ""
                  }`}
                >
                  <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.25 : 2} aria-hidden />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
