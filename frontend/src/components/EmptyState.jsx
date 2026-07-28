import { Inbox } from "lucide-react";

export default function EmptyState({ title, description, action }) {
  return (
    <div className="glass-card flex flex-col items-center px-6 py-14 text-center animate-fade-in">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-health/20 to-ai/20">
        <Inbox className="h-7 w-7 text-health dark:text-ai-light" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
