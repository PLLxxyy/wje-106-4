export interface TemplateFoodItem {
  foodId: string;
  portion: number;
}

export interface MealTemplate {
  id: string;
  name: string;
  foods: TemplateFoodItem[];
  createdAt: string;
}
