export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  as = "input",
  options = [],
  icon: Icon,
  ...props
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-[var(--text)]">{label}</span>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        )}
        {as === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`input-field ${Icon ? "pl-10" : ""}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className={`input-field ${Icon ? "pl-10" : ""}`}
            {...props}
          />
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </label>
  );
}
