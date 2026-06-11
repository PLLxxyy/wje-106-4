import { FoodCategory, MealType, MoodType } from '../constants/enums';
import { DEFAULT_DAILY_GOAL, DEFAULT_PORTION, SEED_STORAGE_KEY } from '../constants/mealDefaults';
import type { DiaryEntry, FoodRecord } from '../types/diary';
import type { FoodItem } from '../types/food';
import { addDays, toISODate } from '../utils/dateUtils';
import { createId } from '../utils/id';
import { createFoodRecord } from '../utils/nutrition';
import { db } from './database';

const foodSeedRows = [
  ['白米饭', FoodCategory.STAPLE, 230, '碗', 4.5, 0.5, 50],
  ['馒头', FoodCategory.STAPLE, 220, '个', 7, 1, 45],
  ['面条', FoodCategory.STAPLE, 280, '碗', 9, 2, 55],
  ['全麦面包', FoodCategory.STAPLE, 150, '片', 5, 2, 28],
  ['红薯', FoodCategory.STAPLE, 130, '个', 1.5, 0.2, 30],
  ['猪肉（瘦）', FoodCategory.MEAT, 180, '份', 20, 10, 1],
  ['鸡胸肉', FoodCategory.MEAT, 165, '份', 31, 3.6, 0],
  ['牛肉', FoodCategory.MEAT, 200, '份', 26, 10, 0],
  ['鱼肉（鲈鱼）', FoodCategory.MEAT, 120, '份', 20, 4, 0],
  ['鸡蛋', FoodCategory.MEAT, 80, '个', 6, 5, 1],
  ['西兰花', FoodCategory.VEGETABLE, 35, '份', 3, 0.4, 5],
  ['菠菜', FoodCategory.VEGETABLE, 25, '份', 3, 0.3, 4],
  ['番茄', FoodCategory.VEGETABLE, 20, '个', 1, 0.2, 4],
  ['黄瓜', FoodCategory.VEGETABLE, 15, '根', 0.8, 0.1, 3],
  ['胡萝卜', FoodCategory.VEGETABLE, 30, '根', 0.7, 0.2, 7],
  ['苹果', FoodCategory.FRUIT, 95, '个', 0.5, 0.3, 25],
  ['香蕉', FoodCategory.FRUIT, 105, '根', 1.3, 0.4, 27],
  ['橙子', FoodCategory.FRUIT, 65, '个', 1.2, 0.2, 16],
  ['葡萄', FoodCategory.FRUIT, 80, '份', 0.8, 0.2, 20],
  ['草莓', FoodCategory.FRUIT, 50, '份', 1, 0.3, 12],
  ['牛奶', FoodCategory.DRINK, 150, '杯', 8, 8, 12],
  ['豆浆', FoodCategory.DRINK, 80, '杯', 7, 4, 5],
  ['橙汁', FoodCategory.DRINK, 110, '杯', 1.7, 0.5, 26],
  ['咖啡（美式）', FoodCategory.DRINK, 15, '杯', 0.3, 0, 0],
  ['酸奶', FoodCategory.DRINK, 120, '杯', 5, 4, 15],
  ['薯片', FoodCategory.SNACK, 250, '袋', 3, 15, 28],
  ['巧克力', FoodCategory.SNACK, 220, '块', 3, 14, 24],
  ['坚果（混合）', FoodCategory.SNACK, 180, '份', 5, 16, 6],
  ['饼干', FoodCategory.SNACK, 160, '份', 2, 7, 22],
  ['蛋糕', FoodCategory.SNACK, 300, '块', 4, 15, 38],
] as const;

export const buildSeedFoods = (): FoodItem[] =>
  foodSeedRows.map(
    ([name, category, caloriesPerPortion, defaultUnit, proteinPerPortion, fatPerPortion, carbPerPortion]) => ({
      id: createId(),
      name,
      category,
      caloriesPerPortion,
      defaultUnit,
      proteinPerPortion,
      fatPerPortion,
      carbPerPortion,
    }),
  );

const recordFromNames = (
  foods: FoodItem[],
  items: Array<[string, number?]>,
): FoodRecord[] =>
  items.map(([name, portion = DEFAULT_PORTION]) => {
    const item = foods.find((food) => food.name === name);
    if (!item) {
      throw new Error(`缺少种子食物：${name}`);
    }
    return createFoodRecord(item, portion);
  });

const seedEntry = (
  foods: FoodItem[],
  dayOffset: number,
  mealType: MealType,
  items: Array<[string, number?]>,
  mood: MoodType,
  note: string,
): DiaryEntry => {
  const date = toISODate(addDays(new Date(), dayOffset));
  return {
    id: createId(),
    date,
    mealType,
    foods: recordFromNames(foods, items),
    mood,
    note,
    createdAt: new Date(`${date}T08:30:00`).toISOString(),
  };
};

