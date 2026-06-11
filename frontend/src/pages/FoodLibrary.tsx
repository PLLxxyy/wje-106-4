import { useMemo, useState } from 'react';
import { FOOD_CATEGORIES, type FoodCategory } from '../constants/enums';
import { BUTTON_LABELS, FORM_FIELD_LABELS } from '../constants/ui';
import { DEFAULT_PORTION, DEFAULT_UNIT } from '../constants/mealDefaults';
import { useFoodStore } from '../stores/useFoodStore';
import { useTemplateStore } from '../stores/useTemplateStore';
import type { FoodItem } from '../types/food';
import type { MealTemplate, TemplateFoodItem } from '../types/template';
import { createId } from '../utils/id';
import { EmptyState } from '../components/common/EmptyState';
import { notifyError } from '../utils/errorBus';

type FoodDraft = Omit<FoodItem, 'id'>;
type TemplateDraft = { name: string; foods: TemplateFoodItem[] };

const allCategory = '全部';
type TabType = 'foods' | 'templates';

const createDraft = (): FoodDraft => ({
  name: '',
  category: FOOD_CATEGORIES[0],
  caloriesPerPortion: 0,
  defaultUnit: DEFAULT_UNIT,
  proteinPerPortion: 0,
  fatPerPortion: 0,
  carbPerPortion: 0,
});

const createTemplateDraft = (): TemplateDraft => ({
  name: '',
  foods: [],
});

