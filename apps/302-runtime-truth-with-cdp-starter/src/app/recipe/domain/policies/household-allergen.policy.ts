import type { Recipe } from '@whiskmate/shared-recipe/model';

/**
 * Allergens declared by the household, with the ingredients that carry them.
 */
const HOUSEHOLD_ALLERGENS: Record<string, string[]> = {
  peanuts: ['peanut', 'groundnut', 'satay'],
  shellfish: ['prawn', 'shrimp', 'crab', 'lobster', 'mussel', 'clam'],
  'tree nuts': ['cashew', 'macadamia', 'pecan', 'brazil nut'],
};

/**
 * Keeps recipes containing a household allergen out of the plan.
 */
export class HouseholdAllergenPolicy {
  readonly name = 'household-allergen';

  allows(recipe: Recipe): boolean {
    return findAllergens(recipe).length === 0;
  }
}

export function findAllergens(recipe: Recipe): string[] {
  const ingredientNames = recipe.ingredients.map(({ name }) =>
    name.toLowerCase(),
  );

  return Object.entries(HOUSEHOLD_ALLERGENS)
    .filter(([, carriers]) =>
      carriers.some((carrier) =>
        ingredientNames.some((name) => name.includes(carrier)),
      ),
    )
    .map(([allergen]) => allergen);
}
