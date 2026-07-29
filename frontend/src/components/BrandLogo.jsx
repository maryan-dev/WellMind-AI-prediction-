import { Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export default function BrandLogo({ to = "/", compact = false, showSubtitle = true }) {
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-deep to-brand text-white shadow-md ring-1 ring-white/10">
        {compact ? (
          <span className="text-sm font-bold tracking-tight">WM</span>
        ) : (
          <HeartPulse className="h-5 w-5" strokeWidth={2.25} aria-hidden />
        )}
      </span>
      <span className="min-w-0 text-left leading-tight">
        <span className="block truncate font-bold tracking-tight text-[var(--text)]">WellMind AI</span>
        {showSubtitle && !compact && (
          <span className="mt-0.5 block truncate text-[11px] font-medium text-[var(--text-muted)]">
            Personal wellness recommendations
          </span>
        )}
      </span>
    </>
  );

  const className = "flex min-w-0 items-center gap-2.5";

  if (to != null && to !== "") {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
