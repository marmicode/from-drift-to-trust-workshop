import { inject, Service } from '@angular/core';
import { defer, type Observable, of } from 'rxjs';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import { LocalStorage } from './local-storage';

export interface MealRepositoryDef {
  addMeal(recipe: Recipe): Observable<void>;

  getMeals(): Observable<Recipe[]>;
}

const MEALS_STORAGE_KEY = 'meals';

/**
 * Persists the meal plan in the browser's local storage.
 */
@Service()
export class MealRepository implements MealRepositoryDef {
  private _localStorage = inject(LocalStorage);

  addMeal(meal: Recipe): Observable<void> {
    return defer(() => {
      this._saveMeals([...this._loadMeals(), meal]);
      return of(undefined);
    });
  }

  getMeals(): Observable<Recipe[]> {
    return defer(() => of(this._loadMeals()));
  }

  private _loadMeals(): Recipe[] {
    const rawValue = this._localStorage.getItem(MEALS_STORAGE_KEY);

    if (rawValue == null) {
      return [];
    }

    try {
      return JSON.parse(rawValue);
    } catch {
      return [];
    }
  }

  private _saveMeals(meals: Recipe[]): void {
    this._localStorage.setItem(MEALS_STORAGE_KEY, JSON.stringify(meals));
  }
}
