import { PERCENT_FULL } from '../../constants/mealDefaults';

interface NutrientBarProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export const NutrientBar = ({ label, current, target, unit, color }: NutrientBarProps) => {
  const percent = target > 0 ? Math.min((current / target) * PERCENT_FULL, 140) : 0;
  const isOver = current > target;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-stone-800 dark:text-stone-100">{label}</span>
        <span className={isOver ? 'text-tomato' : 'text-stone-500 dark:text-stone-400'}>
          {Math.round(current)} / {target} {unit}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percent}%`, backgroundColor: isOver ? '#c94f39' : color }}
        />
      </div>
    </div>
  );
};
