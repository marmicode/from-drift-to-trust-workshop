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
    mountRecipeSearch();

    await expect
      .poll(recipeNames)
      .toEqual([
        'Hummus with Ful',
        'Shakshuka',
        'Lemon and Ricotta Cheesecake',
      ]);
  });

  it('renders the recipes returned by the repository', async () => {
    mountRecipeSearch({ recipes: [shakshuka, cheesecake] });

    await expect
      .poll(recipeNames)
      .toEqual(['Shakshuka', 'Lemon and Ricotta Cheesecake']);
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
    mountRecipeSearch();

    await page.getByLabelText('Keywords').fill('shak');

    await expect.poll(recipeNames).toEqual(['Shakshuka']);
  });

  it('searches by max ingredients', async () => {
    mountRecipeSearch();

    await page.getByLabelText('Max Ingredients').fill('5');

    await expect.poll(recipeNames).toEqual(['Hummus with Ful', 'Shakshuka']);
  });

  it('searches by max steps', async () => {
    mountRecipeSearch();

    await page.getByLabelText('Max Steps').fill('5');

    await expect
      .poll(recipeNames)
      .toEqual(['Hummus with Ful', 'Lemon and Ricotta Cheesecake']);
  });

  it('searches by course', async () => {
    mountRecipeSearch();

    await page.getByRole('button', { name: 'dessert' }).click();

    await expect.poll(recipeNames).toEqual(['Lemon and Ricotta Cheesecake']);
  });

  it('searches by multiple courses', async () => {
    mountRecipeSearch();

    await page.getByRole('button', { name: 'starter' }).click();
    await page.getByRole('button', { name: 'dessert' }).click();

    await expect
      .poll(recipeNames)
      .toEqual(['Hummus with Ful', 'Lemon and Ricotta Cheesecake']);
  });

  it('shows all recipes again once every course is unselected', async () => {
    mountRecipeSearch();

    await page.getByRole('button', { name: 'main' }).click();
    await page.getByRole('button', { name: 'main' }).click();

    await expect
      .poll(recipeNames)
      .toEqual([
        'Hummus with Ful',
        'Shakshuka',
        'Lemon and Ricotta Cheesecake',
      ]);
  });

  it('combines keywords and course', async () => {
    mountRecipeSearch();

    await page.getByLabelText('Keywords').fill('a');

    await expect
      .poll(recipeNames)
      .toEqual(['Shakshuka', 'Lemon and Ricotta Cheesecake']);

    await page.getByRole('button', { name: 'dessert' }).click();

    await expect.poll(recipeNames).toEqual(['Lemon and Ricotta Cheesecake']);
  });

  it('combines max ingredients and max steps', async () => {
    mountRecipeSearch();

    await page.getByLabelText('Max Ingredients').fill('5');
    await page.getByLabelText('Max Steps').fill('5');

    await expect.poll(recipeNames).toEqual(['Hummus with Ful']);
  });

  it('searches all recipes again once keywords are cleared', async () => {
    mountRecipeSearch();

    await page.getByLabelText('Keywords').fill('shak');
    await page.getByLabelText('Keywords').fill('');

    await expect
      .poll(recipeNames)
      .toEqual([
        'Hummus with Ful',
        'Shakshuka',
        'Lemon and Ricotta Cheesecake',
      ]);
  });

  it('keeps the keywords once the course is unselected', async () => {
    mountRecipeSearch();

    await page.getByLabelText('Keywords').fill('a');
    await page.getByRole('button', { name: 'dessert' }).click();
    await page.getByRole('button', { name: 'dessert' }).click();

    await expect
      .poll(recipeNames)
      .toEqual(['Shakshuka', 'Lemon and Ricotta Cheesecake']);
  });

  it('shows the first four recipes', async () => {
    mountRecipeSearch({ recipes: createRecipes(5) });

    await expect.poll(recipeNames).toEqual(FIRST_FOUR_RECIPE_NAMES);
  });

  it('shows the next page', async () => {
    mountRecipeSearch({ recipes: createRecipes(5) });

    await page.getByRole('button', { name: 'Next' }).click();

    await expect.poll(recipeNames).toEqual(['Recipe 5']);
    await expect.element(page.getByText('Page 2')).toBeVisible();
  });

  it('goes back to the previous page', async () => {
    mountRecipeSearch({ recipes: createRecipes(5) });

    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Previous' }).click();

    await expect.poll(recipeNames).toEqual(FIRST_FOUR_RECIPE_NAMES);
    await expect
      .element(page.getByRole('button', { name: 'Previous' }))
      .toBeDisabled();
  });

  it('disables next on the last page', async () => {
    mountRecipeSearch({ recipes: createRecipes(5) });

    await page.getByRole('button', { name: 'Next' }).click();

    await expect
      .element(page.getByRole('button', { name: 'Next' }))
      .toBeDisabled();
  });

  it('disables next when every recipe fits on one page', async () => {
    mountRecipeSearch({ recipes: createRecipes(4) });

    await expect
      .element(page.getByRole('button', { name: 'Next' }))
      .toBeDisabled();
  });

  it('goes back to the first page when the filter changes', async () => {
    mountRecipeSearch({ recipes: createRecipes(5) });
    await page.getByRole('button', { name: 'Next' }).click();
    await expect.poll(recipeNames).toEqual(['Recipe 5']);

    await page.getByLabelText('Keywords').fill('Recipe');

    await expect.poll(recipeNames).toEqual(FIRST_FOUR_RECIPE_NAMES);
  });

  it('hides the pager when there are no recipes', async () => {
    mountRecipeSearch({ recipes: [] });

    await expect.element(page.getByText('No recipes found')).toBeVisible();
    await expect
      .element(page.getByRole('button', { name: 'Previous' }))
      .not.toBeInTheDocument();
    await expect
      .element(page.getByRole('button', { name: 'Next' }))
      .not.toBeInTheDocument();
  });
});

const FIRST_FOUR_RECIPE_NAMES = [
  'Recipe 1',
  'Recipe 2',
  'Recipe 3',
  'Recipe 4',
];

function createRecipes(count: number): Recipe[] {
  return Array.from({ length: count }, (_, index) =>
    recipeMother.withBasicInfo(`Recipe ${index + 1}`).build(),
  );
}

function mountRecipeSearch({
  recipes = [hummus, shakshuka, cheesecake],
}: { recipes?: Recipe[] } = {}) {
  TestBed.configureTestingModule({
    providers: [provideRecipeRepositoryFake()],
  });

  TestBed.inject(RecipeRepositoryFake).configure({ recipes });

  TestBed.createComponent(RecipeSearch);
}

function recipeNames() {
  return page
    .getByRole('heading')
    .elements()
    .map((element) => element.textContent?.trim() ?? '');
}

function mealPlanRecipeNames() {
  return TestBed.inject(MealPlanner)
    .recipes()
    .map((recipe) => recipe.name);
}
