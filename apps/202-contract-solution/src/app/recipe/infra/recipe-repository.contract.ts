import { firstValueFrom } from 'rxjs';
import { expect, it } from 'vitest';
import {
  createRecipeSearchParams,
  type RecipeRepositoryDef,
  type RecipeSearchParams,
} from './recipe-repository';

/**
 * Behavior every recipe repository must share,
 * whether it talks to the recipe API or keeps recipes in memory.
 *
 * The catalog is already in place: the fake seeds it,
 * and the real repository reads the recipes on the server.
 */
export function verifyRecipeRepositoryContract(
  createRecipeRepository: CreateRecipeRepository,
) {
  it('returns an empty list when no keywords match', async () => {
    const { recipeRepository } = await createRecipeRepository();

    expect(
      await searchRecipeNames(recipeRepository, { keywords: 'xyz' }),
    ).toEqual([]);
  });

  it('filters by keywords', async () => {
    const { recipeRepository } = await createRecipeRepository();

    expect(
      await searchRecipeNames(recipeRepository, { keywords: 'SHAK' }),
    ).toEqual(['Shakshuka']);
  });
}

type CreateRecipeRepository = () => Promise<{
  recipeRepository: RecipeRepositoryDef;
}>;

/**
 * Compares names only: the fake's recipes differ from the server's in every other detail.
 */
async function searchRecipeNames(
  recipeRepository: RecipeRepositoryDef,
  params: Partial<RecipeSearchParams>,
): Promise<string[]> {
  const recipes = await firstValueFrom(
    recipeRepository.search(createRecipeSearchParams(params)),
  );
  return recipes.map((recipe) => recipe.name);
}
