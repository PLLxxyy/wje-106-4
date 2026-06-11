export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
}

export enum MoodType {
  GREAT = 'great',
  GOOD = 'good',
  NORMAL = 'normal',
  BAD = 'bad',
}

export enum FoodCategory {
  STAPLE = '主食',
  MEAT = '肉类',
  VEGETABLE = '蔬菜',
  FRUIT = '水果',
  DRINK = '饮品',
  SNACK = '零食',
  OTHER = '其他',
}

export const MEAL_TYPE_LABEL: Record<MealType, string> = {
  [MealType.BREAKFAST]: '早餐',
  [MealType.LUNCH]: '午餐',
  [MealType.DINNER]: '晚餐',
  [MealType.SNACK]: '加餐',
};

export const MOOD_EMOJI: Record<MoodType, string> = {
  [MoodType.GREAT]: '😊',
  [MoodType.GOOD]: '🙂',
  [MoodType.NORMAL]: '😐',
  [MoodType.BAD]: '😞',
};

export const MOOD_LABEL: Record<MoodType, string> = {
  [MoodType.GREAT]: '状态很好',
  [MoodType.GOOD]: '感觉不错',
  [MoodType.NORMAL]: '平常一餐',
  [MoodType.BAD]: '需要调整',
};

export const MEAL_TYPES = [
  MealType.BREAKFAST,
  MealType.LUNCH,
  MealType.DINNER,
  MealType.SNACK,
] as const;

export const MOOD_TYPES = [
  MoodType.GREAT,
  MoodType.GOOD,
  MoodType.NORMAL,
  MoodType.BAD,
] as const;

export const FOOD_CATEGORIES = [
  FoodCategory.STAPLE,
  FoodCategory.MEAT,
  FoodCategory.VEGETABLE,
  FoodCategory.FRUIT,
  FoodCategory.DRINK,
  FoodCategory.SNACK,
  FoodCategory.OTHER,
] as const;
