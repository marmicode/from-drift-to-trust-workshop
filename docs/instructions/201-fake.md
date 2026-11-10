---
sidebar_label: 201. Fake
---

# Fake

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 201-fake
```

The recipes moved to the backend. `RecipeRepository` now calls the recipe API in `apps/server`, so the `RecipeSearch` test cannot rely on a hardcoded catalog anymore.

## 🎯 Goal

Test that the `RecipeSearch` component filters the recipes by keywords.
Replace the real `RecipeRepository` with an in-memory `RecipeRepositoryFake`.

## 📝 Steps

#### 1. Implement `RecipeRepositoryFake`.

Edit `recipe/infra/recipe-repository.fake.ts`. It already exists.

- Make `RecipeRepositoryFake` implement `RecipeRepositoryDef`, the same interface as `RecipeRepository`
- Implement `search` like the recipe API does: keep the recipes whose name contains the keywords, ignoring case. Empty keywords match every recipe. Each other criterion only applies when it is set: at most `maxIngredientCount` ingredients, at most `maxStepCount` steps, and a course in `courses`.
- Add `configure({ recipes }: { recipes: Recipe[] })` so tests can set the catalog

#### 2. Create a provider utility for the fake.

Add it to `recipe/infra/recipe-repository.fake.ts`, next to the fake:

```ts
export function provideRecipeRepositoryFake(): EnvironmentProviders {
  return makeEnvironmentProviders([RecipeRepositoryFake, { provide: RecipeRepository, useExisting: RecipeRepositoryFake }]);
}
```

Export `provideRecipeRepositoryFake` from `recipe/infra/index.ts`, next to `RecipeRepositoryFake`.

#### 3. Filter recipes with the fake.

`recipe/feature-search/recipe-search.browser.spec.ts` already mounts `RecipeSearch`. `mountRecipeSearch()` creates the component and returns `getRecipePreviewHeadings()`. That glove returns the locator for the recipe preview headings.

Provide the fake with `provideRecipeRepositoryFake()`, before calling `mountRecipeSearch()`:

```ts
TestBed.configureTestingModule({
  providers: [provideRecipeRepositoryFake()],
});
```

Configure the fake by injecting it:

```ts
TestBed.inject(RecipeRepositoryFake).configure(...);
```

Add a few recipes with `recipeMother`: `recipeMother.withBasicInfo('Burger').build()`.

```ts
import { provideRecipeRepositoryFake, RecipeRepositoryFake } from '@whiskmate/recipe/infra';
import { recipeMother } from '@whiskmate/shared-recipe/testing';
// ...and add `expect` to the `vitest` import.
```

Implement `it.todo('filters recipes by keywords')`: turn it into an `async` `it`, type a keyword in the "Keywords" field, and check those headings.

```ts
await page.getByLabelText('Keywords').fill('burger');

await expect.element(getRecipePreviewHeadings()).toHaveTextContent('Burger');
```

`expect.element` retries until a single heading matches. To check several headings at once, assert on the list: `await expect.poll(() => getRecipePreviewHeadings().elements().map((el) => el.textContent?.trim())).toEqual([...])`.

```sh
pnpm test
```

:::tip
The fake behaves like the real repository as long as someone checks it does. That is the point of [202. Contract](./202-contract.md).
:::
