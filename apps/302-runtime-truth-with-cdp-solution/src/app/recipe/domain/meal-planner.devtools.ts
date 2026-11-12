import { TestBed } from '@angular/core/testing';
import { lastValueFrom } from 'rxjs';
import {
  createRecipeSearchParams,
  RecipeRepositoryFake,
} from '@whiskmate/recipe/infra';
import { defineDevTool, defineDevToolGroup } from '@whiskmate/shared/testing';
import { MealPlanner } from './meal-planner';

export const mealPlannerDevTools = defineDevToolGroup({
  name: 'MealPlanner',
  description: 'Tools for inspecting the MealPlanner of the last test',
  tools: [
    defineDevTool({
      name: 'MealPlanner.getRecipes',
      description: 'Recipes currently in the meal plan',
      execute: async () =>
        JSON.stringify(
          TestBed.inject(MealPlanner)
            .recipes()
            .map(({ id, name, course }) => ({ id, name, course })),
        ),
    }),
    defineDevTool({
      name: 'MealPlanner.explainCatalog',
      description:
        'For each recipe of the catalog, whether it can be added, which policies block it, and which planned recipes it conflicts with',
      execute: async () => {
        const mealPlanner = TestBed.inject(MealPlanner);
        const plannedRecipes = mealPlanner.recipes();
        const recipes = await lastValueFrom(
          TestBed.inject(RecipeRepositoryFake).search(
            createRecipeSearchParams(),
          ),
        );

        return JSON.stringify(
          recipes.map((recipe) => ({
            id: recipe.id,
            name: recipe.name,
            ...mealPlanner.evaluateCanAddPolicyForRecipe(recipe),
            conflictsWith: plannedRecipes
              .filter(
                (planned) =>
                  planned.id === recipe.id || planned.name === recipe.name,
              )
              .map(({ id, name }) => ({ id, name })),
          })),
        );
      },
    }),
  ],
});
