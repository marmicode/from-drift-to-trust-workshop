import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { describe, it } from 'vitest';
import { RecipeSearch } from './recipe-search.ng';

describe(RecipeSearch.name, () => {
  it.todo('shows the recipes', () => {
    throw new Error('🚧 Work in progress!');
  });

  it.todo('filters recipes by keywords', () => {
    throw new Error('🚧 Work in progress!');
  });
});

function mountRecipeSearch() {
  TestBed.createComponent(RecipeSearch);

  return {
    getRecipePreviewHeadings() {
      throw new Error('🚧 Work in progress!');
    },
  };
}
