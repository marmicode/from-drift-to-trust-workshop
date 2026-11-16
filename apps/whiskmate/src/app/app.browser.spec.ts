import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { describe, it } from 'vitest';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from '@whiskmate/recipe/infra';
import { recipeMother } from '@whiskmate/shared-recipe/testing';
import { App } from './app';

const shakshuka = recipeMother.withBasicInfo('Shakshuka').build();

const cheesecake = recipeMother
  .withBasicInfo({ name: 'Lemon and Ricotta Cheesecake', course: 'dessert' })
  .build();

describe(App, () => {
  it('searches all recipes', async () => {
    const { recipeHeadings } = mountApp();

    await expect.element(recipeHeadings).toHaveLength(2);
    await expect.element(recipeHeadings.nth(0)).toHaveTextContent('Shakshuka');
    await expect
      .element(recipeHeadings.nth(1))
      .toHaveTextContent('Lemon and Ricotta Cheesecake');
  });
});

function mountApp() {
  TestBed.configureTestingModule({
    providers: [provideRecipeRepositoryFake()],
  });
  TestBed.inject(RecipeRepositoryFake).configure({
    recipes: [shakshuka, cheesecake],
  });

  TestBed.createComponent(App);

  return {
    recipeHeadings: page.getByRole('heading'),
  };
}
