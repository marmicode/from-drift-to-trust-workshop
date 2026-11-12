---
sidebar_label: 302. Runtime Truth with CDP
---

# Runtime Truth with CDP

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 302-runtime-truth-with-cdp
```

Same code as the [301](./301-angular-testing-skill.md) solution, plus a meal plan that survives a reload: `MealPlanner` loads the plan from a `MealRepository`, and a policy engine decides when a recipe can be added. One browser test is marked as an expected failure with `it.fails`.

## 🎯 Goal

Find the same runtime bug twice with an agent: blind, then with eyes on the running browser through the Chrome DevTools Protocol and a tool you wrote. Compare what each run read, guessed, and cost. Finding the bug is the goal: you do not have to fix it.

## 📝 Steps

#### 1. Run the tests.

```sh
pnpm test
```

Change `it.fails` to `it` on `adds the recipe to the meal plan` in `apps/whiskmate/src/app/recipe/feature-search/recipe-search.browser.spec.ts`, then run that spec again:

```sh
pnpm nx test -- recipe-search --browser.headless
```

The test times out on the Shakshuka card:

```text
locator.click: Timeout 300ms exceeded.
...
  - element is not enabled
```

Read the error. It says the "ADD" button is disabled, but not why.

#### 2. Ask the agent, blind.

```text
Suggest a grounded fix for the failing test. Do not fix. Run tests with pnpm nx test -- recipe-search --browser.headless
```

Write down its hypothesis, how many files it opened, how many times it ran the tests, whether it ran throwaway scripts (such as `node -e`), and whether it added a `console.log` to see what happens at runtime.

#### 3. Expose runtime truth.

Chrome DevTools can call tools that the page itself exposes. `apps/whiskmate/src/app/shared/testing/devtools.ts` already answers DevTools' `devtoolstooldiscovery` event, and `apps/whiskmate/src/app/recipe/domain/meal-planner.devtools.ts` already defines two tools: `MealPlanner.getRecipes` and `MealPlanner.explainCatalog`.

Register them in `apps/whiskmate/src/test-setup.ts`:

```ts
import { mealPlannerDevTools } from '@whiskmate/recipe/domain/devtools';
import { registerDevTools } from '@whiskmate/shared/testing';

/* ... */

registerDevTools([mealPlannerDevTools]);
```

Then write your own tool. Fill in the TODO in `apps/whiskmate/src/app/recipe/infra/device-signature.devtools.ts`: a `DeviceSignature.getCurrentHash` tool that returns `DeviceSignature.currentDeviceHash()`. Take `meal-planner.devtools.ts` as a model, then import `deviceSignatureDevTools` from `@whiskmate/recipe/infra/devtools` and register it next to `mealPlannerDevTools`.

:::tip
The tools call `TestBed.inject()`, and they keep working after the run: `teardown: { destroyAfterEach: false }` keeps the last test's injector alive, and `registerDevTools()` listens on `window.parent`, the Vitest page that hosts the test iframe.
:::

#### 4. Try it by hand.

Run the spec in watch mode with `VITEST_DEBUG` set. That is what opens the DevTools port:

```sh
VITEST_DEBUG=1 pnpm nx test -- recipe-search --watch
```

Chromium now listens for DevTools connections on port 9200. Open `apps/whiskmate/vitest.config.mts` and find how `VITEST_DEBUG` turns that on. Add `--browser.headless=false` if you want to see the browser.

In another terminal, start the CLI against the test browser and call your tools:

```sh
pnpm chrome-devtools start -u http://127.0.0.1:9200 --categoryExperimentalThirdParty --no-usage-statistics
pnpm chrome-devtools list_pages
pnpm chrome-devtools list_3p_developer_tools 1
pnpm chrome-devtools execute_3p_developer_tool 1 DeviceSignature.getCurrentHash
```

Is your hash in `BLOCKED_DEVICE_PROFILES`?

:::note
The tools show the last test that ran. A click that timed out can still land in a later test, so the meal plan may hold an extra "Shakshuka".
:::

Stop the watcher: the agent starts its own in the next step.

#### 5. Give the agent eyes.

Install the `chrome-devtools-cli` skill so the agent knows how to drive the CLI:

```sh
npx skills add ChromeDevTools/chrome-devtools-mcp --skill chrome-devtools-cli
```

When prompted, pick your agent and the **project** scope. Check that `.claude/skills/chrome-devtools-cli/SKILL.md` now exists. If the install fails, `pnpm cook solution` ships the skill already installed.

Start a fresh agent session and ask again, this time with the runtime first:

```text
Suggest a grounded fix for the failing test. Do not fix.
## Debugging rules
- Monitor background command: `VITEST_DEBUG=1 pnpm nx test -- <test-file-pattern> -t <test-name-pattern> --no-file-parallelism --watch`
- Retrieve system under test runtime context using chrome devtools:
  - Start chrome-devtools: `pnpm chrome-devtools stop && pnpm chrome-devtools start -u http://127.0.0.1:9200 --categoryExperimentalThirdParty --no-usage-statistics`
  - Call `pnpm chrome-devtools list_3p_developer_tools 1`
  - Execute relevant tools pnpm chrome-devtools execute_3p_developer_tool 1 <toolName> [--params <params>]
- Prefer runtime as a source of truth over static analysis
```

#### 6. Compare.

Compare with step 2: hypothesis, files opened, test runs, tool calls, time. Did it call your `DeviceSignature.getCurrentHash` tool? Try a lower effort or thinking level for this run: the runtime does the thinking.

Then clean up: make sure the agent's watcher is stopped, and stop the CLI daemon.

```sh
pnpm chrome-devtools stop
```

<details>
<summary>The bug</summary>

Two different recipes end up with the same id, so the meal plan thinks Shakshuka is already in it. Did each run find that?

</details>

#### 7. Debrief.

- Did the blind run blame the device profile, the season, or a race? Did its suggested fix target the bug, or the test (for example by emptying the dev meal plan)?
- What would `console.log` have cost here: edit, re-run, read, repeat, then remove? Did the blind run notice that `vitest.config.mts` swallows console output?
- Which tool did the sighted run reach for first?

:::tip
The CLI works with any agent that can run a shell. The solution ships the tools: `pnpm cook solution`.
:::
