import { MEAL_TYPES, type MealType } from '../constants/enums';
import { EMPTY_TOTAL } from '../constants/mealDefaults';
import type { DiaryEntry, FoodRecord } from '../types/diary';
import type { FoodItem } from '../types/food';
import type { NutritionStats } from '../types/chart';
import { getDateRange } from './dateUtils';
import { createId } from './id';

export const sumFoods = (foods: FoodRecord[]) =>
  foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories * food.portion,
      protein: acc.protein + food.protein * food.portion,
      fat: acc.fat + food.fat * food.portion,
      carb: acc.carb + food.carb * food.portion,
    }),
    { calories: EMPTY_TOTAL, protein: EMPTY_TOTAL, fat: EMPTY_TOTAL, carb: EMPTY_TOTAL },
  );

export const entryCalories = (entry: DiaryEntry) => sumFoods(entry.foods).calories;

export const createFoodRecord = (item: FoodItem, portion = 1): FoodRecord => ({
  id: createId(),
  name: item.name,
  portion,
  unit: item.defaultUnit,
  calories: item.caloriesPerPortion,
  protein: item.proteinPerPortion,
  fat: item.fatPerPortion,
  carb: item.carbPerPortion,
});

export const emptyMealBreakdown = () =>
  MEAL_TYPES.reduce(
    (acc, meal) => ({ ...acc, [meal]: EMPTY_TOTAL }),
    {} as Record<MealType, number>,
  );

export const calculateStats = (
  entries: DiaryEntry[],
  start: string,
  end: string,
): NutritionStats => {
  const dates = getDateRange(start, end);
  const mealBreakdown = emptyMealBreakdown();
  const dailyBreakdown = dates.map((date) => {
    const dayEntries = entries.filter((entry) => entry.date === date);
    const dayTotals = dayEntries.reduce(
      (acc, entry) => {
        const totals = sumFoods(entry.foods);
        mealBreakdown[entry.mealType] += totals.calories;
        return {
          calories: acc.calories + totals.calories,
          protein: acc.protein + totals.protein,
          fat: acc.fat + totals.fat,
          carb: acc.carb + totals.carb,
        };
      },
      { calories: EMPTY_TOTAL, protein: EMPTY_TOTAL, fat: EMPTY_TOTAL, carb: EMPTY_TOTAL },
    );
    return { date, ...dayTotals };
  });

  return dailyBreakdown.reduce(
    (acc, day) => ({
      totalCalories: acc.totalCalories + day.calories,
      totalProtein: acc.totalProtein + day.protein,
      totalFat: acc.totalFat + day.fat,
      totalCarb: acc.totalCarb + day.carb,
      dailyBreakdown,
      mealBreakdown,
    }),
    {
      totalCalories: EMPTY_TOTAL,
      totalProtein: EMPTY_TOTAL,
      totalFat: EMPTY_TOTAL,
      totalCarb: EMPTY_TOTAL,
      dailyBreakdown,
      mealBreakdown,
    },
  );
};
