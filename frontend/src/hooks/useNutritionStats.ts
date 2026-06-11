import { useMemo } from 'react';
import { useDiaryStore } from '../stores/useDiaryStore';
import { calculateStats } from '../utils/nutrition';

export const useNutritionStats = (start: string, end: string) => {
  const entries = useDiaryStore((state) => state.entries);
  return useMemo(() => calculateStats(entries, start, end), [entries, start, end]);
};
