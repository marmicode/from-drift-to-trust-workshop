import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
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

  function mountRecipeSearch() {
    TestBed.createComponent(RecipeSearch);

    return {
      getRecipePreviewHeadings() {
        return page.getByRole('heading', { level: 2 });
      },
    };
  }
});