export const buildSeedEntries = (foods: FoodItem[]): DiaryEntry[] => [
  seedEntry(foods, 0, MealType.BREAKFAST, [['全麦面包', 2], ['鸡蛋'], ['牛奶']], MoodType.GOOD, '早餐很稳，上午不容易饿。'),
  seedEntry(foods, 0, MealType.LUNCH, [['白米饭'], ['鸡胸肉'], ['西兰花']], MoodType.GREAT, '清爽的一餐，蛋白质充足。'),
  seedEntry(foods, -1, MealType.BREAKFAST, [['馒头'], ['豆浆']], MoodType.NORMAL, '简单快速。'),
  seedEntry(foods, -1, MealType.LUNCH, [['面条'], ['牛肉'], ['菠菜']], MoodType.GOOD, '午餐满足。'),
  seedEntry(foods, -1, MealType.DINNER, [['红薯'], ['鱼肉（鲈鱼）'], ['番茄']], MoodType.GOOD, '晚餐偏轻。'),
  seedEntry(foods, -2, MealType.BREAKFAST, [['香蕉'], ['酸奶']], MoodType.GREAT, '轻快开始。'),
  seedEntry(foods, -2, MealType.LUNCH, [['白米饭'], ['猪肉（瘦）'], ['黄瓜']], MoodType.NORMAL, '份量刚好。'),
  seedEntry(foods, -2, MealType.DINNER, [['面条'], ['鸡蛋', 2]], MoodType.NORMAL, '有点单一。'),
  seedEntry(foods, -2, MealType.SNACK, [['苹果']], MoodType.GOOD, '下午补充水果。'),
  seedEntry(foods, -3, MealType.BREAKFAST, [['全麦面包'], ['鸡蛋']], MoodType.GOOD, '早餐干净。'),
  seedEntry(foods, -3, MealType.LUNCH, [['白米饭'], ['牛肉'], ['胡萝卜']], MoodType.GREAT, '训练后吃得扎实。'),
  seedEntry(foods, -3, MealType.DINNER, [['红薯'], ['鸡胸肉'], ['西兰花']], MoodType.NORMAL, '晚餐克制。'),
  seedEntry(foods, -4, MealType.LUNCH, [['面条'], ['猪肉（瘦）'], ['菠菜']], MoodType.BAD, '吃得有些匆忙。'),
  seedEntry(foods, -4, MealType.DINNER, [['白米饭'], ['鱼肉（鲈鱼）'], ['番茄']], MoodType.NORMAL, '晚上恢复正常。'),
  seedEntry(foods, -5, MealType.BREAKFAST, [['香蕉'], ['牛奶']], MoodType.GREAT, '轻松的一天。'),
  seedEntry(foods, -5, MealType.LUNCH, [['白米饭'], ['鸡胸肉'], ['黄瓜']], MoodType.GOOD, '清爽高蛋白。'),
  seedEntry(foods, -5, MealType.DINNER, [['馒头'], ['牛肉'], ['胡萝卜']], MoodType.GOOD, '晚餐满足。'),
  seedEntry(foods, -5, MealType.SNACK, [['坚果（混合）'], ['橙汁']], MoodType.NORMAL, '加餐稍甜。'),
  seedEntry(foods, -6, MealType.BREAKFAST, [['全麦面包', 2], ['豆浆']], MoodType.NORMAL, '早上比较赶。'),
  seedEntry(foods, -6, MealType.LUNCH, [['面条'], ['猪肉（瘦）'], ['番茄']], MoodType.GOOD, '热量足够。'),
  seedEntry(foods, -6, MealType.DINNER, [['红薯'], ['鸡蛋', 2], ['菠菜']], MoodType.GREAT, '晚餐舒服。'),
];

export const seedInitialData = async () => {
  const hasSeeded = localStorage.getItem(SEED_STORAGE_KEY) === 'true';
  const [foodCount, diaryCount, goal] = await Promise.all([
    db.foodItems.count(),
    db.diaryEntries.count(),
    db.dailyGoal.get(DEFAULT_DAILY_GOAL.id),
  ]);
  let foods = await db.foodItems.toArray();
  if (!hasSeeded && foodCount === 0) {
    foods = buildSeedFoods();
    await db.foodItems.bulkPut(foods);
  }
  if (!hasSeeded && diaryCount === 0) {
    await db.diaryEntries.bulkPut(buildSeedEntries(foods));
  }
  if (!goal) {
    await db.dailyGoal.put(DEFAULT_DAILY_GOAL);
  }
  localStorage.setItem(SEED_STORAGE_KEY, 'true');
};
