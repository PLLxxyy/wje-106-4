import { MEAL_TYPE_LABEL, MOOD_EMOJI } from '../../constants/enums';
import { EmptyState } from '../common/EmptyState';
import { FoodRecordCard } from '../common/FoodRecordCard';
import type { DiaryEntry } from '../../types/diary';
import { formatShortDate } from '../../utils/dateUtils';
import { entryCalories } from '../../utils/nutrition';

interface DayDetailProps {
  date: string;
  entries: DiaryEntry[];
  onOpenEntry: (id: string) => void;
}

export const DayDetail = ({ date, entries, onOpenEntry }: DayDetailProps) => (
  <aside className="rounded-xl border border-stone-200 bg-white/80 p-5 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
    <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">{formatShortDate(date)}</h2>
    {entries.length === 0 ? (
      <div className="mt-5">
        <EmptyState message="这一天还没有饮食记录。" />
      </div>
    ) : (
      <div className="mt-5 space-y-4">
        {entries.map((entry) => (
          <article key={entry.id} className="rounded-lg border border-stone-200 p-4 dark:border-stone-700">
            <button type="button" onClick={() => onOpenEntry(entry.id)} className="w-full text-left">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                  {MEAL_TYPE_LABEL[entry.mealType]} {MOOD_EMOJI[entry.mood]}
                </h3>
                <span className="text-sm text-tomato">{Math.round(entryCalories(entry))} 千卡</span>
              </div>
            </button>
            <div className="mt-3 grid gap-3">
              {entry.foods.map((food) => (
                <FoodRecordCard key={food.id} record={food} showPhoto />
              ))}
            </div>
          </article>
        ))}
      </div>
    )}
  </aside>
);
