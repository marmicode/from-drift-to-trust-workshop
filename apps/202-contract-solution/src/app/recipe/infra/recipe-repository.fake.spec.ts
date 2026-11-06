import { TestBed } from '@angular/core/testing';
import { describe } from 'vitest';
import { recipeMother } from '@whiskmate/shared-recipe/testing';
import { verifyRecipeRepositoryContract } from './recipe-repository.contract';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from './recipe-repository.fake';

describe(RecipeRepositoryFake.name, () => {
  verifyRecipeRepositoryContract(createRecipeRepositoryFake);
});

/**
 * Seeds a few recipes that the server also has.
 */
async function createRecipeRepositoryFake() {
  TestBed.configureTestingModule({
    providers: [provideRecipeRepositoryFake()],
  });
  const recipeRepository = TestBed.inject(RecipeRepositoryFake);
  recipeRepository.configure({
    recipes: [
      recipeMother.withBasicInfo('Shakshuka').build(),
      recipeMother
        .withBasicInfo({ name: 'Hummus with Ful', course: 'starter' })
        .build(),
    ],
  });
  return { recipeRepository };
}
