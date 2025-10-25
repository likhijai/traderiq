export const Gauge = ({ label, value, max = 100 }) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <defs>
            <linearGradient id={`gauge-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ADEDE" />
              <stop offset="50%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r="52"
            stroke="#1E293B"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            className="opacity-40"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            stroke={`url(#gauge-${label})`}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${Math.PI * 2 * 52}`}
            strokeDashoffset={`${Math.PI * 2 * 52 * (1 - percentage / 100)}`}
            className="drop-shadow-[0_0_15px_rgba(74,222,222,0.45)]"
          />
        </svg>
        <span className="absolute text-3xl font-semibold text-slate-900 dark:text-white">{percentage}%</span>
      </div>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
    </div>
  );
};
