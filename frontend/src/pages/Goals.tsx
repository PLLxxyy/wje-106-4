import { useEffect, useState } from 'react';
import { NutrientBar } from '../components/common/NutrientBar';
import { GOAL_ID } from '../constants/mealDefaults';
import { NUTRIENT_COLORS } from '../constants/ui';
import { useGoalStore } from '../stores/useGoalStore';
import type { DailyGoal } from '../types/goal';

export const Goals = () => {
  const goal = useGoalStore((state) => state.goal);
  const saveGoal = useGoalStore((state) => state.saveToDB);
  const [draft, setDraft] = useState<DailyGoal>(goal);
  const [savedText, setSavedText] = useState('');

  useEffect(() => {
    setDraft(goal);
  }, [goal]);

  const updateDraft = (key: keyof DailyGoal, value: string) => {
    setDraft((current) => ({ ...current, [key]: Number(value) }));
  };

  const submit = async () => {
    const saved = await saveGoal({ ...draft, id: GOAL_ID });
    setSavedText(saved ? '目标已保存。' : '');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm text-stone-500 dark:text-stone-400">目标设置</p>
        <h1 className="text-3xl font-semibold text-stone-950 dark:text-stone-100">设定每天的饮食边界</h1>
      </div>
      <section className="rounded-2xl border border-stone-200 bg-white/85 p-6 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-stone-600 dark:text-stone-300">
            每日热量目标
            <input type="number" min="0" value={draft.dailyCalories} onChange={(event) => updateDraft('dailyCalories', event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950" />
          </label>
          <label className="text-sm text-stone-600 dark:text-stone-300">
            蛋白质目标
            <input type="number" min="0" value={draft.proteinTarget} onChange={(event) => updateDraft('proteinTarget', event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950" />
          </label>
          <label className="text-sm text-stone-600 dark:text-stone-300">
            脂肪目标
            <input type="number" min="0" value={draft.fatTarget} onChange={(event) => updateDraft('fatTarget', event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950" />
          </label>
          <label className="text-sm text-stone-600 dark:text-stone-300">
            碳水目标
            <input type="number" min="0" value={draft.carbTarget} onChange={(event) => updateDraft('carbTarget', event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950" />
          </label>
        </div>
        <button type="button" onClick={submit} className="mt-5 rounded-lg bg-tea px-5 py-2 font-medium text-white">
          保存目标
        </button>
        {savedText ? <span className="ml-3 text-sm text-tea">{savedText}</span> : null}
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white/85 p-6 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
        <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">当前设置</h2>
        <div className="space-y-4">
          <NutrientBar label="热量" current={goal.dailyCalories} target={goal.dailyCalories} unit="千卡" color={NUTRIENT_COLORS.calories} />
          <NutrientBar label="蛋白质" current={goal.proteinTarget} target={goal.proteinTarget} unit="g" color={NUTRIENT_COLORS.protein} />
          <NutrientBar label="脂肪" current={goal.fatTarget} target={goal.fatTarget} unit="g" color={NUTRIENT_COLORS.fat} />
          <NutrientBar label="碳水" current={goal.carbTarget} target={goal.carbTarget} unit="g" color={NUTRIENT_COLORS.carb} />
        </div>
      </section>
    </div>
  );
};
