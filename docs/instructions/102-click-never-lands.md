---
sidebar_label: 102. The Click That Never Lands
---

# The Click That Never Lands

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 102-click-never-lands
```

## 🎯 Goal

Each recipe card now has an "ADD" button that adds the recipe to the meal plan. The tests are already written. The two that click "ADD" are marked with `it.fails` because they fail on the broken code.

Find out why the tests fail, and fix the bug.

## 📝 Steps

#### 1. Run the tests.

```sh
pnpm test
```

Everything passes: `it.fails` counts an expected failure as a pass.

Remove `.fails` from the two `it.fails` tests in `apps/whiskmate/src/app/recipe/feature-search/recipe-search.browser.spec.ts`, then run the tests again.

Two tests time out. Read the error. Playwright tells which element intercepts the click.

#### 2. Find the culprit.

#### 3. Fix the bug.

Fix the bug without touching the tests.
