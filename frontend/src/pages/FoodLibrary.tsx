import { useMemo, useState } from 'react';
import { FOOD_CATEGORIES, type FoodCategory } from '../constants/enums';
import { BUTTON_LABELS, FORM_FIELD_LABELS } from '../constants/ui';
import { DEFAULT_UNIT } from '../constants/mealDefaults';
import { useFoodStore } from '../stores/useFoodStore';
import type { FoodItem } from '../types/food';
import { createId } from '../utils/id';
import { EmptyState } from '../components/common/EmptyState';

type FoodDraft = Omit<FoodItem, 'id'>;

const allCategory = '全部';

const createDraft = (): FoodDraft => ({
  name: '',
  category: FOOD_CATEGORIES[0],
  caloriesPerPortion: 0,
  defaultUnit: DEFAULT_UNIT,
  proteinPerPortion: 0,
  fatPerPortion: 0,
  carbPerPortion: 0,
});

export const FoodLibrary = () => {
  const items = useFoodStore((state) => state.items);
  const saveFood = useFoodStore((state) => state.saveToDB);
  const deleteFood = useFoodStore((state) => state.deleteFood);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FoodCategory | typeof allCategory>(allCategory);
  const [editingId, setEditingId] = useState('');
  const [draft, setDraft] = useState<FoodDraft>(createDraft);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesCategory = category === allCategory || item.category === category;
        const matchesQuery = item.name.includes(query.trim());
        return matchesCategory && matchesQuery;
      }),
    [category, items, query],
  );

  const updateDraft = (key: keyof FoodDraft, value: string) => {
    const numericKeys: Array<keyof FoodDraft> = [
      'caloriesPerPortion',
      'proteinPerPortion',
      'fatPerPortion',
      'carbPerPortion',
    ];
    setDraft((current) => ({
      ...current,
      [key]: numericKeys.includes(key) ? Number(value) : value,
    }));
  };

  const submitFood = async () => {
    if (!draft.name.trim()) {
      return;
    }
    const saved = await saveFood({ ...draft, id: editingId || createId(), name: draft.name.trim() });
    if (saved) {
      setEditingId('');
      setDraft(createDraft());
    }
  };

  const startEdit = (item: FoodItem) => {
    setEditingId(item.id);
    setDraft({
      name: item.name,
      category: item.category,
      caloriesPerPortion: item.caloriesPerPortion,
      defaultUnit: item.defaultUnit,
      proteinPerPortion: item.proteinPerPortion,
      fatPerPortion: item.fatPerPortion,
      carbPerPortion: item.carbPerPortion,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-stone-500 dark:text-stone-400">食物库</p>
        <h1 className="text-3xl font-semibold text-stone-950 dark:text-stone-100">常吃食物与营养数据</h1>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white/85 p-5 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
        <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
          {editingId ? '编辑食物' : '新增食物'}
        </h2>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="text-sm text-stone-600 dark:text-stone-300">
            {FORM_FIELD_LABELS.foodName}
            <input value={draft.name} onChange={(event) => updateDraft('name', event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950" />
          </label>
          <label className="text-sm text-stone-600 dark:text-stone-300">
            分类
            <select value={draft.category} onChange={(event) => updateDraft('category', event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950">
              {FOOD_CATEGORIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-stone-600 dark:text-stone-300">
            {FORM_FIELD_LABELS.calories}
            <input type="number" min="0" value={draft.caloriesPerPortion} onChange={(event) => updateDraft('caloriesPerPortion', event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950" />
          </label>
          <label className="text-sm text-stone-600 dark:text-stone-300">
            {FORM_FIELD_LABELS.unit}
            <input value={draft.defaultUnit} onChange={(event) => updateDraft('defaultUnit', event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950" />
          </label>
          <label className="text-sm text-stone-600 dark:text-stone-300">
            {FORM_FIELD_LABELS.protein}
            <input type="number" min="0" value={draft.proteinPerPortion} onChange={(event) => updateDraft('proteinPerPortion', event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950" />
          </label>
          <label className="text-sm text-stone-600 dark:text-stone-300">
            {FORM_FIELD_LABELS.fat}
            <input type="number" min="0" value={draft.fatPerPortion} onChange={(event) => updateDraft('fatPerPortion', event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950" />
          </label>
          <label className="text-sm text-stone-600 dark:text-stone-300">
            {FORM_FIELD_LABELS.carb}
            <input type="number" min="0" value={draft.carbPerPortion} onChange={(event) => updateDraft('carbPerPortion', event.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950" />
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={submitFood} className="rounded-lg bg-tea px-4 py-2 text-white">
            {editingId ? BUTTON_LABELS.save : BUTTON_LABELS.add}
          </button>
          {editingId ? (
            <button type="button" onClick={() => { setEditingId(''); setDraft(createDraft()); }} className="rounded-lg border border-stone-300 px-4 py-2">
              {BUTTON_LABELS.cancel}
            </button>
          ) : null}
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="搜索食物名称"
          className="min-w-60 rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
        />
        <select value={category} onChange={(event) => setCategory(event.target.value as FoodCategory | typeof allCategory)} className="rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950">
          <option value={allCategory}>{allCategory}</option>
          {FOOD_CATEGORIES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </section>

      {filteredItems.length === 0 ? (
        <EmptyState message="没有找到匹配的食物。" />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <article key={item.id} className="rounded-xl border border-stone-200 bg-white/85 p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900/80">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">{item.name}</h2>
                  <p className="text-sm text-stone-500 dark:text-stone-400">{item.category} · {item.defaultUnit}</p>
                </div>
                <span className="rounded-full bg-honey/20 px-3 py-1 text-sm text-stone-700 dark:text-honey">
                  {item.caloriesPerPortion} 千卡
                </span>
              </div>
              <p className="mt-4 text-sm text-stone-600 dark:text-stone-300">
                蛋白 {item.proteinPerPortion}g · 脂肪 {item.fatPerPortion}g · 碳水 {item.carbPerPortion}g
              </p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => startEdit(item)} className="rounded-lg border border-tea px-3 py-2 text-sm text-tea">
                  {BUTTON_LABELS.edit}
                </button>
                <button type="button" onClick={() => deleteFood(item.id)} className="rounded-lg border border-tomato px-3 py-2 text-sm text-tomato">
                  {BUTTON_LABELS.delete}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};
