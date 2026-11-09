import { TestBed } from '@angular/core/testing';
import { lastValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { LocalStorage } from './local-storage';
import { provideLocalStorageFake } from './local-storage.fake';
import { MealRepository } from './meal-repository';
import { verifyMealRepositoryContract } from './meal-repository.contract';

describe(MealRepository.name, () => {
  verifyMealRepositoryContract(createMealRepository);

  it('ignores an invalid storage value', async () => {
    const { getMealRepository, setStorageValue } = setUpMealRepository();

    setStorageValue('invalid-value');

    const mealRepository = getMealRepository();

    expect(await lastValueFrom(mealRepository.getMeals())).toEqual([]);
  });
});

function createMealRepository() {
  const { getMealRepository, ...utils } = setUpMealRepository();

  return { mealRepository: getMealRepository(), ...utils };
}

function setUpMealRepository() {
  TestBed.configureTestingModule({
    providers: [provideLocalStorageFake()],
  });

  return {
    getMealRepository: () => TestBed.inject(MealRepository),
    setStorageValue: (value: string) =>
      TestBed.inject(LocalStorage).setItem('meals', value),
  };
}