export const FoodLibrary = () => {
  const items = useFoodStore((state) => state.items);
  const saveFood = useFoodStore((state) => state.saveToDB);
  const deleteFood = useFoodStore((state) => state.deleteFood);
  const templates = useTemplateStore((state) => state.templates);
  const saveTemplate = useTemplateStore((state) => state.saveToDB);
  const deleteTemplate = useTemplateStore((state) => state.deleteTemplate);

  const [activeTab, setActiveTab] = useState<TabType>('foods');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FoodCategory | typeof allCategory>(allCategory);
  const [editingId, setEditingId] = useState('');
  const [draft, setDraft] = useState<FoodDraft>(createDraft);
  const [editingTemplateId, setEditingTemplateId] = useState('');
  const [templateDraft, setTemplateDraft] = useState<TemplateDraft>(createTemplateDraft);
  const [selectedFoodForTemplate, setSelectedFoodForTemplate] = useState('');

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

  const updateTemplateDraft = (key: keyof TemplateDraft, value: string | TemplateFoodItem[]) => {
    setTemplateDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const addFoodToTemplate = () => {
    const item = items.find((food) => food.id === selectedFoodForTemplate);
    if (!item) {
      notifyError('请先选择食物库条目。');
      return;
    }
    const exists = templateDraft.foods.some((f) => f.foodId === item.id);
    if (exists) {
      notifyError('该食物已在模板中。');
      return;
    }
    updateTemplateDraft('foods', [...templateDraft.foods, { foodId: item.id, portion: DEFAULT_PORTION }]);
    setSelectedFoodForTemplate('');
  };

  const updateTemplateFoodPortion = (foodId: string, portion: number) => {
    updateTemplateDraft(
      'foods',
      templateDraft.foods.map((f) => (f.foodId === foodId ? { ...f, portion } : f)),
    );
  };

  const removeFoodFromTemplate = (foodId: string) => {
    updateTemplateDraft(
      'foods',
      templateDraft.foods.filter((f) => f.foodId !== foodId),
    );
  };

  const submitTemplate = async () => {
    if (!templateDraft.name.trim()) {
      notifyError('请填写模板名称。');
      return;
    }
    if (templateDraft.foods.length === 0) {
      notifyError('请至少添加一种食物到模板。');
      return;
    }
    const newTemplate: MealTemplate = {
      id: editingTemplateId || createId(),
      name: templateDraft.name.trim(),
      foods: templateDraft.foods,
      createdAt: editingTemplateId
        ? templates.find((t) => t.id === editingTemplateId)?.createdAt ?? new Date().toISOString()
        : new Date().toISOString(),
    };
    const saved = await saveTemplate(newTemplate);
    if (saved) {
      setEditingTemplateId('');
      setTemplateDraft(createTemplateDraft());
    }
  };

  const startEditTemplate = (template: MealTemplate) => {
    setEditingTemplateId(template.id);
    setTemplateDraft({
      name: template.name,
      foods: [...template.foods],
    });
  };

  const getFoodById = (id: string) => items.find((f) => f.id === id);

  const getTemplateCalories = (template: MealTemplate) => {
    return template.foods.reduce((sum, tf) => {
      const food = getFoodById(tf.foodId);
      return sum + (food?.caloriesPerPortion ?? 0) * tf.portion;
    }, 0);
  };

  const tabButtonClass = (tab: TabType) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      activeTab === tab
        ? 'bg-tea text-white'
        : 'text-stone-600 hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-800'
    }`;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-stone-500 dark:text-stone-400">食物库与模板</p>
        <h1 className="text-3xl font-semibold text-stone-950 dark:text-stone-100">常吃食物与餐食模板</h1>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => setActiveTab('foods')} className={tabButtonClass('foods')}>
          食物库
        </button>
        <button type="button" onClick={() => setActiveTab('templates')} className={tabButtonClass('templates')}>
          模板管理
        </button>
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
              placeholder="搜索食物名称"
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
        </>
      ) : (
        <>
          <section className="rounded-2xl border border-stone-200 bg-white/85 p-5 shadow-soft dark:border-stone-700 dark:bg-stone-900/80">
            <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
              {editingTemplateId ? '编辑模板' : '新增模板'}
            </h2>
            <div className="space-y-4">
              <label className="block text-sm text-stone-600 dark:text-stone-300">
                {FORM_FIELD_LABELS.templateName}
                <input
                  value={templateDraft.name}
                  onChange={(event) => updateTemplateDraft('name', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
                  placeholder="例如：减脂早餐、午餐套餐"
                />
              </label>
              <div>
                <label className="block text-sm text-stone-600 dark:text-stone-300 mb-2">添加食物到模板</label>
                <div className="flex gap-3">
                  <select
                    value={selectedFoodForTemplate}
                    onChange={(event) => setSelectedFoodForTemplate(event.target.value)}
                    className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
                  >
                    <option value="">选择食物库条目</option>
                    {items.map((food) => (
                      <option key={food.id} value={food.id}>
                        {food.name} · {food.caloriesPerPortion} 千卡/{food.defaultUnit}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={addFoodToTemplate} className="rounded-lg bg-tea px-4 py-2 text-white">
                    {BUTTON_LABELS.add}
                  </button>
                </div>
              </div>
              {templateDraft.foods.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-stone-600 dark:text-stone-300">模板包含的食物：</p>
                  {templateDraft.foods.map((tf) => {
                    const food = getFoodById(tf.foodId);
                    return (
                      <div key={tf.foodId} className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-950/50">
                        <span className="flex-1 font-medium text-stone-800 dark:text-stone-200">{food?.name}</span>
                        <label className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
                          {FORM_FIELD_LABELS.portion}
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={tf.portion}
                            onChange={(e) => updateTemplateFoodPortion(tf.foodId, Number(e.target.value))}
                            className="w-24 rounded-lg border border-stone-300 bg-white px-3 py-1 dark:border-stone-700 dark:bg-stone-950"
                          />
                          <span className="text-stone-500 dark:text-stone-400">{food?.defaultUnit}</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeFoodFromTemplate(tf.foodId)}
                          className="rounded-lg border border-tomato px-3 py-1 text-sm text-tomato"
                        >
                          {BUTTON_LABELS.delete}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={submitTemplate} className="rounded-lg bg-tea px-4 py-2 text-white">
                {editingTemplateId ? BUTTON_LABELS.save : BUTTON_LABELS.add}
              </button>
              {editingTemplateId ? (
                <button
                  type="button"
                  onClick={() => { setEditingTemplateId(''); setTemplateDraft(createTemplateDraft()); }}
                  className="rounded-lg border border-stone-300 px-4 py-2"
                >
                  {BUTTON_LABELS.cancel}
                </button>
              ) : null}
            </div>
          </section>

          {templates.length === 0 ? (
            <EmptyState message="暂无模板，创建一个常用的餐食组合吧。" />
          ) : (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {templates.map((template) => (
                <article key={template.id} className="rounded-xl border border-stone-200 bg-white/85 p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900/80">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">{template.name}</h2>
                      <p className="text-sm text-stone-500 dark:text-stone-400">包含 {template.foods.length} 种食物</p>
                    </div>
                    <span className="rounded-full bg-honey/20 px-3 py-1 text-sm text-stone-700 dark:text-honey">
                      {getTemplateCalories(template)} 千卡
                    </span>
                  </div>
                  <div className="mt-4 space-y-1">
                    {template.foods.slice(0, 3).map((tf) => {
                      const food = getFoodById(tf.foodId);
                      return food ? (
                        <p key={tf.foodId} className="text-sm text-stone-600 dark:text-stone-300">
                          {food.name} × {tf.portion} {food.defaultUnit}
                        </p>
                      ) : null;
                    })}
                    {template.foods.length > 3 && (
                      <p className="text-sm text-stone-500 dark:text-stone-400">
                        还有 {template.foods.length - 3} 种食物...
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEditTemplate(template)}
                      className="rounded-lg border border-tea px-3 py-2 text-sm text-tea"
                    >
                      {BUTTON_LABELS.edit}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTemplate(template.id)}
                      className="rounded-lg border border-tomato px-3 py-2 text-sm text-tomato"
                    >
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
