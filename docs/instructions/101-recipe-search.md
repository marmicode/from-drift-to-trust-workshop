---
sidebar_label: 101. Recipe Search
---

# Recipe Search

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 101-recipe-search
```

The recipe catalog is hardcoded in `RecipeRepository`. There is no backend yet.

## 🎯 Goal

Write the first Vitest Browser Mode tests of `RecipeSearch`: the recipes show up, and typing keywords filters them.

## 📝 Steps

#### 1. Run the tests.

```sh
pnpm test
```

`apps/whiskmate/src/app/recipe/feature-search/recipe-search.browser.spec.ts` has two todos. `mountRecipeSearch()` creates the component and returns `getRecipePreviewHeadings()`. That glove is still a stub.

#### 2. Show the recipes.

Point `getRecipePreviewHeadings()` at the recipe name headings:

```ts
return page.getByRole('heading', { level: 2 });
```

Implement `it.todo('shows the recipes')`: turn `it.todo` into `it`, make its callback `async`, mount the search, then check that the first heading reads "Shakshuka". Add `expect` to the `vitest` import.

```ts
const { getRecipePreviewHeadings } = mountRecipeSearch();

await expect
  .element(getRecipePreviewHeadings().first())
  .toHaveTextContent('Shakshuka');
```

The recipes load asynchronously. `expect.element` retries the assertion until it passes or times out, so the test waits for the recipes without a `fixture.detectChanges()` or a `fixture.whenStable()`.

#### 3. Filter by keywords.

Implement `it.todo('filters recipes by keywords')` the same way: mount the search, fill the "Keywords" field, then check the headings.

```ts
await page.getByLabelText('Keywords').fill('cheese');
```

Only "Lemon and Ricotta Cheesecake" should remain.

:::tip
Locators are strict. `expect.element(getRecipePreviewHeadings())` fails as long as more than one heading matches, and retries until a single one is left. No need for `.first()` here.
:::

#### 4. Break the retry.

Replace `expect.element(locator)` with `expect(locator.element())` in one of the tests and run it again. Read the error, then put the retry back.
