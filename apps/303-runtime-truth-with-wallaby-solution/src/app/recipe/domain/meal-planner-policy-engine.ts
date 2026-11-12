import { inject, InjectionToken, Service } from '@angular/core';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import { DuplicateByIdPolicy } from './policies/duplicate-by-id.policy';
import { DuplicateByNamePolicy } from './policies/duplicate-by-name.policy';
import { HouseholdAllergenPolicy } from './policies/household-allergen.policy';
import { MealPlanCapacityPolicy } from './policies/meal-plan-capacity.policy';
import { RestrictedDeviceProfilePolicy } from './policies/restricted-device-profile.policy';
import { SeasonalAvailabilityPolicy } from './policies/seasonal-availability.policy';
import { WeeklyCalorieBudgetPolicy } from './policies/weekly-calorie-budget.policy';

export interface MealPlannerPolicy {
  readonly name: string;

  allows(recipe: Recipe, plannedRecipes: readonly Recipe[]): boolean;
}

/**
 * Policies a recipe must satisfy to join the meal plan, in evaluation order.
 */
export const MEAL_PLANNER_POLICIES = new InjectionToken<
  readonly MealPlannerPolicy[]
>('MEAL_PLANNER_POLICIES', {
  factory: () => [
    inject(RestrictedDeviceProfilePolicy),
    inject(SeasonalAvailabilityPolicy),
    inject(MealPlanCapacityPolicy),
    inject(HouseholdAllergenPolicy),
    inject(WeeklyCalorieBudgetPolicy),
    inject(DuplicateByNamePolicy),
    inject(DuplicateByIdPolicy),
  ],
});

/**
 * Decides whether a recipe can join the meal plan.
 */
@Service()
export class MealPlannerPolicyEngine {
  private readonly _policies = inject(MEAL_PLANNER_POLICIES);

  evaluate(
    recipe: Recipe,
    plannedRecipes: readonly Recipe[],
  ): MealPlannerPolicyResult {
    const blockedBy = this._policies
      .filter((policy) => !policy.allows(recipe, plannedRecipes))
      .map(({ name }) => name);

    return {
      allowed: blockedBy.length === 0,
      blockedBy,
    };
  }
}

export interface MealPlannerPolicyResult {
  allowed: boolean;
  blockedBy: string[];
}
