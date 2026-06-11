import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ErrorToast } from './components/common/ErrorToast';
import { ThemeToggle } from './components/common/ThemeToggle';
import { APP_NAME } from './constants/mealDefaults';
import { NAV_ITEMS } from './constants/routes';
import { seedInitialData } from './db/seed';
import { AppRoutes } from './router';
import { useDiaryStore } from './stores/useDiaryStore';
import { useFoodStore } from './stores/useFoodStore';
import { useGoalStore } from './stores/useGoalStore';
import { useThemeStore } from './stores/useThemeStore';
import { notifyError } from './utils/errorBus';

export const App = () => {
  const initTheme = useThemeStore((state) => state.initTheme);
  const loadDiary = useDiaryStore((state) => state.loadFromDB);
  const loadFoods = useFoodStore((state) => state.loadFromDB);
  const loadGoal = useGoalStore((state) => state.loadFromDB);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = async () => {
      try {
        initTheme();
        await seedInitialData();
        await Promise.all([loadDiary(), loadFoods(), loadGoal()]);
      } catch {
        notifyError('应用初始化失败，请刷新页面。');
      } finally {
        setReady(true);
      }
    };
    void start();
  }, [initTheme, loadDiary, loadFoods, loadGoal]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <NavLink to="/" className="text-xl font-semibold tracking-normal text-stone-950 dark:text-stone-100">
            {APP_NAME}
          </NavLink>
          <nav className="flex flex-wrap items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-tea text-white'
                      : 'text-stone-600 hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        {ready ? <AppRoutes /> : <p className="text-stone-600 dark:text-stone-300">正在准备本地数据。</p>}
      </main>
      <ErrorToast />
    </div>
  );
};
