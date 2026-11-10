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

Same code as the [302](./302-runtime-truth-with-cdp.md) starter: the same runtime bug, the same skipped browser test.

## 🎯 Goal

Debug the same runtime bug with an agent that reads runtime values from the tests themselves, through Wallaby, then compare with the blind and CDP runs from 302.

## 📝 Steps

#### 1. Run the tests.

```sh
pnpm test
```

Remove `.skip` from `adds the recipe to the meal plan` in `recipe-search.browser.spec.ts`. The test times out on the Shakshuka card.

#### 2. Install the skill.

Install the `wallaby-cli` skill so the agent knows how to drive Wallaby:

```sh
npx skills add wallabyjs/skills # and select wallaby-cli
```

#### 3. Ask the agent.

Start a fresh agent session:

```text
Suggest a grounded fix for the failing test. Do not fix.
Use Wallaby to inspect runtime values instead of adding logs.
```

Write down its hypothesis, how many files it opened, how many test runs and `inspect` calls it made, and whether it added a `console.log`.

#### 4. Compare.

Compare with both 302 runs: hypothesis, files opened, test runs, tool calls, time. Which values did it inspect, and where?

#### 5. Fix it.

Two different recipes must never share an id.

```sh
pnpm test
```

#### 6. Debrief.

- Wallaby needed no tool of your own, while CDP needed `DeviceProfile.getCurrentHash`. What did each one see that the other could not?
- Did `inspect` get past the console output that `vitest.config.mts` swallows?
- When would you reach for CDP rather than Wallaby, and the other way around?

:::tip
The solution ships the skill: `pnpm cook solution`.
:::
