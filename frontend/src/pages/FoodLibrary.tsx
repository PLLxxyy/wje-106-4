import { useMemo, useState } from 'react';
import { FOOD_CATEGORIES, MEAL_TYPE_LABEL, MEAL_TYPES, type FoodCategory, type MealType } from '../constants/enums';
import { BUTTON_LABELS, FORM_FIELD_LABELS } from '../constants/ui';
import { DEFAULT_PORTION, DEFAULT_UNIT } from '../constants/mealDefaults';
import { useFoodStore } from '../stores/useFoodStore';
import { useMealTemplateStore } from '../stores/useMealTemplateStore';
import type { FoodItem } from '../types/food';
import type { MealTemplate, TemplateFoodItem } from '../types/mealTemplate';
import { createId } from '../utils/id';
import { EmptyState } from '../components/common/EmptyState';

type FoodDraft = Omit<FoodItem, 'id'>;
type TemplateDraft = Omit<MealTemplate, 'id' | 'createdAt'> & { id?: string };

const allCategory = '全部';

const createFoodDraft = (): FoodDraft => ({
  name: '',
  category: FOOD_CATEGORIES[0],
  caloriesPerPortion: 0,
  defaultUnit: DEFAULT_UNIT,
  proteinPerPortion: 0,
  fatPerPortion: 0,
  carbPerPortion: 0,
}));

const createTemplateFood = (item: FoodItem): TemplateFoodItem => ({
  id: createId(),
  name: item.name,
  portion: DEFAULT_PORTION,
  unit: item.defaultUnit,
  calories: item.caloriesPerPortion,
  protein: item.proteinPerPortion,
  fat: item.fatPerPortion,
  carb: item.carbPerPortion,
});

const createTemplateDraft = (): TemplateDraft => ({
  name: '',
  mealType: MEAL_TYPES[0],
  foods: [],
}));

const TAB_OPTIONS = [
  { key: 'foods', label: '食物库' },
  { key: 'templates', label: '餐食模板' },
] as const;

type TabKey = typeof TAB_OPTIONS[number]['key'];

