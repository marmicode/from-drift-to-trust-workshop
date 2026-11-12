import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Course, Recipe } from '@whiskmate/shared-recipe/model';

/**
 * Query params sent to the backend's recipe search endpoint.
 */
export interface RecipeSearchParams {
  keywords: string;
  maxIngredientCount: number | null;
  maxStepCount: number | null;
  courses?: Course[];
  /** Index of the first recipe to return. */
  offset: number;
  /** Maximum number of recipes to return. `null` returns every recipe from `offset` on. */
  limit: number | null;
}

export function createRecipeSearchParams(
  params: Partial<RecipeSearchParams> = {},
): RecipeSearchParams {
  return {
    keywords: '',
    maxIngredientCount: null,
    maxStepCount: null,
    offset: 0,
    limit: null,
    ...params,
  };
}

export interface RecipeRepositoryDef {
  search(params: RecipeSearchParams): Observable<Recipe[]>;
}

const RECIPES_URL = 'http://localhost:3333/api/recipes';

@Service()
export class RecipeRepository implements RecipeRepositoryDef {
  private _http = inject(HttpClient);

  search(params: RecipeSearchParams): Observable<Recipe[]> {
    return this._http.get<Recipe[]>(`${RECIPES_URL}/search`, {
      params: toQueryParams(params),
    });
  }
}

/**
 * Leaves out the unset params so the query string only holds flat values.
 * An empty list is kept as an empty value: it still filters, and matches nothing.
 */
function toQueryParams(params: RecipeSearchParams) {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value != null)
      .map(([key, value]) => [
        key,
        Array.isArray(value) && value.length === 0 ? '' : value,
      ]),
  );
}
