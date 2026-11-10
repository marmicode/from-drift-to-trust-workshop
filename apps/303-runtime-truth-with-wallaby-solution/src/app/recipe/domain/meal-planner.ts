import { inject, Service, signal, untracked } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { MealRepository } from '@whiskmate/recipe/infra';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import { initializeMealPlanner } from './meal-planner-initializer';
import {
  MealPlannerPolicyEngine,
  type MealPlannerPolicyResult,
} from './meal-planner-policy-engine';

@Service()
export class MealPlanner {
  private _recipes = signal<Recipe[]>([]);

  recipes = this._recipes.asReadonly();

  private _mealRepository = inject(MealRepository);
  private _policyEngine = inject(MealPlannerPolicyEngine);

  constructor() {
    initializeMealPlanner(this._mealRepository, this._recipes);
  }

  async addRecipe(recipe: Recipe): Promise<void> {
    if (!untracked(() => this.canAddRecipe(recipe))) {
      throw new Error(`Recipe ${recipe.id} cannot be added to the meal plan`);
    }

    await lastValueFrom(this._mealRepository.addMeal(recipe));

    this._recipes.update((recipes) => [...recipes, recipe]);
  }

  canAddRecipe(recipe: Recipe): boolean {
    return this.evaluateCanAddPolicyForRecipe(recipe).allowed;
  }

  evaluateCanAddPolicyForRecipe(recipe: Recipe): MealPlannerPolicyResult {
    return this._policyEngine.evaluate(recipe, this.recipes());
  }
}
