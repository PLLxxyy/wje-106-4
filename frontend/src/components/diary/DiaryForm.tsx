import { useEffect, useState } from 'react';
import { MEAL_TYPE_LABEL, MEAL_TYPES, MoodType, type MealType } from '../../constants/enums';
import { DEFAULT_PORTION, DEFAULT_UNIT } from '../../constants/mealDefaults';
import { BUTTON_LABELS, FORM_FIELD_LABELS } from '../../constants/ui';
import { useDiaryStore } from '../../stores/useDiaryStore';
import { useFoodStore } from '../../stores/useFoodStore';
import { useTemplateStore } from '../../stores/useTemplateStore';
import type { AnnotationData, DiaryEntry, FoodRecord } from '../../types/diary';
import type { MealTemplate } from '../../types/template';
import { todayISO } from '../../utils/dateUtils';
import { notifyError } from '../../utils/errorBus';
import { createId } from '../../utils/id';
import { compressImageToBase64 } from '../../utils/imageCompress';
import { createFoodRecord } from '../../utils/nutrition';
import { FoodRecordCard } from '../common/FoodRecordCard';
import { MoodEmoji } from '../common/MoodEmoji';
import { PhotoAnnotator } from './PhotoAnnotator';

interface DiaryFormProps {
  entry?: DiaryEntry;
  onSaved: (entry: DiaryEntry) => void;
}

const emptyAnnotations: AnnotationData = { annotations: [] };

const emptyFood = (): FoodRecord => ({
  id: createId(),
  name: '',
  portion: DEFAULT_PORTION,
  unit: DEFAULT_UNIT,
  calories: 0,
  protein: 0,
  fat: 0,
  carb: 0,
});

type ManualFoodField = 'name' | 'portion' | 'unit' | 'calories' | 'protein' | 'fat' | 'carb';

const manualFieldLabels: Record<ManualFoodField, string> = {
  name: FORM_FIELD_LABELS.foodName,
  portion: FORM_FIELD_LABELS.portion,
  unit: FORM_FIELD_LABELS.unit,
  calories: FORM_FIELD_LABELS.calories,
  protein: FORM_FIELD_LABELS.protein,
  fat: FORM_FIELD_LABELS.fat,
  carb: FORM_FIELD_LABELS.carb,
};

