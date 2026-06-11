import { MealType } from './enums';

export const APP_NAME = '美食日记本';
export const GOAL_ID = 'default';
export const DEFAULT_UNIT = '份';
export const DEFAULT_PORTION = 1;
export const MAX_IMAGE_WIDTH = 800;
export const IMAGE_QUALITY = 0.82;
export const EXPORT_FILE_PREFIX = 'food-diary-backup';
export const DATABASE_NAME = 'FoodDiaryDB';
export const THEME_STORAGE_KEY = 'food-diary-theme';
export const SEED_STORAGE_KEY = 'food-diary-seeded';
export const DATA_VERSION = 1;
export const TOAST_AUTO_CLOSE_MS = 4200;
export const CHART_HEIGHT = 280;
export const CALENDAR_GRID_DAYS = 42;
export const DAYS_IN_WEEK = 7;
export const WEEK_START_OFFSET = 1;
export const DEFAULT_RANGE_DAYS = 7;
export const MONTH_RANGE_DAYS = 30;
export const DEFAULT_PRICE = 0;
export const PERCENT_FULL = 100;
export const EMPTY_TOTAL = 0;

export const DEFAULT_DAILY_GOAL = {
  id: GOAL_ID,
  dailyCalories: 2000,
  proteinTarget: 60,
  fatTarget: 65,
  carbTarget: 300,
};

export const MEAL_SORT_ORDER: Record<MealType, number> = {
  [MealType.BREAKFAST]: 1,
  [MealType.LUNCH]: 2,
  [MealType.DINNER]: 3,
  [MealType.SNACK]: 4,
};
