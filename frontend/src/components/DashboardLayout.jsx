import { useState } from "react";
import { Menu } from "lucide-react";
import MobileTabBar from "./MobileTabBar";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell min-h-screen">
      <Navbar variant="app" />
      <div className="mx-auto flex max-w-7xl gap-4 px-0 md:px-4 md:py-5">
        <div className="hidden w-[15.5rem] shrink-0 md:block">
          <div className="glass-card sticky top-[4.25rem] max-h-[calc(100vh-5.5rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            />
            <div className="absolute left-0 top-0 h-full w-[min(18rem,88vw)] glass-card shadow-2xl">
              <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 pb-24 pt-4 md:px-2 md:pb-10 md:pt-0">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div className="min-w-0">
              {title && <h1 className="page-title truncate">{title}</h1>}
              {subtitle && <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">{subtitle}</p>}
            </div>
            <button
              type="button"
              className="shrink-0 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-2.5 md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
