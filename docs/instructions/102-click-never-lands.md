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

Each recipe card now has an "ADD" button that adds the recipe to the meal plan. The tests are already written. The two that click "ADD" are marked with `it.fails` because they fail on the broken code.

## 🎯 Goal

Find out why the tests fail, fix the bug, and see what Browser Mode checked that JSDOM would not.

## 📝 Steps

#### 1. Run the tests.

```sh
pnpm test
```

Remove `.fails` from the two `it.fails` tests in `recipe-search.browser.spec.ts`, then run the tests again.

Two tests time out. Read the error. Playwright tells which element intercepts the click.

#### 2. Watch it in a real browser.

```sh
pnpm test --browser.headless=false
```

Look at a recipe card, then try to click "ADD" yourself.

#### 3. Find the culprit.

Open `card.ng.ts` and look at how the card is sized.

#### 4. Fix the bug.

The card is too short for its content, and the overflow clips the button. The card should grow to fit its content.

```sh
pnpm test
```

#### 5. Would JSDOM have caught it?

In `recipe-search.browser.spec.ts`, replace the first `.click()` with `.element().click()` and run the tests on the broken code again.

`element.click()` dispatches the event straight to the button, as JSDOM does. The test passes while the user cannot click. Browser Mode checks that the element is visible, stable, enabled, and actually receives the pointer before clicking.

Put the locator's `.click()` back.
