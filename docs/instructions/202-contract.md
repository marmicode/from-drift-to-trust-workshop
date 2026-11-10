---
sidebar_label: 202. Contract
---

# Contract

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

Do [201. Fake](./201-fake.md) first.

## Setup

```sh
pnpm cook start 202-contract
```

`RecipeRepositoryFake`, its provider utility, and the `RecipeSearch` test are in place.

## 🎯 Goal

Write the search contract once, and run it against both the fake and the real `RecipeRepository`. The fake is only trustworthy if it passes the same tests as the real thing.

The contract is a smoke test: it only reads the catalog that is already in place, and never changes it.

## 📝 Steps

#### 1. Write the contract.

`recipe-repository.contract.ts` lists the cases as `it.todo`:

- returns an empty list when no keywords match
- filters by keywords

Each case calls `createRecipeRepository()` to get a `RecipeRepositoryDef` back.

`recipe-repository.fake.spec.ts` runs the contract against the fake. Its factory already configures the fake with Shakshuka and Hummus with Ful. Leave that catalog as it is.

`recipe-repository.wide.spec.ts` runs the same contract against the real `RecipeRepository`. The server already has those recipes amongst others, and the API is treated as read-only.

:::tip
The fake's recipes only share their names with the server's. Compare names, not whole recipes.
:::

Implement the two cases.

```sh
pnpm test
```

#### 2. Run the contract against the real repository.

Start the server in another terminal, then run the wide tests:

```sh
pnpm start-server
```

```sh
pnpm test-wide
```

:::tip
Wide tests talk to the real backend, so `pnpm test` skips them by default.
:::
