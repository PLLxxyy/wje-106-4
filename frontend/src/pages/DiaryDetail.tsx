import { useNavigate, useParams } from 'react-router-dom';
import { CalorieRing } from '../components/common/CalorieRing';
import { FoodRecordCard } from '../components/common/FoodRecordCard';
import { MoodEmoji } from '../components/common/MoodEmoji';
import { PhotoAnnotator } from '../components/diary/PhotoAnnotator';
import { MEAL_TYPE_LABEL } from '../constants/enums';
import { getDiaryEditPath, ROUTES } from '../constants/routes';
import { NUTRIENT_COLORS } from '../constants/ui';
import { useDiaryStore } from '../stores/useDiaryStore';
import { useGoalStore } from '../stores/useGoalStore';
import { sumFoods } from '../utils/nutrition';
import { NutrientBar } from '../components/common/NutrientBar';

export const DiaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const entry = useDiaryStore((state) => state.entries.find((item) => item.id === id));
  const deleteEntry = useDiaryStore((state) => state.deleteEntry);
  const goal = useGoalStore((state) => state.goal);

  if (!entry) {
    return <p className="text-stone-600 dark:text-stone-300">没有找到这条饮食记录。</p>;
  }

  const totals = sumFoods(entry.foods);
  const annotation = entry.foods[0]?.photoAnnotation ?? { annotations: [] };

  const handleDelete = async () => {
    if (window.confirm('确认删除这条记录？')) {
      await deleteEntry(entry.id);
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-2xl border border-stone-200 bg-white/85 p-6 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-stone-500 dark:text-stone-400">{entry.date}</p>
            <h1 className="text-3xl font-semibold text-stone-950 dark:text-stone-100">
              {MEAL_TYPE_LABEL[entry.mealType]}
            </h1>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => navigate(getDiaryEditPath(entry.id))} className="rounded-lg border border-tea px-4 py-2 text-tea">
              编辑
            </button>
            <button type="button" onClick={handleDelete} className="rounded-lg bg-tomato px-4 py-2 text-white">
              删除
            </button>
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
          <CalorieRing current={totals.calories} target={goal.dailyCalories} />
          <div className="space-y-4">
            <NutrientBar label="蛋白质" current={totals.protein} target={goal.proteinTarget} unit="g" color={NUTRIENT_COLORS.protein} />
            <NutrientBar label="脂肪" current={totals.fat} target={goal.fatTarget} unit="g" color={NUTRIENT_COLORS.fat} />
            <NutrientBar label="碳水" current={totals.carb} target={goal.carbTarget} unit="g" color={NUTRIENT_COLORS.carb} />
          </div>
        </div>
      </section>

      {entry.photo ? (
        <section className="rounded-2xl border border-stone-200 bg-white/85 p-6 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
          <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">餐食照片</h2>
          <PhotoAnnotator photo={entry.photo} value={annotation} onChange={() => undefined} readonly />
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        {entry.foods.map((food) => (
          <FoodRecordCard key={food.id} record={food} showPhoto />
        ))}
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white/85 p-6 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
        <h2 className="mb-3 text-xl font-semibold text-stone-900 dark:text-stone-100">心情与备注</h2>
        <MoodEmoji value={entry.mood} onChange={() => undefined} readonly />
        <p className="mt-4 text-stone-700 dark:text-stone-300">{entry.note || '没有填写备注。'}</p>
      </section>
    </div>
  );
};
