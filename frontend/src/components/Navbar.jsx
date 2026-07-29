import { Link, NavLink } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import BrandLogo from "./BrandLogo";

const landingNav = [
  { to: "/", label: "Home" },
  { to: "/wellness-check", label: "Wellness Check" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/models", label: "ML Models" },
];

export default function Navbar({ variant = "landing" }) {
  const { isDark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const isApp = variant === "app";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-card)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        <BrandLogo to={isApp ? "/dashboard" : "/"} showSubtitle={!isApp} />

        {!isApp && (
          <nav className="hidden items-center gap-1 md:flex">
            {landingNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-brand/10 text-brand"
                      : "text-[var(--text-muted)] hover:bg-white/50 hover:text-[var(--text)] dark:hover:bg-slate-800/50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-medium transition hover:border-brand/40"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4 text-amber-300" />
                <span className="hidden sm:inline">Light mode</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-slate-600" />
                <span className="hidden sm:inline">Dark mode</span>
              </>
            )}
          </button>
          <Link
            to="/wellness-check"
            className={`btn-primary hidden text-sm sm:inline-flex ${isApp ? "px-4 py-2" : ""}`}
          >
            {isApp ? "New check" : "Start Check"}
          </Link>
          {!isApp && (
            <button
              type="button"
              className="rounded-xl border border-[var(--border)] p-2 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {open && !isApp && (
        <div className="border-t border-[var(--border)] px-4 py-3 md:hidden">
          {landingNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setOpen(false)}
              className="block rounded-lg py-2.5 text-sm font-medium"
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/wellness-check" className="btn-primary mt-3 w-full" onClick={() => setOpen(false)}>
            Start Wellness Check
          </Link>
        </div>
      )}
    </header>
  );
}
