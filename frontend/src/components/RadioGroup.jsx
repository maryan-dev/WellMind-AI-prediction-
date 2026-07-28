export default function RadioGroup({ label, name, value, onChange, options, error }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition ${
              value === opt.value
                ? "border-brand bg-brand/10 text-brand ring-1 ring-brand/30"
                : "border-[var(--border)] hover:border-brand/40"
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
