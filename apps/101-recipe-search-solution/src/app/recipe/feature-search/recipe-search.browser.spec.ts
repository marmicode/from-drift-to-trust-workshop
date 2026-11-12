import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
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
});

function mountRecipeSearch() {
  TestBed.createComponent(RecipeSearch);

  return {
    recipePreviewHeadings: page.getByRole('heading', { level: 2 }),
  };
}
