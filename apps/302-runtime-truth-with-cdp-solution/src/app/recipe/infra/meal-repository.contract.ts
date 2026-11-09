import { lastValueFrom } from 'rxjs';
import { expect, it } from 'vitest';
import { recipeMother } from '@whiskmate/shared-recipe/testing';
import type { MealRepositoryDef } from './meal-repository';

/**
 * Behavior every meal repository must share,
 * whether it persists meals in the browser or keeps them in memory.
 */
export function verifyMealRepositoryContract(
  createMealRepository: CreateMealRepository,
) {
  it('starts empty', async () => {
    const { mealRepository } = createMealRepository();

    expect(await lastValueFrom(mealRepository.getMeals())).toEqual([]);
  });

  it('adds meals', async () => {
    const { mealRepository } = createMealRepository();

    await lastValueFrom(mealRepository.addMeal(cauliflowerCake));
    await lastValueFrom(mealRepository.addMeal(hummus));

    expect(await lastValueFrom(mealRepository.getMeals())).toEqual([
      expect.objectContaining({ name: 'Cauliflower Cake' }),
      expect.objectContaining({ name: 'Hummus with Ful' }),
    ]);
  });
}

type CreateMealRepository = () => { mealRepository: MealRepositoryDef };

const cauliflowerCake = recipeMother.withBasicInfo('Cauliflower Cake').build();

const hummus = recipeMother
  .withBasicInfo({ name: 'Hummus with Ful', course: 'starter' })
  .build();
