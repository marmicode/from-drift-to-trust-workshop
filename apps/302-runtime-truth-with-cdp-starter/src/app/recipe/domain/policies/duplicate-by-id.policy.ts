import type { Recipe } from '@whiskmate/shared-recipe/model';

export class DuplicateByIdPolicy {
  readonly name = 'duplicate-by-id';

  allows(recipe: Recipe, plannedRecipes: readonly Recipe[]): boolean {
    return plannedRecipes.every((planned) => planned.id !== recipe.id);
  }
}
