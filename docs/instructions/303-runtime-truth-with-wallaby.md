---
sidebar_label: 303. Runtime Truth with Wallaby
---

# Runtime Truth with Wallaby

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 303-runtime-truth-with-wallaby
```

Request a free Wallaby license before you or the agent use the CLI. Run this from the repository root and follow the prompts — you need a **valid email address**:

```sh
pnpm wallaby access
```

## 🎯 Goal

Same code and bug as [302](./302-runtime-truth-with-cdp.md).

Find the same bug with an agent that reads runtime values from the tests themselves, through Wallaby. Compare what each run read, guessed, and cost.

:::warning
Finding the bug is the goal. You do not have to fix it.
:::

## 📝 Steps

#### 1. Make sure the tests fail

Change `it.fails` to `it` on `adds the recipe to the meal plan` in `apps/whiskmate/src/app/recipe/feature-search/recipe-search.browser.spec.ts`, then run the tests and make sure it fails:

```sh
pnpm test-single-run
```

#### 2. Install the skill.

Install the `wallaby-cli` skill so the agent knows how to drive Wallaby:

```sh
npx skills add wallabyjs/skills --skill wallaby-cli
```

:::info
The Wallaby CLI is already a devDependency (`@wallabyjs/cli`), so the skill runs it with `pnpm exec wallaby-skill`. Nothing else to install. Run it from the repository root, so that every command talks to the same Wallaby instance.
:::

#### 3. Ask the agent.

Start a fresh agent session:

```text
Suggest a grounded fix for the failing test. Do not fix.
Use Wallaby to inspect runtime values instead of adding logs.
```

#### 4. Compare.

Compare with exercise 302: hypothesis, files opened, test runs, tool calls, time. Did it call your `DeviceSignature.getCurrentHash` tool? Try a lower effort or thinking level for this run: the runtime "does the thinking".

<details>
<summary>The bug</summary>

Two different recipes end up with the same id, so the meal plan thinks Shakshuka is already in it. Did each run find that?

</details>
