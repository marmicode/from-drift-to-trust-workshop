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

Edit `recipe-repository.fake.ts`. It already exists.

- Make `RecipeRepositoryFake` implement `RecipeRepositoryDef`, the same interface as `RecipeRepository`
- Implement `search`
- Add `configure({ recipes }: { recipes: Recipe[] })` so tests can set the catalog

#### 2. Create a provider utility for the fake.

```ts
export function provideRecipeRepositoryFake(): EnvironmentProviders {
  return makeEnvironmentProviders([RecipeRepositoryFake, { provide: RecipeRepository, useExisting: RecipeRepositoryFake }]);
}
```

Export `provideRecipeRepositoryFake` from `index.ts`, next to `RecipeRepositoryFake`.

#### 3. Filter recipes with the fake.

`recipe-search.browser.spec.ts` already mounts `RecipeSearch`. `mountRecipeSearch()` creates the component and returns `getRecipePreviewHeadings()`. That glove returns the locator for the recipe preview headings.

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

Implement `it.todo('filters recipes by keywords')`: type a keyword and check those headings.

```sh
pnpm test
```

:::tip
The fake behaves like the real repository as long as someone checks it does. That is the point of [202. Contract](./202-contract.md).
:::
