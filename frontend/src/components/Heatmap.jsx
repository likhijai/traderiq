import { clsx } from 'clsx';

const colorScale = (value) => {
  if (value > 2) return 'bg-lime-500/80 text-slate-900';
  if (value > 0) return 'bg-lime-400/60 text-slate-900';
  if (value === 0) return 'bg-slate-700/80 text-slate-100';
  if (value > -2) return 'bg-rose-500/60 text-white';
  return 'bg-rose-600/80 text-white';
};

export const Heatmap = ({ data }) => (
  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5" role="list" aria-label="Market heatmap">
    {data.map((cell, index) => (
      <div
        key={`${cell.symbol}-${index}`}
        role="listitem"
        className={clsx(
          'flex flex-col items-center justify-center rounded-lg px-2 py-3 text-xs font-semibold uppercase tracking-wide shadow-inner transition',
          colorScale(cell.change)
        )}
      >
        <span>{cell.symbol}</span>
        <span>{cell.change}%</span>
      </div>
    ))}
  </div>
);
