import { create } from 'zustand';
import { MEAL_TEMPLATE_STORAGE_KEY } from '../constants/mealDefaults';
import type { MealTemplate } from '../types/mealTemplate';
import { notifyError } from '../utils/errorBus';
import { createId } from '../utils/id';

interface MealTemplateState {
  templates: MealTemplate[];
  loading: boolean;
  loadFromStorage: () => void;
  saveTemplate: (template: Omit<MealTemplate, 'id' | 'createdAt'> & { id?: string }) => Promise<boolean>;
  deleteTemplate: (id: string) => Promise<void>;
}

const readFromStorage = (): MealTemplate[] => {
  try {
    const raw = localStorage.getItem(MEAL_TEMPLATE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeToStorage = (templates: MealTemplate[]) => {
  localStorage.setItem(MEAL_TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
};

const sortTemplates = (templates: MealTemplate[]) =>
  [...templates].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

export const useMealTemplateStore = create<MealTemplateState>((set) => ({
  templates: [],
  loading: false,
  loadFromStorage: () => {
    set({ templates: sortTemplates(readFromStorage()) });
  },
  saveTemplate: async (draft) => {
    try {
      const existing = readFromStorage();
      const template: MealTemplate = {
        id: draft.id || createId(),
        name: draft.name,
        mealType: draft.mealType,
        foods: draft.foods,
        createdAt: draft.id
          ? existing.find((t) => t.id === draft.id)?.createdAt ?? new Date().toISOString()
          : new Date().toISOString(),
      };
      const next = sortTemplates([
        ...existing.filter((t) => t.id !== template.id),
        template,
      ]);
      writeToStorage(next);
      set({ templates: next });
      return true;
    } catch {
      notifyError('模板保存失败。');
      return false;
    }
  },
  deleteTemplate: async (id) => {
    try {
      const existing = readFromStorage();
      const next = existing.filter((t) => t.id !== id);
      writeToStorage(next);
      set({ templates: next });
    } catch {
      notifyError('模板删除失败。');
    }
  },
}));
