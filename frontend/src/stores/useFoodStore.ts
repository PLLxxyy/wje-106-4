import { create } from 'zustand';
import { db } from '../db/database';
import type { FoodItem } from '../types/food';
import { notifyError } from '../utils/errorBus';

interface FoodState {
  items: FoodItem[];
  loading: boolean;
  loadFromDB: () => Promise<void>;
  saveToDB: (item: FoodItem) => Promise<boolean>;
  deleteFood: (id: string) => Promise<void>;
  replaceAll: (items: FoodItem[]) => void;
}

const sortFoods = (items: FoodItem[]) =>
  [...items].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

export const useFoodStore = create<FoodState>((set) => ({
  items: [],
  loading: false,
  loadFromDB: async () => {
    set({ loading: true });
    try {
      const items = await db.foodItems.toArray();
      set({ items: sortFoods(items), loading: false });
    } catch {
      notifyError('食物库加载失败。');
      set({ loading: false });
    }
  },
  saveToDB: async (item) => {
    try {
      await db.foodItems.put(item);
      set((state) => ({
        items: sortFoods([...state.items.filter((food) => food.id !== item.id), item]),
      }));
      return true;
    } catch {
      notifyError('食物保存失败，请检查输入内容。');
      return false;
    }
  },
  deleteFood: async (id) => {
    try {
      await db.foodItems.delete(id);
      set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
    } catch {
      notifyError('食物删除失败。');
    }
  },
  replaceAll: (items) => set({ items: sortFoods(items) }),
}));
