import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { describe, it } from 'vitest';
import { RecipeSearch } from './recipe-search.ng';

describe(RecipeSearch.name, () => {
  it.todo('shows the recipes', () => {
    const { recipePreviewHeadings } = mountRecipeSearch();
  });

  it.todo('filters recipes by keywords', () => {
    const { recipePreviewHeadings } = mountRecipeSearch();
  });
});

function mountRecipeSearch() {
  TestBed.createComponent(RecipeSearch);

  return {
    recipePreviewHeadings: page.getByRole('heading', { level: 2 }),
  };
}
