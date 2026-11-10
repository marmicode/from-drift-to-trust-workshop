import {
  createRecipe,
  createRecipeId,
  type Recipe,
} from '@whiskmate/shared-recipe/model';
import { findCanonicalDishId } from './dish-classifier';

export interface MealPlanEntry {
  name: string;
  ingredients: string[];
}

/**
 * Maps meal plan entries to domain recipes.
 * Ids follow the same rule as every other recipe id.
 */
export function mapMealPlanToRecipes(
  entries: readonly MealPlanEntry[],
): Recipe[] {
  return entries.map(mapMealPlanEntry);
}

function mapMealPlanEntry(entry: MealPlanEntry): Recipe {
  return createRecipe({
    id: createRecipeId(entry.name),
    course: 'main',
    name: entry.name,
    description: null,
    pictureUri: `https://example.com/${resolvePictureName(entry)}.jpg`,
    ingredients: entry.ingredients.map((name) => ({ name })),
    steps: [],
  });
}

/**
 * Recognised dishes share the picture of their canonical dish.
 */
function resolvePictureName(entry: MealPlanEntry): string {
  return findCanonicalDishId(entry.ingredients) ?? slugify(entry.name);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
