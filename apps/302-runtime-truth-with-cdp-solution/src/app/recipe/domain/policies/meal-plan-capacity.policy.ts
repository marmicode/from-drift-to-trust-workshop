import type { Recipe } from '@whiskmate/shared-recipe/model';

/**
 * Two main courses a day, for a week.
 */
const MAX_MAIN_COURSES = 14;

/**
 * Keeps the weekly meal plan within a reasonable number of main courses.
 */
export class MealPlanCapacityPolicy {
  readonly name = 'meal-plan-capacity';

  allows(recipe: Recipe, plannedRecipes: readonly Recipe[]): boolean {
    if (recipe.course !== 'main') {
      return true;
    }

    const plannedMainCourses = plannedRecipes.filter(
      (planned) => planned.course === 'main',
    );
    return plannedMainCourses.length < MAX_MAIN_COURSES;
  }
}
