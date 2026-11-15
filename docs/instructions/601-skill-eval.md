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

## 🎯 Goal

The workspace has:

- a new `angular-mermaid` skill. It makes the agent draw small Angular diagrams. _(e.g. components as `[[RecipeSearch]]`, services as `([RecipeRepository])`, inputs on solid arrows as `"[recipe: Recipe]"`, outputs on dotted arrows as `"(filterChange: RecipeFilterCriteria)"`, and colors for what a change adds or modifies)_.
- a [promptfoo](https://www.promptfoo.dev) suite in `evals/angular-mermaid`, at the workspace root.

Find out whether the `angular-mermaid` skill actually changes the diagrams the agent draws, then break the skill and see whether the eval catches it.

## 📝 Steps

#### 1. Set the key.

```sh
export ANTHROPIC_API_KEY=... # the shared key, from the trainer
```

Without `ANTHROPIC_API_KEY`, the eval falls back to your Claude Code login without telling you.

#### 2. Add the providers.

Add two `anthropic:claude-agent-sdk` providers to `providers` in `promptfooconfig.ts`, both with `_sharedOptions()`. Give each a `label`:

- `with-skill` works in `WITH_SKILL_DIR`, loads project settings, and enables the `angular-mermaid` skill.
- `baseline` works in `BASELINE_DIR`, with nothing else.

:::tip
Wrap each provider's `config` in `defineClaudeCodeOptions()` so TypeScript checks the options. Look for `working_dir`, `setting_sources` and `skills`.
:::

#### 4. Complete the pagination case.

`tests/pagination.ts` already checks the shared diagram rules. Add the checks that make it about pagination:

- `Pager` is a component: `pager[[Pager]]`,
- `pageNumber` is on a solid arrow, between brackets,
- `nextPage` is on a dotted arrow, between parentheses,
- `previousPage` and `nextPage` share that one dotted arrow,
- an `llm-rubric` for what a regex can't see, such as "`RecipePreview` is left out because it plays no part in pagination". Phrase it as facts that pass or fail.

Each regex check is a `javascript` assertion:

```ts
{
  type: 'javascript',
  metric: 'pager-is-a-component',
  value: mermaidContains(component('Pager')),
},
```

#### 5. Break the skill.

A teammate finds a rule redundant. Delete this line from `.claude/skills/angular-mermaid/SKILL.md`:

```md
- One arrow per direction between two nodes. Put all the inputs in one label, and all the outputs in another: `"[pageNumber: number, hasNextPage: boolean]"`, `"(previousPage, nextPage)"`.
```

The first example of the skill still shows the shared arrow, and the agent copies examples. So the teammate also "clarifies" the example, replacing its `pager -.->|"(previousPage, nextPage)"| search` line with one arrow per output:

```md
pager -.->|"(previousPage)"| search
pager -.->|"(nextPage)"| search
```

```sh
pnpm nx eval
```
