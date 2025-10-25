import { useQuery } from '@tanstack/react-query';
import { useSettingsStore } from '../store/useSettingsStore.js';

export const usePollingQuery = (key, queryFn, options = {}) => {
  const { autoRefresh, refreshInterval } = useSettingsStore();

  return useQuery({
    queryKey: key,
    queryFn,
    refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
    staleTime: refreshInterval * 1000,
    ...options,
  });
};
