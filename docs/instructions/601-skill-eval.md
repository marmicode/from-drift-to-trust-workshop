---
sidebar_label: 601. Skill Eval
---

# Skill Eval

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 601-skill-eval
```

`evals/angular-testing` holds a [promptfoo](https://www.promptfoo.dev) suite. It runs Claude Code (Haiku) on a small Angular project in `evals/angular-testing/fixture`, once with the `angular-testing` skill and once without (the baseline), then grades both answers. One case is written: `tests/meal-planner.ts`.

## 🎯 Goal

Find out what the `angular-testing` skill changes in the tests the agent writes, then edit the skill and see whether the eval catches the regression.

## 📝 Steps

#### 1. Install the skill and set the key.

```sh
npx skills add marmicode/skills # select angular-testing and Claude Code
```

```sh
export ANTHROPIC_API_KEY=... # the shared key
```

:::warning
The whole room shares this key. A full run costs a few cents; don't loop it.
:::

#### 2. Read the suite.

Open `evals/angular-testing/promptfooconfig.ts`, then `tests/meal-planner.ts`.

- Two providers run the same prompt: `with-skill` and `baseline`.
- The agent only has read-only tools. It replies with the spec instead of writing it, so its answer can be cached and graded as text.
- A `transform` keeps the headings and code blocks of the answer, so the agent's notes can't trip an assertion.
- Haiku grades every `llm-rubric` assertion.
- `regex` and `not-regex` assertions are deterministic and free. `llm-rubric` checks what a regex can't see.

#### 3. Run it.

```sh
pnpm eval
```

```sh
pnpm eval:view
```

Compare the two columns. Which assertions fail on the baseline only?

#### 4. Add two cases.

Create one file per case in `evals/angular-testing/tests/`, then add both to `tests` in `promptfooconfig.ts`.

**RecipeSearch**: `Write tests for the RecipeSearch component.`

- The spec is a `*.browser.spec.ts` file.
- It queries with `page.getBy...` and asserts with `expect.element(...)`.
- It never calls `detectChanges()`, reads `componentInstance` or `nativeElement`, or uses `querySelector`.
- `RecipeRepository` is an in-memory fake, and the spec asserts the recipe names in headings and the "No recipes found" copy.

**KeywordSearch**: `Write tests for KeywordSearch. The debounce is the behavior under test: cover both before and after the delay.`

- It uses `vi.useFakeTimers()`, `advanceTimersByTimeAsync()` and `outputBinding()`.
- It never uses `fakeAsync`, `tick()` or the synchronous `vi.advanceTimersByTime()`.
- One test stops just before 300ms and expects nothing yet. Another goes past 300ms and expects the keywords the user typed.

:::tip
Write the deterministic checks first. Keep `llm-rubric` for behavior, and phrase it as facts that pass or fail.
:::

#### 5. Run it again.

```sh
pnpm eval
```

The MealPlanner case comes from the cache: same prompt, same files, so no agent runs again.

Read every failure before you blame the skill. Is the agent wrong, or is the assertion? For example, `\boutputBinding\(` misses `outputBinding<string>(`.

#### 6. Break the skill.

A teammate narrows the skill's scope. Replace the `description` in `.claude/skills/angular-testing/SKILL.md`:

```yaml
description: Reviews Angular tests against the Pragmatic Angular Testing approach. Use when the user asks for a test review.
```

```sh
pnpm eval
```

The baseline comes from the cache, and the `with-skill` column runs again. Which cases regress?

One run is one sample. Run the `with-skill` cases a few more times before you call it:

```sh
pnpm eval --filter-providers with-skill --repeat 3
```

Undo the edit.

#### 7. Debrief.

- What does the skill buy you, case by case?
- Which failures came from the agent, and which from your assertions?
- Which checks would you trust to gate a skill change in CI?
- How many samples before a red cell means a regression?
- What did the runs cost? The token totals are at the end of each run.

:::tip
The solution ships all three cases: `pnpm cook solution`.
:::
