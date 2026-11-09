import type { Recipe } from '@whiskmate/shared-recipe/model';

/**
 * Rough calories brought by one portion of each ingredient.
 */
const INGREDIENT_CALORIES: Record<string, number> = {
  almonds: 160,
  aubergine: 35,
  barberries: 30,
  bulgur: 150,
  butter: 200,
  cauliflower: 25,
  chicken: 240,
  chickpeas: 210,
  chilli: 5,
  coriander: 2,
  cumin: 8,
  dill: 2,
  eggs: 140,
  feta: 130,
  filo: 180,
  garlic: 5,
  harissa: 20,
  lamb: 290,
  lemon: 10,
  lentils: 230,
  'olive oil': 120,
  onion: 45,
  parsley: 4,
  peppers: 30,
  pistachios: 160,
  pomegranate: 70,
  rice: 200,
  'rose water': 2,
  semolina: 220,
  spinach: 10,
  squash: 80,
  stock: 15,
  tahini: 180,
  tomato: 25,
  yogurt: 100,
};

/**
 * Calories counted for an ingredient missing from the table.
 */
const DEFAULT_INGREDIENT_CALORIES = 80;

/**
 * Two meals a day at about 1 000 kcal each, for a week.
 */
const WEEKLY_CALORIE_BUDGET = 14_000;

/**
 * Keeps the weekly meal plan within the household calorie budget.
 */
export class WeeklyCalorieBudgetPolicy {
  readonly name = 'weekly-calorie-budget';

  allows(recipe: Recipe, plannedRecipes: readonly Recipe[]): boolean {
    const plannedCalories = plannedRecipes.reduce(
      (total, planned) => total + estimateCalories(planned),
      0,
    );
    return plannedCalories + estimateCalories(recipe) <= WEEKLY_CALORIE_BUDGET;
  }
}

export function estimateCalories(recipe: Recipe): number {
  return recipe.ingredients.reduce(
    (total, { name }) => total + estimateIngredientCalories(name),
    0,
  );
}

function estimateIngredientCalories(name: string): number {
  const normalizedName = name.toLowerCase();
  const entry = Object.entries(INGREDIENT_CALORIES).find(([ingredient]) =>
    normalizedName.includes(ingredient),
  );
  return entry?.[1] ?? DEFAULT_INGREDIENT_CALORIES;
}
