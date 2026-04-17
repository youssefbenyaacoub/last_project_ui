import { useEffect, useState } from "react";

export function PageLoader({
  label = "Loading...",
  isDark = false,
  compact = false,
  className = "",
}) {
  const [perceivedProgress, setPerceivedProgress] = useState(12);

  useEffect(() => {
    let timerId = 0;

    const tick = () => {
      setPerceivedProgress((current) => {
        if (current >= 88) return current;
        const easedStep = Math.max(0.5, (88 - current) * 0.14);
        return Math.min(88, current + easedStep);
      });

      timerId = window.setTimeout(tick, 120);
    };

    tick();

    return () => {
      if (timerId) {
        window.clearTimeout(timerId);
      }
    };
  }, []);

  const shellClass = compact
    ? `rounded-xl border p-4 ${
        isDark ? "border-red-500/30 bg-[#1d1115]" : "border-red-200 bg-white"
      }`
    : "p-6 lg:p-8";

  const textClass = isDark ? "text-slate-100" : "text-[var(--color-primary)]";
  const progressTrackClass = isDark ? "bg-slate-700/60" : "bg-slate-200";
  const progressFillClass = isDark
    ? "bg-linear-to-r from-slate-100 via-slate-300 to-slate-100"
    : "bg-linear-to-r from-[var(--color-primary)] via-[var(--color-primary-hover)] to-[var(--color-primary)]";
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

          <div className={`mt-3 h-1.5 w-40 overflow-hidden rounded-full ${progressTrackClass}`}>
            <div
              className={`h-full rounded-full transition-[width] duration-300 ${progressFillClass}`}
              style={{ width: `${Math.round(perceivedProgress)}%` }}
            />
          </div>

          <p className={`mt-1 text-[11px] ${isDark ? "text-slate-300" : "text-slate-500"}`}>
            {Math.round(perceivedProgress)}%
          </p>
        </div>
      </div>
    </div>
  );
}
