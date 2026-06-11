import { useThemeStore } from '../../stores/useThemeStore';

export const ThemeToggle = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title="切换亮暗主题"
      className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700 shadow-sm transition hover:border-tea dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
    >
      {theme === 'dark' ? '日间' : '夜间'}
    </button>
  );
};
