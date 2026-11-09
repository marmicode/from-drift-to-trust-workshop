import type { WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { MealRepositoryDef } from '@whiskmate/recipe/infra';
import type { Recipe } from '@whiskmate/shared-recipe/model';

export function initializeMealPlanner(
  mealRepository: MealRepositoryDef,
  recipes: WritableSignal<Recipe[]>,
): void {
  mealRepository
    .getMeals()
    .pipe(takeUntilDestroyed())
    .subscribe((loadedRecipes) => {
      recipes.update((recipes) => [...loadedRecipes, ...recipes]);
    });
}
