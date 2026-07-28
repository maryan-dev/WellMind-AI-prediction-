export default function LoadingSpinner({ label = "Analyzing your wellness..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 animate-fade-in">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-health/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand border-r-brand-light" />
      </div>
      <p className="text-sm font-medium text-[var(--text-muted)] animate-pulse-soft">{label}</p>
    </div>
  );
}
