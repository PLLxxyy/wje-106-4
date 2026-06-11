import { useMemo, useState } from 'react';
import { CalorieTrend } from '../components/chart/CalorieTrend';
import { MealBarChart } from '../components/chart/MealBarChart';
import { NutrientPie } from '../components/chart/NutrientPie';
import { EmptyState } from '../components/common/EmptyState';
import { RANGE_OPTIONS } from '../constants/ui';
import { useNutritionStats } from '../hooks/useNutritionStats';
import { getMonthRange, getWeekRange } from '../utils/dateUtils';

type RangeValue = (typeof RANGE_OPTIONS)[number]['value'];

export const Statistics = () => {
  const [rangeValue, setRangeValue] = useState<RangeValue>('week');
  const range = useMemo(() => (rangeValue === 'week' ? getWeekRange() : getMonthRange()), [rangeValue]);
  const stats = useNutritionStats(range.start, range.end);
  const hasData = stats.totalCalories > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-stone-500 dark:text-stone-400">统计分析</p>
          <h1 className="text-3xl font-semibold text-stone-950 dark:text-stone-100">看见饮食趋势</h1>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-1 dark:border-stone-700 dark:bg-stone-900">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRangeValue(option.value)}
              className={`rounded-md px-4 py-2 text-sm ${
                rangeValue === option.value ? 'bg-tea text-white' : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <EmptyState message="当前范围内还没有统计数据。" />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-stone-200 bg-white/85 p-5 shadow-soft dark:border-stone-700 dark:bg-stone-900/80 xl:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">热量摄入趋势</h2>
            <CalorieTrend data={stats.dailyBreakdown} />
          </section>
          <section className="rounded-2xl border border-stone-200 bg-white/85 p-5 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
            <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">三大营养素占比</h2>
            <NutrientPie protein={stats.totalProtein} fat={stats.totalFat} carb={stats.totalCarb} />
          </section>
          <section className="rounded-2xl border border-stone-200 bg-white/85 p-5 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
            <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">餐次热量分布</h2>
            <MealBarChart data={stats.mealBreakdown} />
          </section>
        </div>
      )}
    </div>
  );
};
