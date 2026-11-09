import { inject, provideAppInitializer } from '@angular/core';
import { DEV_MEAL_PLAN } from './dev-meal-plan';
import { mapMealPlanToRecipes } from './meal-plan.mapper';
import { MealRepositoryFake } from './meal-repository.fake';

/**
 * Loads the dev meal plan into the fake repository.
 */
export function provideMealRepositoryInitializer() {
  return provideAppInitializer(() => {
    const mealRepository = inject(MealRepositoryFake);
    mealRepository.seedMeals(mapMealPlanToRecipes(DEV_MEAL_PLAN));
  });
}
