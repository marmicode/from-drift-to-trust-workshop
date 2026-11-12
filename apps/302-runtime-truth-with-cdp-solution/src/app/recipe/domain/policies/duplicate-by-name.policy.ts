import { Service } from '@angular/core';
import type { Recipe } from '@whiskmate/shared-recipe/model';

/**
 * Prevents planning two recipes that share the same display name.
 */
@Service()
export class DuplicateByNamePolicy {
  readonly name = 'duplicate-by-name';

  allows(recipe: Recipe, plannedRecipes: readonly Recipe[]): boolean {
    const normalizedName = recipe.name.trim().toLowerCase();
    return plannedRecipes.every(
      (planned) => planned.name.trim().toLowerCase() !== normalizedName,
    );
  }
}
