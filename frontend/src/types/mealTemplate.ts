import type { MealType } from './enums';

export interface TemplateFoodItem {
  id: string;
  name: string;
  portion: number;
  unit: string;
  calories: number;
  protein: number;
  fat: number;
  carb: number;
}

export interface MealTemplate {
  id: string;
  name: string;
  mealType: MealType;
  foods: TemplateFoodItem[];
  createdAt: string;
}
