import { Service, signal } from '@angular/core';
import type { Recipe } from '@whiskmate/shared-recipe/model';

@Service()
export class MealPlanner {
  private _recipes = signal<Recipe[]>([]);

  recipes = this._recipes.asReadonly();

  addRecipe(recipe: Recipe): void {
    if (!this.canAddRecipe(recipe)) {
      throw new Error(`Recipe ${recipe.id} is already in the meal plan`);
    }
    this._recipes.update((recipes) => [...recipes, recipe]);
  }

  canAddRecipe(recipe: Recipe): boolean {
    return !this._recipes().some((item) => item.id === recipe.id);
  }
}
