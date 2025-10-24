import { Switch } from '@headlessui/react';
import { useSettingsStore, REFRESH_INTERVALS } from '../store/useSettingsStore.js';

export const AutoRefreshControl = ({ compact = false }) => {
  const { autoRefresh, refreshInterval, setAutoRefresh, setRefreshInterval } = useSettingsStore();

  return (
    <div className={compact ? 'flex items-center gap-3' : 'flex items-center gap-4 text-sm'}>
      <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Auto refresh
        <Switch
          checked={autoRefresh}
          onChange={setAutoRefresh}
          className={`${
            autoRefresh ? 'bg-electric/80' : 'bg-slate-300 dark:bg-slate-700'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-electric`}
        >
          <span
            className={`${
              autoRefresh ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </label>
      {autoRefresh && (
        <select
          value={refreshInterval}
          onChange={(event) => setRefreshInterval(Number(event.target.value))}
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-600 focus:border-electric focus:outline-none dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
        >
          {REFRESH_INTERVALS.map((interval) => (
            <option key={interval} value={interval}>
              {interval}s
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
