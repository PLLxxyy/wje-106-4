import { CALENDAR_GRID_DAYS } from '../../constants/mealDefaults';
import { MEAL_TYPE_LABEL, MOOD_EMOJI } from '../../constants/enums';
import { WEEKDAY_LABELS } from '../../constants/ui';
import type { DiaryEntry } from '../../types/diary';
import { addDays, getMonthMatrixStart, isSameMonth, toISODate } from '../../utils/dateUtils';
import { entryCalories } from '../../utils/nutrition';

interface MonthCalendarProps {
  monthDate: Date;
  selectedDate: string;
  entries: DiaryEntry[];
  onSelectDate: (date: string) => void;
  onMonthChange: (date: Date) => void;
}

export const MonthCalendar = ({
  monthDate,
  selectedDate,
  entries,
  onSelectDate,
  onMonthChange,
}: MonthCalendarProps) => {
  const start = getMonthMatrixStart(monthDate);
  const days = Array.from({ length: CALENDAR_GRID_DAYS }, (_, index) => toISODate(addDays(start, index)));

  return (
    <section className="rounded-xl border border-stone-200 bg-white/80 p-4 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonthChange(new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1))}
          className="rounded-lg border border-stone-200 px-3 py-2 text-sm dark:border-stone-700"
        >
          上月
        </button>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          {monthDate.getFullYear()}年{monthDate.getMonth() + 1}月
        </h2>
        <button
          type="button"
          onClick={() => onMonthChange(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1))}
          className="rounded-lg border border-stone-200 px-3 py-2 text-sm dark:border-stone-700"
        >
          下月
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-stone-500 dark:text-stone-400">
        {WEEKDAY_LABELS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((date) => {
          const dayEntries = entries.filter((entry) => entry.date === date);
          const calories = dayEntries.reduce((sum, entry) => sum + entryCalories(entry), 0);
          const selected = selectedDate === date;
          const inMonth = isSameMonth(date, monthDate);
          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelectDate(date)}
              className={`min-h-28 rounded-lg border p-2 text-left transition ${
                selected
                  ? 'border-tea bg-tea/10'
                  : 'border-stone-200 bg-white/70 hover:border-honey dark:border-stone-700 dark:bg-stone-950/50'
              } ${inMonth ? 'opacity-100' : 'opacity-45'}`}
            >
              <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {Number(date.slice(-2))}
              </span>
              {dayEntries.length > 0 ? (
                <div className="mt-2 space-y-1 text-xs text-stone-600 dark:text-stone-300">
                  <p>{dayEntries.length} 餐 · {Math.round(calories)} 千卡</p>
                  <p className="truncate">
                    {dayEntries.map((entry) => `${MEAL_TYPE_LABEL[entry.mealType]}${MOOD_EMOJI[entry.mood]}`).join(' ')}
                  </p>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
};
