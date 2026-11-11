---
sidebar_label: 403. Charted Implementation
---

# Charted Implementation

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 403-charted-implementation
```

The design doc is already at `design-docs/001-recipe-search-pagination.md`. Nothing is implemented yet: `RecipeRepository` does not know about `offset` and `limit`.

## 🎯 Goal

Implement the design doc using the Charted Coding skills, one PR at a time:

- PR#1 teaches `RecipeRepository`, its fake, and their contract about `offset` and `limit`.
- PR#2 adds a `Pager` component with Previous, the page number, and Next.
- PR#3 wires the pager into `RecipeSearch`, pages through the results, and goes back to the first page when the filter changes.
- PR#4 hides the pager when there are no recipes.

**The goal is to try and feel the right step granularity.**

Commit after each step: scaffold, red, then green. A PR is done when every task and test of its section is checked off and its title is marked ✅.

### Skills usage

```text
/charted-scaffold design-docs/001-recipe-search-pagination.md <PR-number>
/charted-red design-docs/001-recipe-search-pagination.md <test-file>
/charted-green design-docs/001-recipe-search-pagination.md <test-file>

# Or if you do not even remember where you are at:
/charted-continue design-docs/001-recipe-search-pagination.md <PR-number>
```

:::tip
`charted-red` and `charted-green` work on one test file at a time. To write or fix all the tests of a PR at once, prompt for it:

```text
Use the charted-red skill on every test file of PR#1 in design-docs/001-recipe-search-pagination.md until all its tests are written.
```

:::

:::tip
You can compose the skills with prompts such as:

```text
Keep on invoking `charted-continue` skill with PR#1 until all tasks and tests are completed.
Do not start working on another PR automatically.
```

:::

### Check the fake against the real repository

The contract runs against the fake with `pnpm test`. Start the server in another terminal, then run it against the real `RecipeRepository`:

```sh
pnpm start-server
```

```sh
pnpm test-wide
```

### Start the app and page through the recipes

```sh
pnpm start
```

`pnpm start` also starts the API. If `pnpm start-server` is still running in the other terminal, stop it first, or run `pnpm start-web` to start the app alone.
