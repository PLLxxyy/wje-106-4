import { create } from 'zustand';
import { DEFAULT_DAILY_GOAL } from '../constants/mealDefaults';
import { db } from '../db/database';
import type { DailyGoal } from '../types/goal';
import { notifyError } from '../utils/errorBus';

interface GoalState {
  goal: DailyGoal;
  loading: boolean;
  loadFromDB: () => Promise<void>;
  saveToDB: (goal: DailyGoal) => Promise<boolean>;
  replaceAll: (goals: DailyGoal[]) => void;
}

export const useGoalStore = create<GoalState>((set) => ({
  goal: DEFAULT_DAILY_GOAL,
  loading: false,
  loadFromDB: async () => {
    set({ loading: true });
    try {
      const goal = await db.dailyGoal.get(DEFAULT_DAILY_GOAL.id);
      set({ goal: goal ?? DEFAULT_DAILY_GOAL, loading: false });
    } catch {
      notifyError('饮食目标加载失败。');
      set({ loading: false });
    }
  },
  saveToDB: async (goal) => {
    try {
      await db.dailyGoal.put(goal);
      set({ goal });
      return true;
    } catch {
      notifyError('饮食目标保存失败。');
      return false;
    }
  },
  replaceAll: (goals) => set({ goal: goals[0] ?? DEFAULT_DAILY_GOAL }),
}));
