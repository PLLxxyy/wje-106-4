import { create } from 'zustand';
import { THEME_STORAGE_KEY } from '../constants/mealDefaults';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  initTheme: () => void;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const readStoredTheme = (): ThemeMode => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'dark' ? 'dark' : 'light';
};

const applyThemeClass = (theme: ThemeMode) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  initTheme: () => {
    const theme = readStoredTheme();
    applyThemeClass(theme);
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === 'light' ? 'dark' : 'light';
      applyThemeClass(theme);
      return { theme };
    }),
  setTheme: (theme) => {
    applyThemeClass(theme);
    set({ theme });
  },
}));
