import { useState, type MouseEvent } from 'react';
import { DEFAULT_PRICE } from '../../constants/mealDefaults';
import type { AnnotationData, AnnotationPoint } from '../../types/diary';

interface PhotoAnnotatorProps {
  photo: string;
  value: AnnotationData;
  onChange: (value: AnnotationData) => void;
  readonly?: boolean;
}

export const PhotoAnnotator = ({ photo, value, onChange, readonly = false }: PhotoAnnotatorProps) => {
  const [label, setLabel] = useState('');
  const [price, setPrice] = useState('');

  const addAnnotation = (event: MouseEvent<HTMLDivElement>) => {
    if (readonly || !label.trim()) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const point: AnnotationPoint = {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
      label: label.trim(),
      price: price ? Number(price) : DEFAULT_PRICE,
    };
    onChange({ annotations: [...value.annotations, point] });
    setLabel('');
    setPrice('');
  };

  const removeAnnotation = (index: number) => {
    onChange({ annotations: value.annotations.filter((_, itemIndex) => itemIndex !== index) });
  };

  return (
    <div className="space-y-3">
      {!readonly ? (
        <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
          <label className="text-sm text-stone-600 dark:text-stone-300">
            标注名称
            <input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
            />
          </label>
          <label className="text-sm text-stone-600 dark:text-stone-300">
            价格
            <input
              type="number"
              min="0"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
            />
          </label>
        </div>
      ) : null}
      <div
        onClick={addAnnotation}
        className="relative overflow-hidden rounded-xl border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800"
      >
        <img src={photo} alt="餐食照片" className="max-h-[520px] w-full object-contain" />
        {value.annotations.map((point, index) => (
          <div
            key={`${point.label}-${index}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-tomato px-2 py-1 text-xs font-semibold text-white shadow-soft"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            {point.label}
            {point.price ? ` ¥${point.price}` : ''}
          </div>
        ))}
      </div>
      {!readonly && value.annotations.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {value.annotations.map((point, index) => (
            <button
              key={`${point.label}-remove-${index}`}
              type="button"
              onClick={() => removeAnnotation(index)}
              className="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700 dark:bg-stone-700 dark:text-stone-200"
            >
              移除 {point.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