export const DiaryForm = ({ entry, onSaved }: DiaryFormProps) => {
  const saveEntry = useDiaryStore((state) => state.saveToDB);
  const foodsLibrary = useFoodStore((state) => state.items);
  const templates = useTemplateStore((state) => state.templates);
  const saveTemplate = useTemplateStore((state) => state.saveToDB);
  const [date, setDate] = useState(todayISO());
  const [mealType, setMealType] = useState<MealType>(MEAL_TYPES[0]);
  const [foods, setFoods] = useState<FoodRecord[]>([]);
  const [manualFood, setManualFood] = useState<FoodRecord>(emptyFood);
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [saveTemplateName, setSaveTemplateName] = useState('');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [photo, setPhoto] = useState('');
  const [annotation, setAnnotation] = useState<AnnotationData>(emptyAnnotations);
  const [mood, setMood] = useState<MoodType>(MoodType.GOOD);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!entry) {
      return;
    }
    setDate(entry.date);
    setMealType(entry.mealType);
    setFoods(entry.foods);
    setPhoto(entry.photo ?? '');
    setAnnotation(entry.foods[0]?.photoAnnotation ?? emptyAnnotations);
    setMood(entry.mood);
    setNote(entry.note);
  }, [entry]);

  const addLibraryFood = () => {
    const item = foodsLibrary.find((food) => food.id === selectedFoodId);
    if (!item) {
      notifyError('请先选择食物库条目。');
      return;
    }
    setFoods((current) => [...current, createFoodRecord(item)]);
    setSelectedFoodId('');
  };

  const addManualFood = () => {
    if (!manualFood.name.trim()) {
      notifyError('请填写食物名称。');
      return;
    }
    setFoods((current) => [...current, { ...manualFood, id: createId(), name: manualFood.name.trim() }]);
    setManualFood(emptyFood());
  };

  const applyTemplate = () => {
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (!template) {
      notifyError('请先选择模板。');
      return;
    }
    const templateFoods = template.foods
      .map((tf) => {
        const foodItem = foodsLibrary.find((f) => f.id === tf.foodId);
        if (!foodItem) {
          return null;
        }
        return createFoodRecord(foodItem, tf.portion);
      })
      .filter(Boolean) as FoodRecord[];
    if (templateFoods.length === 0) {
      notifyError('模板中的食物在食物库中不存在，请先维护食物库。');
      return;
    }
    setFoods((current) => [...current, ...templateFoods]);
    setSelectedTemplateId('');
  };

  const handleSaveAsTemplate = async () => {
    if (!saveTemplateName.trim()) {
      notifyError('请填写模板名称。');
      return;
    }
    if (foods.length === 0) {
      notifyError('请先添加食物后再保存为模板。');
      return;
    }
    const templateFoods = foods
      .map((food) => {
        const foodItem = foodsLibrary.find((f) => f.name === food.name);
        if (!foodItem) {
          return null;
        }
        return { foodId: foodItem.id, portion: food.portion };
      })
      .filter(Boolean) as { foodId: string; portion: number }[];
    if (templateFoods.length === 0) {
      notifyError('所选食物在食物库中不存在，无法保存为模板。');
      return;
    }
    const newTemplate: MealTemplate = {
      id: createId(),
      name: saveTemplateName.trim(),
      foods: templateFoods,
      createdAt: new Date().toISOString(),
    };
    const saved = await saveTemplate(newTemplate);
    if (saved) {
      setSaveTemplateName('');
      setShowSaveTemplate(false);
    }
  };

  const updateFoodPortion = (id: string, portion: number) => {
    setFoods((current) => current.map((food) => (food.id === id ? { ...food, portion } : food)));
  };

  const removeFood = (id: string) => {
    setFoods((current) => current.filter((food) => food.id !== id));
  };

  const handlePhoto = async (file?: File) => {
    if (!file) {
      return;
    }
    try {
      setPhoto(await compressImageToBase64(file));
    } catch {
      notifyError('照片压缩失败，请换一张图片。');
    }
  };

  const handleSave = async () => {
    if (foods.length === 0) {
      notifyError('至少添加一种食物后再保存。');
      return;
    }
    setSaving(true);
    const nextFoods = foods.map((food, index) =>
      index === 0 && photo ? { ...food, photoAnnotation: annotation } : food,
    );
    const nextEntry: DiaryEntry = {
      id: entry?.id ?? createId(),
      date,
      mealType,
      foods: nextFoods,
      photo: photo || undefined,
      mood,
      note,
      createdAt: entry?.createdAt ?? new Date().toISOString(),
    };
    const saved = await saveEntry(nextEntry);
    setSaving(false);
    if (saved) {
      onSaved(nextEntry);
    }
  };

  const updateManual = (key: ManualFoodField, value: string) => {
    const numericKeys: ManualFoodField[] = ['portion', 'calories', 'protein', 'fat', 'carb'];
    setManualFood((current) => ({
      ...current,
      [key]: numericKeys.includes(key) ? Number(value) : value,
    }));
  };

  return (
    <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
      <section className="grid gap-4 rounded-xl border border-stone-200 bg-white/80 p-5 dark:border-stone-700 dark:bg-stone-900/80 md:grid-cols-2">
        <label className="text-sm text-stone-600 dark:text-stone-300">
          {FORM_FIELD_LABELS.date}
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
          />
        </label>
        <label className="text-sm text-stone-600 dark:text-stone-300">
          {FORM_FIELD_LABELS.meal}
          <select
            value={mealType}
            onChange={(event) => setMealType(event.target.value as MealType)}
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
          >
            {MEAL_TYPES.map((meal) => (
              <option key={meal} value={meal}>
                {MEAL_TYPE_LABEL[meal]}
              </option>
            ))}
          </select>
        </label>
      </section>

      {templates.length > 0 && (
        <section className="rounded-xl border border-stone-200 bg-white/80 p-5 dark:border-stone-700 dark:bg-stone-900/80">
          <h2 className="mb-4 text-lg font-semibold text-stone-900 dark:text-stone-100">使用模板</h2>
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <select
              value={selectedTemplateId}
              onChange={(event) => setSelectedTemplateId(event.target.value)}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
            >
              <option value="">选择餐食模板</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} · {template.foods.length} 种食物
                </option>
              ))}
            </select>
            <button type="button" onClick={applyTemplate} className="rounded-lg bg-tea px-4 py-2 text-white">
              {BUTTON_LABELS.useTemplate}
            </button>
          </div>
        </section>
      )}

      <section className="rounded-xl border border-stone-200 bg-white/80 p-5 dark:border-stone-700 dark:bg-stone-900/80">
        <h2 className="mb-4 text-lg font-semibold text-stone-900 dark:text-stone-100">添加食物</h2>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <select
            value={selectedFoodId}
            onChange={(event) => setSelectedFoodId(event.target.value)}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
          >
            <option value="">选择食物库条目</option>
            {foodsLibrary.map((food) => (
              <option key={food.id} value={food.id}>
                {food.name} · {food.caloriesPerPortion} 千卡/{food.defaultUnit}
              </option>
            ))}
          </select>
          <button type="button" onClick={addLibraryFood} className="rounded-lg bg-tea px-4 py-2 text-white">
            从食物库添加
          </button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {(['name', 'portion', 'unit', 'calories', 'protein', 'fat', 'carb'] as ManualFoodField[]).map((key) => (
            <label key={key} className="text-sm text-stone-600 dark:text-stone-300">
              {manualFieldLabels[key]}
              <input
                type={key === 'name' || key === 'unit' ? 'text' : 'number'}
                min={key === 'name' || key === 'unit' ? undefined : '0'}
                value={String(manualFood[key] ?? '')}
                onChange={(event) => updateManual(key, event.target.value)}
                className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
              />
            </label>
          ))}
        </div>
        <button type="button" onClick={addManualFood} className="mt-3 rounded-lg border border-tea px-4 py-2 text-tea">
          手动添加
        </button>
      </section>

      {foods.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowSaveTemplate(!showSaveTemplate)}
            className="rounded-lg border border-tea px-4 py-2 text-sm text-tea"
          >
            {BUTTON_LABELS.saveAsTemplate}
          </button>
        </div>
      )}

      {showSaveTemplate && (
        <section className="rounded-xl border border-stone-200 bg-white/80 p-5 dark:border-stone-700 dark:bg-stone-900/80">
          <h2 className="mb-4 text-lg font-semibold text-stone-900 dark:text-stone-100">保存为模板</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={saveTemplateName}
              onChange={(e) => setSaveTemplateName(e.target.value)}
              placeholder="输入模板名称，例如：减脂早餐"
              className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
            />
            <button type="button" onClick={handleSaveAsTemplate} className="rounded-lg bg-tea px-4 py-2 text-white">
              {BUTTON_LABELS.save}
            </button>
            <button
              type="button"
              onClick={() => { setShowSaveTemplate(false); setSaveTemplateName(''); }}
              className="rounded-lg border border-stone-300 px-4 py-2"
            >
              {BUTTON_LABELS.cancel}
            </button>
          </div>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        {foods.map((food) => (
          <div key={food.id} className="space-y-2">
            <FoodRecordCard record={food} onDelete={() => removeFood(food.id)} />
            <label className="block text-sm text-stone-600 dark:text-stone-300">
              修改份量
              <input
                type="number"
                min="0"
                value={food.portion}
                onChange={(event) => updateFoodPortion(food.id, Number(event.target.value))}
                className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
              />
            </label>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-stone-200 bg-white/80 p-5 dark:border-stone-700 dark:bg-stone-900/80">
        <label className="block text-sm text-stone-600 dark:text-stone-300">
          上传餐食照片
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handlePhoto(event.target.files?.[0])}
            className="mt-2 block w-full text-sm"
          />
        </label>
        {photo ? (
          <div className="mt-4">
            <PhotoAnnotator photo={photo} value={annotation} onChange={setAnnotation} />
          </div>
        ) : null}
      </section>

      <section className="rounded-xl border border-stone-200 bg-white/80 p-5 dark:border-stone-700 dark:bg-stone-900/80">
        <h2 className="mb-3 text-lg font-semibold text-stone-900 dark:text-stone-100">{FORM_FIELD_LABELS.mood}</h2>
        <MoodEmoji value={mood} onChange={setMood} />
        <label className="mt-5 block text-sm text-stone-600 dark:text-stone-300">
          {FORM_FIELD_LABELS.note}
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-950"
          />
        </label>
      </section>

      <button
        type="button"
        disabled={saving}
        onClick={handleSave}
        className="w-full rounded-xl bg-tomato px-5 py-3 text-base font-semibold text-white transition hover:bg-tomato/90 disabled:opacity-60"
      >
        {saving ? '保存中' : BUTTON_LABELS.save}
      </button>
    </form>
  );
};
