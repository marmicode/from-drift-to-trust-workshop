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

Same code as the [404](./404-charted-autopilot.md) solution, plus:

- the `angular-mermaid` skill in `.claude/skills/angular-mermaid/SKILL.md`. It makes the agent draw small Angular diagrams: components as `[[RecipeSearch]]`, services as `([RecipeRepository])`, inputs on solid arrows as `"[recipe: Recipe]"`, outputs on dotted arrows as `"(filterChange: RecipeFilterCriteria)"`, and colors for what a change adds or modifies.
- a [promptfoo](https://www.promptfoo.dev) suite in `evals/angular-mermaid`, with no test cases yet.

## 🎯 Goal

Find out whether the `angular-mermaid` skill actually changes the diagrams the agent draws, then break the skill and see whether the eval catches it.

## 📝 Steps

#### 1. Set the key.

```sh
export ANTHROPIC_API_KEY=... # the shared key
```

:::warning
The whole room shares this key. A full run costs a few cents; don't loop it.
:::

#### 2. Read the suite.

Open `evals/angular-mermaid/promptfooconfig.ts` and `evals/angular-mermaid/hooks.ts`.

- Two providers run the same prompt with Claude Code (Haiku): `with-skill` and `baseline`.
- Before the run, `hooks.ts` copies the app's sources into two workspaces outside the repository, and the skill into the `with-skill` one only.
- The agent only has read-only tools. It replies with the diagram, so its answer can be cached and graded as text.
- Haiku grades every `llm-rubric` assertion.

#### 3. Write the first case.

Create `evals/angular-mermaid/tests/pagination.ts` and add it to `tests` in `promptfooconfig.ts`.

```ts
import type { TestCase } from 'promptfoo';

export default {
  description: 'draws inputs and outputs between components',
  vars: {
    request: 'Draw a Mermaid diagram of how pagination works in RecipeSearch.',
  },
  assert: [
    // ...
  ],
} satisfies TestCase;
```

Check that:

- the answer has a ` ```mermaid ` block,
- `Pager` is a component: `pager[[Pager]]`,
- `pageNumber` is on a solid arrow, between brackets,
- `nextPage` is on a dotted arrow, between parentheses,
- every arrow label is quoted,
- `Catalog`, `Card` and Material components are left out, and the diagram has 5 nodes at most.

:::tip

- `regex` and `not-regex` assertions are deterministic and free, but they see the whole answer, prose included. A `javascript` assertion can pull the ` ```mermaid ` block out first, then test it.
- Keep `llm-rubric` for what a regex can't see, such as "`RecipePreview` is left out because it plays no part in pagination". Phrase it as facts that pass or fail.

:::

#### 4. Run it.

```sh
pnpm eval
```

```sh
pnpm eval:view
```

Compare the two columns. Which assertions fail on the baseline only?

#### 5. Add two cases.

**A flow, without asking for a diagram**: `Explain how clicking ADD reaches MealPlanner.`

- The skill must load from its `description` alone: the answer still has a diagram.
- `RecipeAddButton` is a component and `MealPlanner` a service.
- The `"[recipe: Recipe]"` arrow to `RecipeAddButton` starts from `RecipeSearch`, whose template binds it, not from `RecipePreview`.

**A change**:

```text
Add a meal plan panel next to the recipe search.
It lists the planned recipes, each with a REMOVE button.
Draw the change before you write any code.
```

- The diagram declares `classDef new`, and a new component uses it: `panel[[MealPlanPanel]]:::new`.
- New arrows are colored with `linkStyle`.
- `MealPlanner` is marked as changed: it needs a way to remove a recipe.
- One sentence says what the colors mean.

#### 6. Run it again.

```sh
pnpm eval
```

The pagination case comes from the cache: same prompt, same files, so no agent runs again.

Read every failure before you blame the skill. Is the agent wrong, or is the assertion?

#### 7. Break the skill.

A teammate trims the skill's scope. Replace the `description` in `.claude/skills/angular-mermaid/SKILL.md`:

```yaml
description: Draws Mermaid diagrams of Angular code. Use when the user asks for a Mermaid diagram.
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

#### 8. Debrief.

- What does the skill buy you, case by case?
- Which failures came from the agent, and which from your assertions?
- Which checks would you trust to gate a skill change in CI?
- How many samples before a red cell means a regression?
- What did the runs cost? The token totals are at the end of each run.

:::tip
The solution ships all three cases and the Mermaid assertions in `evals/angular-mermaid/assertions.ts`: `pnpm cook solution`.
:::
