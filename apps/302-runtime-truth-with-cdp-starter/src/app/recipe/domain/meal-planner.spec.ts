import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  MealRepositoryFake,
  provideMealRepositoryFake,
} from '@whiskmate/recipe/infra';
import { recipeMother } from '@whiskmate/shared-recipe/testing';
import { MealPlanner } from './meal-planner';

describe(MealPlanner, () => {
  it('adds recipes', async () => {
    const { mealPlanner } = createMealPlanner();

    await mealPlanner.addRecipe(cauliflowerCake);
    await mealPlanner.addRecipe(hummus);

    expect(mealPlanner.recipes()).toEqual([
      expect.objectContaining({ name: 'Cauliflower Cake' }),
      expect.objectContaining({ name: 'Hummus with Ful' }),
    ]);
  });

  it('does not allow recipe duplicates', async () => {
    const { mealPlanner } = await createMealPlannerWithCauliflowerCake();

    expect(mealPlanner.canAddRecipe(cauliflowerCake)).toBe(false);
  });

  it('throws when the recipe is already planned', async () => {
    const { mealPlanner } = await createMealPlannerWithCauliflowerCake();

    await expect(mealPlanner.addRecipe(cauliflowerCake)).rejects.toThrow(
      'cannot be added to the meal plan',
    );
  });

  it('persists recipes in the meal repository', async () => {
    const { mealPlanner, mealRepositoryFake } = createMealPlanner();

    await mealPlanner.addRecipe(cauliflowerCake);

    expect(mealRepositoryFake.getMealsSync()).toContainEqual(
      expect.objectContaining({ name: 'Cauliflower Cake' }),
    );
  });

  it('loads the planned recipes from the meal repository', async () => {
    const { getMealPlanner, mealRepositoryFake } = setUpMealPlanner();

    mealRepositoryFake.addMeal(cauliflowerCake);

    const mealPlanner = getMealPlanner();
    await expect
      .poll(() => mealPlanner.recipes())
      .toContainEqual(expect.objectContaining({ name: 'Cauliflower Cake' }));
  });

  it('adds a recipe while the meal plan is loading', async () => {
    const { mealPlanner } = createMealPlanner();

    await mealPlanner.addRecipe(shakshuka);

    expect(mealPlanner.recipes()).toContainEqual(
      expect.objectContaining({ name: 'Shakshuka' }),
    );
  });

  describe('canAddRecipe', () => {
    it('allows new recipes', async () => {
      const { mealPlanner } = await createMealPlannerWithCauliflowerCake();

      expect(mealPlanner.canAddRecipe(hummus)).toBe(true);
    });

    it('refuses planned recipes', async () => {
      const { mealPlanner } = await createMealPlannerWithCauliflowerCake();

      await mealPlanner.addRecipe(hummus);

      expect(mealPlanner.canAddRecipe(hummus)).toBe(false);
    });
  });
});

const cauliflowerCake = recipeMother.withBasicInfo('Cauliflower Cake').build();

const shakshuka = recipeMother.withBasicInfo('Shakshuka').build();

const hummus = recipeMother
  .withBasicInfo({ name: 'Hummus with Ful', course: 'starter' })
  .build();

async function createMealPlannerWithCauliflowerCake() {
  const { mealPlanner, ...utils } = createMealPlanner();

  await mealPlanner.addRecipe(cauliflowerCake);

  return { mealPlanner, ...utils };
}

function createMealPlanner() {
  const { getMealPlanner, ...utils } = setUpMealPlanner();

  return { mealPlanner: getMealPlanner(), ...utils };
}

function setUpMealPlanner() {
  TestBed.configureTestingModule({
    providers: [provideMealRepositoryFake()],
  });

  return {
    getMealPlanner: () => TestBed.inject(MealPlanner),
    mealRepositoryFake: TestBed.inject(MealRepositoryFake),
  };
}
