import type { FoodCategory } from './enums';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  caloriesPerPortion: number;
  defaultUnit: string;
  proteinPerPortion: number;
  fatPerPortion: number;
  carbPerPortion: number;
}
