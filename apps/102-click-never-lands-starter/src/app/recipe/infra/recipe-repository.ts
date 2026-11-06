import { Service } from '@angular/core';
import { type Observable, of } from 'rxjs';
import type { Course, Recipe } from '@whiskmate/shared-recipe/model';
import { RECIPES } from './recipe-data';

export interface RecipeSearchParams {
  keywords: string;
  maxIngredientCount: number | null;
  maxStepCount: number | null;
  courses?: Course[];
}

export function createRecipeSearchParams(
  params: Partial<RecipeSearchParams> = {},
): RecipeSearchParams {
  return {
    keywords: '',
    maxIngredientCount: null,
    maxStepCount: null,
    ...params,
  };
}

@Service()
export class RecipeRepository {
  private _recipes: Recipe[] = RECIPES;

  search({
    keywords,
    maxIngredientCount,
    maxStepCount,
    courses,
  }: RecipeSearchParams): Observable<Recipe[]> {
    const lowerCaseKeywords = keywords.toLowerCase();
    return of(
      this._recipes.filter(
        (recipe) =>
          (!lowerCaseKeywords ||
            recipe.name.toLowerCase().includes(lowerCaseKeywords)) &&
          (maxIngredientCount == null ||
            recipe.ingredients.length <= maxIngredientCount) &&
          (maxStepCount == null || recipe.steps.length <= maxStepCount) &&
          (courses == null || courses.includes(recipe.course)),
      ),
    );
  }
}
