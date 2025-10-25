import { create } from 'zustand';

export const REFRESH_INTERVALS = [5, 15, 30, 60];

export const useSettingsStore = create((set) => ({
  autoRefresh: true,
  refreshInterval: REFRESH_INTERVALS[1],
  setAutoRefresh: (autoRefresh) => set({ autoRefresh }),
  setRefreshInterval: (refreshInterval) => set({ refreshInterval }),
}));
