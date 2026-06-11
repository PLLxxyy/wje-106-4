import { DATA_VERSION, EXPORT_FILE_PREFIX } from '../constants/mealDefaults';
import { db } from '../db/database';
import type { DiaryEntry } from '../types/diary';
import type { FoodItem } from '../types/food';
import type { DailyGoal } from '../types/goal';
import { todayISO } from './dateUtils';

export interface BackupData {
  version: number;
  exportedAt: string;
  diaryEntries: DiaryEntry[];
  foodItems: FoodItem[];
  dailyGoal: DailyGoal[];
}

export const exportAllData = async (): Promise<BackupData> => ({
  version: DATA_VERSION,
  exportedAt: new Date().toISOString(),
  diaryEntries: await db.diaryEntries.toArray(),
  foodItems: await db.foodItems.toArray(),
  dailyGoal: await db.dailyGoal.toArray(),
});

export const downloadBackup = async () => {
  const data = await exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${EXPORT_FILE_PREFIX}-${todayISO()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const importAllData = async (data: BackupData) => {
  await db.transaction('rw', db.diaryEntries, db.foodItems, db.dailyGoal, async () => {
    await db.diaryEntries.clear();
    await db.foodItems.clear();
    await db.dailyGoal.clear();
    await db.diaryEntries.bulkPut(data.diaryEntries ?? []);
    await db.foodItems.bulkPut(data.foodItems ?? []);
    await db.dailyGoal.bulkPut(data.dailyGoal ?? []);
  });
};

export const clearAllData = async () => {
  await db.transaction('rw', db.diaryEntries, db.foodItems, db.dailyGoal, async () => {
    await db.diaryEntries.clear();
    await db.foodItems.clear();
    await db.dailyGoal.clear();
  });
};
