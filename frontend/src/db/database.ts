import Dexie, { type Table } from 'dexie';
import { DATABASE_NAME } from '../constants/mealDefaults';
import type { DiaryEntry } from '../types/diary';
import type { FoodItem } from '../types/food';
import type { DailyGoal } from '../types/goal';

export class FoodDiaryDatabase extends Dexie {
  diaryEntries!: Table<DiaryEntry, string>;
  foodItems!: Table<FoodItem, string>;
  dailyGoal!: Table<DailyGoal, string>;

  constructor() {
    super(DATABASE_NAME);
    this.version(1).stores({
      diaryEntries: 'id, date, mealType, createdAt',
      foodItems: 'id, name, category',
      dailyGoal: 'id',
    });
  }
}

export const db = new FoodDiaryDatabase();
