import { MEAL_TYPE_LABEL, MOOD_EMOJI } from '../../constants/enums';
import type { DiaryEntry } from '../../types/diary';
import { entryCalories } from '../../utils/nutrition';
import { EmptyState } from '../common/EmptyState';

interface DiaryListProps {
  entries: DiaryEntry[];
  onOpen: (id: string) => void;
  emptyMessage: string;
}

export const DiaryList = ({ entries, onOpen, emptyMessage }: DiaryListProps) => {
  if (entries.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid gap-3">
      {entries.map((entry) => (
        <button
          key={entry.id}
          type="button"
          onClick={() => onOpen(entry.id)}
          className="rounded-lg border border-stone-200 bg-white/85 p-4 text-left transition hover:border-tea dark:border-stone-700 dark:bg-stone-900/80"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                {MEAL_TYPE_LABEL[entry.mealType]} {MOOD_EMOJI[entry.mood]}
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {entry.foods.map((food) => food.name).join('、')}
              </p>
            </div>
            <span className="text-sm font-semibold text-tomato">{Math.round(entryCalories(entry))} 千卡</span>
          </div>
        </button>
      ))}
    </div>
  );
};
