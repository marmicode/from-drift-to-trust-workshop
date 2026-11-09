import {
  type EnvironmentProviders,
  makeEnvironmentProviders,
  Service,
} from '@angular/core';
import { concat, Observable, of } from 'rxjs';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import { MealRepository, type MealRepositoryDef } from './meal-repository';
import { provideMealRepositoryInitializer } from './meal-repository.initializer';

/**
 * In-memory meal repository for tests and local development.
 * Dev meals are loaded asynchronously via {@link provideMealRepositoryInitializer}.
 */
@Service({ autoProvided: false })
export class MealRepositoryFake implements MealRepositoryDef {
  private _meals: Recipe[] = [];

  seedMeals(meals: readonly Recipe[]): void {
    this._meals = [...meals];
  }

  addMeal(meal: Recipe): Observable<void> {
    this._meals = [...this._meals, meal];
    return of(undefined);
  }

  getMeals(): Observable<Recipe[]> {
    return concat(of([]), fromStorageRead(this._meals));
  }

  getMealsSync(): Recipe[] {
    return this._meals;
  }
}

/**
 * Emits once the browser is idle, like a storage read would.
 */
function fromStorageRead<T>(value: T): Observable<T> {
  return new Observable((subscriber) => {
    const idleCallbackId = scheduleIdleCallback(() => {
      subscriber.next(value);
      subscriber.complete();
    });

    return () => cancelIdleCallback(idleCallbackId);
  });
}

function scheduleIdleCallback(callback: () => void): number {
  if (globalThis.requestIdleCallback) {
    return globalThis.requestIdleCallback(callback);
  }

  return globalThis.setTimeout(callback, 0);
}

function cancelIdleCallback(id: number): void {
  if (globalThis.cancelIdleCallback) {
    globalThis.cancelIdleCallback(id);
    return;
  }

  globalThis.clearTimeout(id);
}

export function provideMealRepositoryFake(): EnvironmentProviders {
  return makeEnvironmentProviders([
    MealRepositoryFake,
    {
      provide: MealRepository,
      useExisting: MealRepositoryFake,
    },
    provideMealRepositoryInitializer(),
  ]);
}
