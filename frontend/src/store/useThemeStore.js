import { create } from 'zustand';

const prefersDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

export const useThemeStore = create((set, get) => ({
  theme: 'dark',
  initialize: () => {
    const initial = prefersDark() ? 'dark' : 'light';
    set({ theme: initial });
    get().applyTheme(initial);
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    set({ theme: next });
    get().applyTheme(next);
  },
  setTheme: (theme) => {
    set({ theme });
    get().applyTheme(theme);
  },
  applyTheme: (mode) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  },
}));
