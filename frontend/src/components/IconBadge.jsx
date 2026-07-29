export default function IconBadge({ icon: Icon, size = "md", variant = "brand", className = "" }) {
  const sizes = {
    sm: "h-9 w-9 [&_svg]:h-4 [&_svg]:w-4",
    md: "h-11 w-11 [&_svg]:h-5 [&_svg]:w-5",
    lg: "h-16 w-16 [&_svg]:h-8 [&_svg]:w-8",
    xl: "h-20 w-20 [&_svg]:h-10 [&_svg]:w-10",
  };

  const variants = {
    brand: "bg-gradient-to-br from-brand/25 to-brand-deep/15 text-brand-deep ring-1 ring-brand/25 dark:text-brand-light",
    muted: "bg-white/40 text-[var(--text-muted)] ring-1 ring-[var(--border)] dark:bg-slate-900/40",
    hero: "bg-gradient-to-br from-health/20 to-ai/25 text-health ring-1 ring-health/30 dark:text-ai-light",
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl ${sizes[size]} ${variants[variant]} ${className}`}
    >
      <Icon aria-hidden />
    </span>
  );
}
