export function PageLoader({
  label = "Loading...",
  isDark = false,
  compact = false,
  className = "",
}) {
  const shellClass = compact
    ? `rounded-xl border p-4 ${
        isDark ? "border-red-500/30 bg-[#1d1115]" : "border-red-200 bg-white"
      }`
    : "p-6 lg:p-8";

  const textClass = isDark ? "text-slate-100" : "text-[var(--color-primary)]";
  const spinnerSize = compact ? "h-10 w-10" : "h-12 w-12";
  const spinnerDarkClass = isDark ? "theme-loader-spinner-dark" : "";

  return (
    <div className={`${shellClass} ${className}`}>
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className={`theme-loader-spinner ${spinnerSize} ${spinnerDarkClass}`} />

          <p className={`mt-4 text-sm font-semibold tracking-wide ${textClass}`}>
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
