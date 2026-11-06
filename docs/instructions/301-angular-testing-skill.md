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

Same starting point as [101](./101-recipe-search.md): the catalog is hardcoded in `RecipeRepository`, and `RecipeSearch` has no test.

## 🎯 Goal

Install the `angular-testing` skill, hand the agent the work you did by hand in 101, 201, and 202, then compare its output with yours.

## 📝 Steps

#### 1. Install the skill.

```sh
npx skills add marmicode/skills # and select angular-testing
```

#### 2. Prompt the agent.

```text
Cover `RecipeSearch` with browser-mode tests: the recipes show up, and typing keywords filters them.
Then move the recipe catalog to the backend: `RecipeRepository` must call the recipe API in `apps/server` (POST http://localhost:3333/api/recipes/search).
The tests must keep passing without hitting the network.
```

#### 3. Let it run.

Kick it off and move on. Come back when it is done.

#### 4. Compare with your own work.

Read the diff and compare it with what you wrote in 201 and 202.

- Did it write a fake, a mock, or something else?
- Is the fake checked against the real repository?
- Does the test read like a spec of `RecipeSearch`?
- Count the files. Count the lines of test versus the lines of source.

Start the app and try search.

```sh
pnpm start
```
