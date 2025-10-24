import { clsx } from 'clsx';

export const DataCard = ({ title, subtitle, value, change, footer, children, className }) => {
  const changeColor =
    change === undefined || change === null
      ? ''
      : change > 0
        ? 'text-lime-300'
        : change < 0
          ? 'text-rose-400'
          : 'text-slate-400';
  const changeSign = change === undefined || change === null ? '' : change > 0 ? '+' : '';
  const formattedChange =
    change === undefined || change === null
      ? ''
      : typeof change === 'number'
        ? `${changeSign}${change.toFixed(2)}`
        : `${change}`;
  const displayValue =
    typeof value === 'number'
      ? value.toLocaleString('en-IN', { maximumFractionDigits: 2 })
      : value ?? '--';

  return (
    <section
      className={clsx(
        'neon-card flex flex-col rounded-2xl p-5 transition hover:border-electric/70 hover:shadow-neon',
        className
      )}
      aria-live="polite"
    >
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{subtitle}</p>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        </div>
        {change !== undefined && change !== null && (
          <span className={clsx('text-sm font-medium', changeColor)}>
            {formattedChange}
            {typeof change === 'number' ? '%' : ''}
          </span>
        )}
      </header>
      <div className="mt-4 flex-1 text-3xl font-semibold text-slate-900 dark:text-white">{displayValue}</div>
      {children && <div className="mt-4 flex-1 text-sm text-slate-600 dark:text-slate-300">{children}</div>}
      {footer && <footer className="mt-4 text-xs text-slate-500 dark:text-slate-400">{footer}</footer>}
    </section>
  );
};