export const FoodLibrary = () => {
  const items = useFoodStore((state) => state.items);
  const saveFood = useFoodStore((state) => state.saveToDB);
  const deleteFood = useFoodStore((state) => state.deleteFood);
  const templates = useMealTemplateStore((state) => state.templates);
  const saveTemplate = useMealTemplateStore((state) => state.saveTemplate);
  const deleteTemplate = useMealTemplateStore((state) => state.deleteTemplate);

  const [activeTab, setActiveTab] = useState<TabKey>('foods');

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FoodCategory | typeof allCategory>(allCategory);
  const [editingId, setEditingId] = useState('');
  const [draft, setDraft] = useState<FoodDraft>(createFoodDraft);

  const [editingTemplateId, setEditingTemplateId] = useState('');
  const [templateDraft, setTemplateDraft] = useState<TemplateDraft>(createTemplateDraft);
  const [templateSelectedFoodId, setTemplateSelectedFoodId] = useState('');

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
      setDraft(createFoodDraft());
    }
  };

  const startEditFood = (item: FoodItem) => {
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

  const updateTemplateDraft = <K extends keyof TemplateDraft>(key: K, value: TemplateDraft[K]) => {
    setTemplateDraft((current) => ({ ...current, [key]: value }));
  };

  const addFoodToTemplate = () => {
    const item = items.find((food) => food.id === templateSelectedFoodId);
    if (!item) return;
    setTemplateDraft((current) => ({
      ...current,
      foods: [...current.foods, createTemplateFood(item)],
    }));
    setTemplateSelectedFoodId('');
  };

  const removeFoodFromTemplate = (foodId: string) => {
    setTemplateDraft((current) => ({
      ...current,
      foods: current.foods.filter((f) => f.id !== foodId),
    }));
  };

  const updateTemplateFoodPortion = (foodId: string, portion: number) => {
    setTemplateDraft((current) => ({
      ...current,
      foods: current.foods.map((f) => (f.id === foodId ? { ...f, portion } : f),
    }));
  };

  const submitTemplate = async () => {
    if (!templateDraft.name.trim()) return;
    if (templateDraft.foods.length === 0) return;
    const saved = await saveTemplate({
      ...templateDraft,
      name: templateDraft.name.trim(),
    });
    if (saved) {
      setEditingTemplateId('');
      setTemplateDraft(createTemplateDraft());
    }
  };

  const startEditTemplate = (tpl: MealTemplate) => {
    setEditingTemplateId(tpl.id);
    setTemplateDraft({
      id: tpl.id,
      name: tpl.name,
      mealType: tpl.mealType,
      foods: tpl.foods.map((f) => ({ ...f })),
    });
  };

  const cancelEditTemplate = () => {
    setEditingTemplateId('');
    setTemplateDraft(createTemplateDraft());
    setTemplateSelectedFoodId('');
  };

  const totalCalories = (foods: TemplateFoodItem[]) =>
    foods.reduce((sum, f) => sum + f.calories * f.portion, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-stone-500 dark:text-stone-400">食物与模板</p>
        <h1 className="text-3xl font-semibold text-stone-950 dark:text-stone-100">常吃食物与餐食模板</h1>
      </div>

      <div className="flex gap-2">
        {TAB_OPTIONS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              activeTab === tab.key
                ? 'bg-tea text-white'
                : 'border border-stone-300 text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'foods' ? (
        <>
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
                <button type="button" onClick={() => { setEditingId(''); setDraft(createFoodDraft()); }} className="rounded-lg border border-stone-300 px-4 py-2">
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
                    <button type="button" onClick={() => startEditFood(item)} className="rounded-lg border border-tea px-3 py-2 text-sm text-tea">
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
        </>
      ) : (
        <>
          <section className="rounded-2xl border border-stone-200 bg-white/85 p-5 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
            <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
              {editingTemplateId ? '编辑模板' : '新增模板'}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm text-stone-600 dark:text-stone-300">
                模板名称
                <input
                  value={templateDraft.name}
                  onChange={(event) => updateTemplateDraft('name', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
                />
              </label>
              <label className="text-sm text-stone-600 dark:text-stone-300">
                适用餐次
                <select
                  value={templateDraft.mealType}
                  onChange={(event) => updateTemplateDraft('mealType', event.target.value as MealType)}
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
                >
                  {MEAL_TYPES.map((meal) => (
                    <option key={meal} value={meal}>{MEAL_TYPE_LABEL[meal]}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium text-stone-700 dark:text-stone-200">模板食物</h3>
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <select
                  value={templateSelectedFoodId}
                  onChange={(event) => setTemplateSelectedFoodId(event.target.value)}
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
                >
                  <option value="">从食物库选择食物</option>
                  {items.map((food) => (
                    <option key={food.id} value={food.id}>
                      {food.name} · {food.caloriesPerPortion} 千卡/{food.defaultUnit}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addFoodToTemplate}
                  className="rounded-lg bg-tea px-4 py-2 text-white"
                >
                  添加食物
                </button>
              </div>

              {templateDraft.foods.length > 0 ? (
                <div className="mt-3 grid gap-3">
                  {templateDraft.foods.map((food) => (
                    <div
                      key={food.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 p-3 dark:border-stone-700"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-stone-900 dark:text-stone-100">{food.name}</p>
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                          {food.calories * food.portion} 千卡 · 蛋白 {food.protein * food.portion}g · 脂肪 {food.fat * food.portion}g · 碳水 {food.carb * food.portion}g
                        </p>
                      </div>
                      <label className="text-sm text-stone-600 dark:text-stone-300">
                        份量
                        <input
                          type="number"
                          min="0"
                          value={food.portion}
                          onChange={(event) => updateTemplateFoodPortion(food.id, Number(event.target.value))}
                          className="ml-2 w-20 rounded-lg border border-stone-300 bg-white px-2 py-1 dark:border-stone-700 dark:bg-stone-950"
                        />
                        <span className="ml-1 text-stone-500 dark:text-stone-400">{food.unit}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeFoodFromTemplate(food.id)}
                        className="rounded-lg border border-tomato px-3 py-1 text-sm text-tomato"
                      >
                        移除
                      </button>
                    </div>
                  ))}
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    合计：{totalCalories(templateDraft.foods)} 千卡
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">暂无食物</p>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={submitTemplate}
                className="rounded-lg bg-tea px-4 py-2 text-white"
              >
                {editingTemplateId ? BUTTON_LABELS.save : BUTTON_LABELS.add}
              </button>
              {editingTemplateId ? (
                <button
                  type="button"
                  onClick={cancelEditTemplate}
                  className="rounded-lg border border-stone-300 px-4 py-2"
                >
                  {BUTTON_LABELS.cancel}
                </button>
              ) : null}
            </div>
          </section>

          {templates.length === 0 ? (
            <EmptyState message="暂无餐食模板，快去添加一个吧。" />
          ) : (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {templates.map((tpl) => (
                <article key={tpl.id} className="rounded-xl border border-stone-200 bg-white/85 p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900/80">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">{tpl.name}</h2>
                      <p className="text-sm text-stone-500 dark:text-stone-400">
                        {MEAL_TYPE_LABEL[tpl.mealType]} · {tpl.foods.length} 种食物
                      </p>
                    </div>
                    <span className="rounded-full bg-honey/20 px-3 py-1 text-sm text-stone-700 dark:text-honey">
                      {totalCalories(tpl.foods)} 千卡
                    </span>
                  </div>
                  <div className="mt-3 space-y-1">
                    {tpl.foods.slice(0, 3).map((food) => (
                      <p key={food.id} className="text-sm text-stone-600 dark:text-stone-300">
                        · {food.name} × {food.portion}{food.unit}
                      </p>
                    ))}
                    {tpl.foods.length > 3 ? (
                      <p className="text-sm text-stone-500 dark:text-stone-400">
                        还有 {tpl.foods.length - 3} 种食物...
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => startEditTemplate(tpl)} className="rounded-lg border border-tea px-3 py-2 text-sm text-tea">
                      {BUTTON_LABELS.edit}
                    </button>
                    <button type="button" onClick={() => deleteTemplate(tpl.id)} className="rounded-lg border border-tomato px-3 py-2 text-sm text-tomato">
                      {BUTTON_LABELS.delete}
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
};
