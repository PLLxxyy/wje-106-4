import type { MealType } from './enums';

export interface DailyBreakdown {
  date: string;
  calories: number;
  protein: number;
  fat: number;
  carb: number;
}

export interface NutritionStats {
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarb: number;
  dailyBreakdown: DailyBreakdown[];
  mealBreakdown: Record<MealType, number>;
}
