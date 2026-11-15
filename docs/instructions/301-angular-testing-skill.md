---
sidebar_label: 301. Angular Testing Skill
---

# Angular Testing Skill

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 301-angular-testing-skill
```

## 🎯 Goal

Same starting point as [101](./101-recipe-search.md): the catalog is hardcoded in `RecipeRepository`, and the `RecipeSearch` spec only has two `it.todo`s.

Install the `angular-testing` skill, hand the agent the work you did by hand in 101, 201, and 202, then compare its output with yours.

## 📝 Steps

#### 1. Install the skill.

```sh
npx skills add marmicode/skills --skill angular-testing
```

#### 2. Prompt the agent.

```text
Cover `RecipeSearch` with browser-mode tests: the recipes show up, and typing keywords filters them.
Then move the recipe catalog to the backend: `RecipeRepository` must call the recipe API in `apps/server` (GET http://localhost:3333/api/recipes/search?keywords=shak&maxIngredientCount=5).
The tests must keep passing without hitting the network.
```

#### 3. Let it run.

Kick it off and move on. Come back when it is done.

#### 4. Compare with your own work.

Run the tests. If the agent wrote wide tests, they need the server: start it in another terminal first.

```sh
pnpm test
```

```sh
pnpm start-server
```

```sh
pnpm test-wide
```

Compare the agent's work with your previous work for 101, 201, and 202.

- Did it write a fake, a mock, or something else?
- Is the fake checked against the real repository?
- Does the test read like a spec of `RecipeSearch`?
- Count the files. Count the lines of test versus the lines of source.

Start the app and try search. `pnpm start` also starts the API, so you can stop `pnpm start-server` first.

```sh
pnpm start
```
