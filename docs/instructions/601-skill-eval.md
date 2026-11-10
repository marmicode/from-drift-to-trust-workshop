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
- a [promptfoo](https://www.promptfoo.dev) suite in `evals/angular-mermaid` with its shared options, Mermaid assertions and one unfinished case, but no providers yet.

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

- `promptfooconfig.ts`: the grader (Haiku), the cache, the `beforeAll` hook, and `_sharedOptions()`, the Claude Code options every provider shares. The agent only has read-only tools: it replies with the diagram, so its answer can be cached and graded as text.
- `hooks.ts`: before the run, copies the app's sources into two workspaces outside the repository, and the skill into the `with-skill` one only. It exports their paths: `WITH_SKILL_DIR` and `BASELINE_DIR`.
- `assertions.ts`: `diagramAssertions()` checks what every diagram needs. `mermaidContains()`, `mermaidOmits()`, `component()` and `service()` test the first ` ```mermaid ` block only, not the prose around it.

#### 3. Add the providers.

Add two `anthropic:claude-agent-sdk` providers to `providers` in `promptfooconfig.ts`, both with `_sharedOptions()`:

- `with-skill` works in `WITH_SKILL_DIR`, loads project settings, and enables the `angular-mermaid` skill.
- `baseline` works in `BASELINE_DIR`, with nothing else.

:::tip
Wrap each provider's `config` in `defineClaudeCodeOptions()` so TypeScript checks the options. Look for `setting_sources` and `skills`.
:::

#### 4. Complete the pagination case.

`tests/pagination.ts` already checks the shared diagram rules. Add the checks that make it about pagination:

- `Pager` is a component: `pager[[Pager]]`,
- `pageNumber` is on a solid arrow, between brackets,
- `nextPage` is on a dotted arrow, between parentheses,
- `previousPage` and `nextPage` share that one dotted arrow,
- an `llm-rubric` for what a regex can't see, such as "`RecipePreview` is left out because it plays no part in pagination". Phrase it as facts that pass or fail.

#### 5. Run it.

```sh
pnpm nx eval
```

```sh
pnpm nx view-eval
```

Compare the two columns. Which assertions fail on the baseline only?

Run it again: every answer comes from the cache. Same prompt, same files, so no agent runs again.

Read every failure before you blame the skill. Is the agent wrong, or is the assertion?

#### 6. Break the skill.

A teammate finds a rule redundant. Delete this line from `.claude/skills/angular-mermaid/SKILL.md`:

```md
- One arrow per direction between two nodes. Put all the inputs in one label, and all the outputs in another: `"[pageNumber: number, hasNextPage: boolean]"`, `"(previousPage, nextPage)"`.
```

```sh
pnpm nx eval
```

The baseline comes from the cache, and the `with-skill` column runs again. Does the pagination case regress?

One run is one sample. Run the `with-skill` provider a few more times before you call it:

```sh
pnpm nx eval -- --filter-providers with-skill --repeat 3
```

Undo the edit.

#### 7. Debrief.

- What does the skill buy you, case by case?
- Which failures came from the agent, and which from your assertions?
- Which checks would you trust to gate a skill change in CI?
- How many samples before a red cell means a regression?
- What did the runs cost? The token totals are at the end of each run.

:::tip
The solution ships both providers and three cases: pagination, the ADD flow without asking for a diagram, and a meal plan panel change with colors: `pnpm cook solution`.
:::
