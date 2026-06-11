import { ChangeEvent } from 'react';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { BUTTON_LABELS } from '../constants/ui';
import { useDiaryStore } from '../stores/useDiaryStore';
import { useFoodStore } from '../stores/useFoodStore';
import { useGoalStore } from '../stores/useGoalStore';
import type { BackupData } from '../utils/storage';
import { clearAllData, downloadBackup, importAllData } from '../utils/storage';
import { notifyError } from '../utils/errorBus';

export const Settings = () => {
  const loadDiary = useDiaryStore((state) => state.loadFromDB);
  const loadFoods = useFoodStore((state) => state.loadFromDB);
  const loadGoal = useGoalStore((state) => state.loadFromDB);

  const refreshStores = async () => {
    await Promise.all([loadDiary(), loadFoods(), loadGoal()]);
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      const text = await file.text();
      await importAllData(JSON.parse(text) as BackupData);
      await refreshStores();
    } catch {
      notifyError('导入失败，请确认 JSON 文件格式正确。');
    } finally {
      event.target.value = '';
    }
  };

  const handleClear = async () => {
    if (!window.confirm('确认清空所有本地数据？此操作不可撤销。')) {
      return;
    }
    await clearAllData();
    await refreshStores();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm text-stone-500 dark:text-stone-400">设置</p>
        <h1 className="text-3xl font-semibold text-stone-950 dark:text-stone-100">本地数据与显示偏好</h1>
      </div>
      <section className="rounded-2xl border border-stone-200 bg-white/85 p-6 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
        <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">主题</h2>
        <ThemeToggle />
      </section>
      <section className="rounded-2xl border border-stone-200 bg-white/85 p-6 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
        <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">数据备份</h2>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={downloadBackup} className="rounded-lg bg-tea px-4 py-2 text-white">
            {BUTTON_LABELS.export}
          </button>
          <label className="cursor-pointer rounded-lg border border-tea px-4 py-2 text-tea">
            {BUTTON_LABELS.import}
            <input type="file" accept="application/json" onChange={handleImport} className="sr-only" />
          </label>
          <button type="button" onClick={handleClear} className="rounded-lg bg-tomato px-4 py-2 text-white">
            {BUTTON_LABELS.clear}
          </button>
        </div>
        <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
          导出文件包含饮食记录、食物库和每日目标；导入会覆盖当前浏览器中的本地数据。
        </p>
      </section>
    </div>
  );
};
