import { PERCENT_FULL } from '../../constants/mealDefaults';

interface CalorieRingProps {
  current: number;
  target: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 96,
  md: 144,
  lg: 188,
};

export const CalorieRing = ({ current, target, size = 'md' }: CalorieRingProps) => {
  const boxSize = sizeMap[size];
  const radius = boxSize / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const percent = target > 0 ? Math.min((current / target) * PERCENT_FULL, 160) : 0;
  const dashOffset = circumference - (percent / PERCENT_FULL) * circumference;
  const isOver = current > target;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: boxSize, height: boxSize }}>
      <svg width={boxSize} height={boxSize} className="-rotate-90">
        <circle
          cx={boxSize / 2}
          cy={boxSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          className="text-stone-200 dark:text-stone-700"
        />
        <circle
          cx={boxSize / 2}
          cy={boxSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={isOver ? 'text-tomato' : 'text-tea'}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100">{Math.round(current)}</p>
        <p className="text-xs text-stone-500 dark:text-stone-400">/ {target} 千卡</p>
      </div>
    </div>
  );
};
