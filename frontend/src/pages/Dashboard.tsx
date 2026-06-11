import { Link, useNavigate } from 'react-router-dom';
import { MEAL_TYPE_LABEL } from '../constants/enums';
import { DEFAULT_RANGE_DAYS } from '../constants/mealDefaults';
import { QUICK_ACTIONS, NUTRIENT_COLORS } from '../constants/ui';
import { CalorieRing } from '../components/common/CalorieRing';
import { EmptyState } from '../components/common/EmptyState';
import { FoodRecordCard } from '../components/common/FoodRecordCard';
import { NutrientBar } from '../components/common/NutrientBar';
import { useDiaryStore } from '../stores/useDiaryStore';
import { useGoalStore } from '../stores/useGoalStore';
import { getDiaryDetailPath } from '../constants/routes';
import { getRecentRange, todayISO } from '../utils/dateUtils';
import { sumFoods } from '../utils/nutrition';
import { useNutritionStats } from '../hooks/useNutritionStats';

export const Dashboard = () => {
  const navigate = useNavigate();
  const entries = useDiaryStore((state) => state.entries);
  const goal = useGoalStore((state) => state.goal);
  const today = todayISO();
  const todayEntries = entries.filter((entry) => entry.date === today);
  const todayTotals = todayEntries.reduce(
    (acc, entry) => {
      const totals = sumFoods(entry.foods);
      return {
        calories: acc.calories + totals.calories,
        protein: acc.protein + totals.protein,
        fat: acc.fat + totals.fat,
        carb: acc.carb + totals.carb,
      };
    },
    { calories: 0, protein: 0, fat: 0, carb: 0 },
  );
  const range = getRecentRange();
  const weekStats = useNutritionStats(range.start, range.end);
  const overCalories = Math.max(0, todayTotals.calories - goal.dailyCalories);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-stone-200 bg-white/85 p-6 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
          <p className="text-sm text-stone-500 dark:text-stone-400">今日热量</p>
          <div className="mt-5 flex justify-center">
            <CalorieRing current={todayTotals.calories} target={goal.dailyCalories} size="lg" />
          </div>
          <p className={`mt-4 text-center text-sm ${overCalories ? 'text-tomato' : 'text-tea'}`}>
            {overCalories ? `今日热量已超标 ${Math.round(overCalories)} 千卡` : '今日热量仍在目标内'}
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white/85 p-6 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-stone-950 dark:text-stone-100">今天吃得怎么样</h1>
              <p className="mt-2 text-stone-500 dark:text-stone-400">
                最近 {DEFAULT_RANGE_DAYS} 天累计 {Math.round(weekStats.totalCalories)} 千卡
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <NutrientBar label="蛋白质" current={todayTotals.protein} target={goal.proteinTarget} unit="g" color={NUTRIENT_COLORS.protein} />
            <NutrientBar label="脂肪" current={todayTotals.fat} target={goal.fatTarget} unit="g" color={NUTRIENT_COLORS.fat} />
            <NutrientBar label="碳水" current={todayTotals.carb} target={goal.carbTarget} unit="g" color={NUTRIENT_COLORS.carb} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="rounded-xl border border-stone-200 bg-white/80 p-4 text-stone-900 transition hover:-translate-y-0.5 hover:border-tea dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-100"
          >
            {action.label}
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white/85 p-6 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">今日餐次</h2>
        {todayEntries.length === 0 ? (
          <div className="mt-5">
            <EmptyState message="今天还没有记录任何餐次。" actionLabel="去记录" onAction={() => navigate('/diary/new')} />
          </div>
        ) : (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {todayEntries.map((entry) => (
              <article key={entry.id} className="space-y-3">
                <button
                  type="button"
                  onClick={() => navigate(getDiaryDetailPath(entry.id))}
                  className="text-lg font-semibold text-tea"
                >
                  {MEAL_TYPE_LABEL[entry.mealType]}
                </button>
                {entry.foods.map((food) => (
                  <FoodRecordCard key={food.id} record={food} showPhoto />
                ))}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
