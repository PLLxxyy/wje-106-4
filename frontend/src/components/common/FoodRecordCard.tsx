import type { FoodRecord } from '../../types/diary';

interface FoodRecordCardProps {
  record: FoodRecord;
  showPhoto?: boolean;
  onDelete?: () => void;
}

export const FoodRecordCard = ({ record, showPhoto = false, onDelete }: FoodRecordCardProps) => {
  const totalCalories = Math.round(record.calories * record.portion);
  const annotationCount = record.photoAnnotation?.annotations.length ?? 0;

  return (
    <article className="rounded-lg border border-stone-200 bg-white/85 p-4 shadow-sm dark:border-stone-700 dark:bg-stone-900/80">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">{record.name}</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {record.portion} {record.unit} · {totalCalories} 千卡
          </p>
        </div>
        {onDelete ? (
          <button type="button" onClick={onDelete} className="text-sm text-tomato hover:underline">
            删除
          </button>
        ) : null}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <span className="rounded-md bg-tea/10 px-2 py-1 text-tea">蛋白 {Math.round(record.protein * record.portion)}g</span>
        <span className="rounded-md bg-honey/15 px-2 py-1 text-stone-700 dark:text-honey">脂肪 {Math.round(record.fat * record.portion)}g</span>
        <span className="rounded-md bg-plum/10 px-2 py-1 text-plum dark:text-pink-200">碳水 {Math.round(record.carb * record.portion)}g</span>
      </div>
      {showPhoto && annotationCount > 0 ? (
        <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">照片标注 {annotationCount} 处</p>
      ) : null}
    </article>
  );
};
