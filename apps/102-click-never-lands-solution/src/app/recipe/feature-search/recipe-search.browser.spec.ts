import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { MealPlanner } from '@whiskmate/recipe/domain';
import { RecipeSearch } from './recipe-search.ng';

describe(RecipeSearch.name, () => {
  it('shows the recipes', async () => {
    const { getRecipePreviewHeadings } = mountRecipeSearch();

    await expect
      .element(getRecipePreviewHeadings().first())
      .toHaveTextContent('Shakshuka');
  });

  it('filters recipes by keywords', async () => {
    const { getRecipePreviewHeadings } = mountRecipeSearch();

    await page.getByLabelText('Keywords').fill('cheese');

    await expect
      .element(getRecipePreviewHeadings())
      .toHaveTextContent('Lemon and Ricotta Cheesecake');
  });

  it('adds the recipe to the meal plan', async () => {
    const { getAddButtons, getMealPlanRecipeNames } = mountRecipeSearch();

    await getAddButtons().first().click();

    await expect.poll(getMealPlanRecipeNames).toEqual(['Shakshuka']);
  });

  it('disables the add button once the recipe is in the meal plan', async () => {
    const { getAddButtons } = mountRecipeSearch();

    await getAddButtons().first().click();

    await expect.element(getAddButtons().first()).toBeDisabled();
  });
});

function mountRecipeSearch() {
  TestBed.createComponent(RecipeSearch);

  return {
    getAddButtons() {
      return page.getByRole('button', { name: 'ADD' });
    },
    getMealPlanRecipeNames() {
      return TestBed.inject(MealPlanner)
        .recipes()
        .map((recipe) => recipe.name);
    },
    getRecipePreviewHeadings() {
      return page.getByRole('heading', { level: 2 });
    },
  };
}
