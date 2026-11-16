import { firstValueFrom } from 'rxjs';
import { expect, it } from 'vitest';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import { recipeMother } from '@whiskmate/shared-recipe/testing';
import {
  createRecipeSearchParams,
  type RecipeRepositoryDef,
  type RecipeSearchParams,
} from './recipe-repository';

/**
 * Behavior every recipe repository must share,
 * whether it talks to the recipe API or keeps recipes in memory.
 *
 * Each implementation decides how the catalog is seeded:
 * the fake sets it directly while the real one goes through the API.
 */
export function verifyRecipeRepositoryContract(
  createRecipeRepository: CreateRecipeRepository,
) {
  it('finds no recipe when the catalog is empty', async () => {
    const { recipeRepository } = await createRecipeRepository({ recipes: [] });

    expect(await search(recipeRepository)).toEqual([]);
  });

  it('finds every recipe without filters', async () => {
    const { recipeRepository } = await createRecipeRepository({
      recipes: [hummus, shakshuka, cheesecake],
    });

    expect(await search(recipeRepository)).toEqual([
      hummus,
      shakshuka,
      cheesecake,
    ]);
  });

  it('finds recipes whose name contains the keywords ignoring case', async () => {
    const { recipeRepository } = await createRecipeRepository({
      recipes: [hummus, shakshuka, cheesecake],
    });

    expect(await search(recipeRepository, { keywords: 'SHAK' })).toEqual([
      shakshuka,
    ]);
  });

  it('finds recipes with at most the given ingredient count', async () => {
    const { recipeRepository } = await createRecipeRepository({
      recipes: [hummus, shakshuka, cheesecake],
    });

    expect(await search(recipeRepository, { maxIngredientCount: 5 })).toEqual([
      hummus,
      shakshuka,
    ]);
  });

  it('finds recipes with at most the given step count', async () => {
    const { recipeRepository } = await createRecipeRepository({
      recipes: [hummus, shakshuka, cheesecake],
    });

    expect(await search(recipeRepository, { maxStepCount: 5 })).toEqual([
      hummus,
      cheesecake,
    ]);
  });

  it('finds recipes of the given courses', async () => {
    const { recipeRepository } = await createRecipeRepository({
      recipes: [hummus, shakshuka, cheesecake],
    });

    expect(
      await search(recipeRepository, { courses: ['starter', 'dessert'] }),
    ).toEqual([hummus, cheesecake]);
  });

  it('finds no recipe when no course is given', async () => {
    const { recipeRepository } = await createRecipeRepository({
      recipes: [hummus, shakshuka, cheesecake],
    });

    expect(await search(recipeRepository, { courses: [] })).toEqual([]);
  });

  it('combines filters', async () => {
    const { recipeRepository } = await createRecipeRepository({
      recipes: [hummus, shakshuka, cheesecake],
    });

    expect(
      await search(recipeRepository, { keywords: 'a', maxStepCount: 5 }),
    ).toEqual([cheesecake]);
  });

  it.todo('skips the first recipes when an offset is given', () => {
    // arrange the catalog with Hummus with Ful, Shakshuka, and Lemon and Ricotta Cheesecake
    // search with `offset: 1`
    // assert Shakshuka and Lemon and Ricotta Cheesecake are found, in that order
  });

  it.todo('returns no more recipes than the limit', () => {
    // arrange the same catalog
    // search with `limit: 2`
    // assert Hummus with Ful and Shakshuka are found
  });

  it.todo('returns the page at the offset', () => {
    // arrange the same catalog
    // search with `offset: 1` and `limit: 1`
    // assert only Shakshuka is found
  });

  it.todo('filters before paginating', () => {
    // arrange the same catalog
    // search with `keywords: 'a'`, `offset: 1`, and `limit: 1`
    // assert only Lemon and Ricotta Cheesecake is found
  });
}

type CreateRecipeRepository = (params: {
  recipes: Recipe[];
}) =>
  | Promise<{ recipeRepository: RecipeRepositoryDef }>
  | { recipeRepository: RecipeRepositoryDef };

function search(
  recipeRepository: RecipeRepositoryDef,
  params: Partial<RecipeSearchParams> = {},
): Promise<Recipe[]> {
  return firstValueFrom(
    recipeRepository.search(createRecipeSearchParams(params)),
  );
}

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
