import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { MealPlanner } from '@whiskmate/recipe/domain';
import { RecipeSearch } from './recipe-search.ng';

describe(RecipeSearch.name, () => {
  it('shows the recipes', async () => {
    const { recipePreviewHeadings } = mountRecipeSearch();

    await expect
      .element(recipePreviewHeadings.first())
      .toHaveTextContent('Shakshuka');
  });

  it('filters recipes by keywords', async () => {
    const { recipePreviewHeadings } = mountRecipeSearch();

    await page.getByLabelText('Keywords').fill('cheese');

    await expect
      .element(recipePreviewHeadings)
      .toHaveTextContent('Lemon and Ricotta Cheesecake');
  });

  it('adds the recipe to the meal plan', async () => {
    const { addButtons, getMealPlanRecipeNames } = mountRecipeSearch();

    await addButtons.first().click();

    await expect.poll(getMealPlanRecipeNames).toEqual(['Shakshuka']);
  });

  it('disables the add button once the recipe is in the meal plan', async () => {
    const { addButtons } = mountRecipeSearch();

    await addButtons.first().click();

    await expect.element(addButtons.first()).toBeDisabled();
  });
});

function mountRecipeSearch() {
  TestBed.createComponent(RecipeSearch);

  return {
    addButtons: page.getByRole('button', { name: 'ADD' }),
    getMealPlanRecipeNames() {
      return TestBed.inject(MealPlanner)
        .recipes()
        .map((recipe) => recipe.name);
    },
    recipePreviewHeadings: page.getByRole('heading', { level: 2 }),
  };
}
