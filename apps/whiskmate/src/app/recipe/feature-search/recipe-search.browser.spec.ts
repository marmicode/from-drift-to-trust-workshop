import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { describe, it } from 'vitest';
import { MealPlanner } from '@whiskmate/recipe/domain';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from '@whiskmate/recipe/infra';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import { recipeMother } from '@whiskmate/shared-recipe/testing';
import { RecipeSearch } from './recipe-search.ng';

const hummus = recipeMother
  .withBasicInfo({ name: 'Hummus with Ful', course: 'starter' })
  .build();

const shakshuka = recipeMother
  .withBasicInfo('Shakshuka')
  .withManySteps()
  .build();

const cheesecake = recipeMother
  .withBasicInfo({ name: 'Lemon and Ricotta Cheesecake', course: 'dessert' })
  .withManyIngredients()
  .build();

describe(RecipeSearch, () => {
  it('searches all recipes on load', async () => {
    const { recipeHeadings } = mountRecipeSearch();

    await expect.element(recipeHeadings).toHaveLength(3);
    await expect
      .element(recipeHeadings.nth(0))
      .toHaveTextContent('Hummus with Ful');
    await expect.element(recipeHeadings.nth(1)).toHaveTextContent('Shakshuka');
    await expect
      .element(recipeHeadings.nth(2))
      .toHaveTextContent('Lemon and Ricotta Cheesecake');
  });

  it('renders the recipes returned by the repository', async () => {
    const { recipeHeadings } = mountRecipeSearch({
      recipes: [shakshuka, cheesecake],
    });

    await expect.element(recipeHeadings).toHaveLength(2);
    await expect.element(recipeHeadings.nth(0)).toHaveTextContent('Shakshuka');
    await expect
      .element(recipeHeadings.nth(1))
      .toHaveTextContent('Lemon and Ricotta Cheesecake');
  });

  it('shows "no recipes" when the repository returns nothing', async () => {
    mountRecipeSearch({ recipes: [] });

    await expect
      .element(page.getByText('No recipes found'))
      .toHaveTextContent('No recipes found');
  });

  it('adds the recipe to the meal plan', async () => {
    mountRecipeSearch();

    await page.getByRole('button', { name: 'ADD' }).first().click();

    await expect.poll(mealPlanRecipeNames).toEqual(['Hummus with Ful']);
  });

  it('disables the add button once the recipe is in the meal plan', async () => {
    mountRecipeSearch();

    await page.getByRole('button', { name: 'ADD' }).first().click();

    await expect
      .element(page.getByRole('button', { name: 'ADD' }).first())
      .toBeDisabled();
  });

  it('searches by keywords', async () => {
    const { recipeHeadings } = mountRecipeSearch();

    await page.getByLabelText('Keywords').fill('shak');

    await expect.element(recipeHeadings).toHaveLength(1);
    await expect.element(recipeHeadings.nth(0)).toHaveTextContent('Shakshuka');
  });

  it('searches by max ingredients', async () => {
    const { recipeHeadings } = mountRecipeSearch();

    await page.getByLabelText('Max Ingredients').fill('5');

    await expect.element(recipeHeadings).toHaveLength(2);
    await expect
      .element(recipeHeadings.nth(0))
      .toHaveTextContent('Hummus with Ful');
    await expect.element(recipeHeadings.nth(1)).toHaveTextContent('Shakshuka');
  });

  it('searches by max steps', async () => {
    const { recipeHeadings } = mountRecipeSearch();

    await page.getByLabelText('Max Steps').fill('5');

    await expect.element(recipeHeadings).toHaveLength(2);
    await expect
      .element(recipeHeadings.nth(0))
      .toHaveTextContent('Hummus with Ful');
    await expect
      .element(recipeHeadings.nth(1))
      .toHaveTextContent('Lemon and Ricotta Cheesecake');
  });

  it('searches by course', async () => {
    const { recipeHeadings } = mountRecipeSearch();

    await page.getByRole('button', { name: 'dessert' }).click();

    await expect.element(recipeHeadings).toHaveLength(1);
    await expect
      .element(recipeHeadings.nth(0))
      .toHaveTextContent('Lemon and Ricotta Cheesecake');
  });

  it('searches by multiple courses', async () => {
    const { recipeHeadings } = mountRecipeSearch();

    await page.getByRole('button', { name: 'starter' }).click();
    await page.getByRole('button', { name: 'dessert' }).click();

    await expect.element(recipeHeadings).toHaveLength(2);
    await expect
      .element(recipeHeadings.nth(0))
      .toHaveTextContent('Hummus with Ful');
    await expect
      .element(recipeHeadings.nth(1))
      .toHaveTextContent('Lemon and Ricotta Cheesecake');
  });

  it('shows all recipes again once every course is unselected', async () => {
    const { recipeHeadings } = mountRecipeSearch();

    await page.getByRole('button', { name: 'main' }).click();
    await page.getByRole('button', { name: 'main' }).click();

    await expect.element(recipeHeadings).toHaveLength(3);
    await expect
      .element(recipeHeadings.nth(0))
      .toHaveTextContent('Hummus with Ful');
    await expect.element(recipeHeadings.nth(1)).toHaveTextContent('Shakshuka');
    await expect
      .element(recipeHeadings.nth(2))
      .toHaveTextContent('Lemon and Ricotta Cheesecake');
  });

  it('combines keywords and course', async () => {
    const { recipeHeadings } = mountRecipeSearch();

    await page.getByLabelText('Keywords').fill('a');

    await expect.element(recipeHeadings).toHaveLength(2);
    await expect.element(recipeHeadings.nth(0)).toHaveTextContent('Shakshuka');
    await expect
      .element(recipeHeadings.nth(1))
      .toHaveTextContent('Lemon and Ricotta Cheesecake');

    await page.getByRole('button', { name: 'dessert' }).click();

    await expect.element(recipeHeadings).toHaveLength(1);
    await expect
      .element(recipeHeadings.nth(0))
      .toHaveTextContent('Lemon and Ricotta Cheesecake');
  });

  it('combines max ingredients and max steps', async () => {
    const { recipeHeadings } = mountRecipeSearch();

    await page.getByLabelText('Max Ingredients').fill('5');
    await page.getByLabelText('Max Steps').fill('5');

    await expect.element(recipeHeadings).toHaveLength(1);
    await expect
      .element(recipeHeadings.nth(0))
      .toHaveTextContent('Hummus with Ful');
  });

  it('searches all recipes again once keywords are cleared', async () => {
    const { recipeHeadings } = mountRecipeSearch();

    await page.getByLabelText('Keywords').fill('shak');
    await page.getByLabelText('Keywords').fill('');

    await expect.element(recipeHeadings).toHaveLength(3);
    await expect
      .element(recipeHeadings.nth(0))
      .toHaveTextContent('Hummus with Ful');
    await expect.element(recipeHeadings.nth(1)).toHaveTextContent('Shakshuka');
    await expect
      .element(recipeHeadings.nth(2))
      .toHaveTextContent('Lemon and Ricotta Cheesecake');
  });

  it('keeps the keywords once the course is unselected', async () => {
    const { recipeHeadings } = mountRecipeSearch();

    await page.getByLabelText('Keywords').fill('a');
    await page.getByRole('button', { name: 'dessert' }).click();
    await page.getByRole('button', { name: 'dessert' }).click();

    await expect.element(recipeHeadings).toHaveLength(2);
    await expect.element(recipeHeadings.nth(0)).toHaveTextContent('Shakshuka');
    await expect
      .element(recipeHeadings.nth(1))
      .toHaveTextContent('Lemon and Ricotta Cheesecake');
  });
});

function mountRecipeSearch({
  recipes = [hummus, shakshuka, cheesecake],
}: { recipes?: Recipe[] } = {}) {
  TestBed.configureTestingModule({
    providers: [provideRecipeRepositoryFake()],
  });

  TestBed.inject(RecipeRepositoryFake).configure({ recipes });

  TestBed.createComponent(RecipeSearch);

  return {
    recipeHeadings: page.getByRole('heading'),
  };
}

function mealPlanRecipeNames() {
  return TestBed.inject(MealPlanner)
    .recipes()
    .map((recipe) => recipe.name);
}
