import { create } from 'zustand';
import { db } from '../db/database';
import type { MealTemplate } from '../types/template';
import { notifyError } from '../utils/errorBus';

interface TemplateState {
  templates: MealTemplate[];
  loading: boolean;
  loadFromDB: () => Promise<void>;
  saveToDB: (template: MealTemplate) => Promise<boolean>;
  deleteTemplate: (id: string) => Promise<void>;
}

const sortTemplates = (templates: MealTemplate[]) =>
  [...templates].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const useTemplateStore = create<TemplateState>((set) => ({
  templates: [],
  loading: false,
  loadFromDB: async () => {
    set({ loading: true });
    try {
      const templates = await db.mealTemplates.toArray();
      set({ templates: sortTemplates(templates), loading: false });
    } catch {
      notifyError('模板加载失败。');
      set({ loading: false });
    }
  },
  saveToDB: async (template) => {
    try {
      await db.mealTemplates.put(template);
      set((state) => ({
        templates: sortTemplates([...state.templates.filter((t) => t.id !== template.id), template]),
      }));
      return true;
    } catch {
      notifyError('模板保存失败，请检查输入内容。');
      return false;
    }
  },
  deleteTemplate: async (id) => {
    try {
      await db.mealTemplates.delete(id);
      set((state) => ({ templates: state.templates.filter((t) => t.id !== id) }));
    } catch {
      notifyError('模板删除失败。');
    }
  },
}));
