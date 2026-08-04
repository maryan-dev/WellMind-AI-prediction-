export default function RadioGroup({ label, name, value, onChange, options, error }) {
  return (
    <fieldset className="space-y-2.5">
      <legend className="text-sm font-medium">{label}</legend>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium transition hover:-translate-y-0.5 ${
              value === opt.value
                ? "border-brand bg-gradient-to-r from-brand/15 to-ai/10 text-brand shadow-sm ring-1 ring-brand/30"
                : "border-[var(--border)] bg-white/20 hover:border-brand/40 dark:bg-slate-900/20"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange}
              className="accent-brand"
            />
            {opt.label}
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </fieldset>
  );
}
