import { create } from 'zustand';
import { MEAL_SORT_ORDER } from '../constants/mealDefaults';
import { db } from '../db/database';
import type { DiaryEntry } from '../types/diary';
import { notifyError } from '../utils/errorBus';

interface DiaryState {
  entries: DiaryEntry[];
  loading: boolean;
  loadFromDB: () => Promise<void>;
  saveToDB: (entry: DiaryEntry) => Promise<boolean>;
  deleteEntry: (id: string) => Promise<void>;
  replaceAll: (entries: DiaryEntry[]) => void;
}

const sortEntries = (entries: DiaryEntry[]) =>
  [...entries].sort((a, b) => {
    if (a.date !== b.date) {
      return b.date.localeCompare(a.date);
    }
    return MEAL_SORT_ORDER[a.mealType] - MEAL_SORT_ORDER[b.mealType];
  });

export const useDiaryStore = create<DiaryState>((set) => ({
  entries: [],
  loading: false,
  loadFromDB: async () => {
    set({ loading: true });
    try {
      const entries = await db.diaryEntries.toArray();
      set({ entries: sortEntries(entries), loading: false });
    } catch {
      notifyError('饮食记录加载失败，请稍后重试。');
      set({ loading: false });
    }
  },
  saveToDB: async (entry) => {
    try {
      await db.diaryEntries.put(entry);
      set((state) => ({
        entries: sortEntries([...state.entries.filter((item) => item.id !== entry.id), entry]),
      }));
      return true;
    } catch {
      notifyError('饮食记录保存失败，当前表单内容已保留。');
      return false;
    }
  },
  deleteEntry: async (id) => {
    try {
      await db.diaryEntries.delete(id);
      set((state) => ({ entries: state.entries.filter((entry) => entry.id !== id) }));
    } catch {
      notifyError('饮食记录删除失败。');
    }
  },
  replaceAll: (entries) => set({ entries: sortEntries(entries) }),
}));
