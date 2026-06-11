import type { MealType, MoodType } from './enums';

export interface AnnotationPoint {
  x: number;
  y: number;
  label: string;
  price?: number;
}

export interface AnnotationData {
  annotations: AnnotationPoint[];
}

export interface FoodRecord {
  id: string;
  name: string;
  portion: number;
  unit: string;
  calories: number;
  protein: number;
  fat: number;
  carb: number;
  photoAnnotation?: AnnotationData;
}

export interface DiaryEntry {
  id: string;
  date: string;
  mealType: MealType;
  foods: FoodRecord[];
  photo?: string;
  mood: MoodType;
  note: string;
  createdAt: string;
}
