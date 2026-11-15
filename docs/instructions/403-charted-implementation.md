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

The design doc is already at `design-docs/001-recipe-search-pagination.md`. Nothing is implemented yet.

## 🎯 Goal

Implement the design doc using the Charted Coding skills, one PR at a time:

- PR#1 teaches `RecipeRepository`, its fake, and their contract about `offset` and `limit`.
- PR#2 adds a `Pager` component with Previous, the page number, and Next.
- PR#3 wires the pager into `RecipeSearch`, pages through the results, and goes back to the first page when the filter changes.
- PR#4 hides the pager when there are no recipes.

**The goal is to try and feel the right step granularity.**

Commit after each step: scaffold, red, then green. A PR is done when every task and test of its section is checked off and its title is marked ✅. The PR title is the `<summary>🚧 PR#N — …</summary>` line of its collapsible block in the design doc.

### Skills usage

```text
/charted-scaffold design-docs/001-recipe-search-pagination.md <PR-number>
/charted-red design-docs/001-recipe-search-pagination.md <test-file>
/charted-green design-docs/001-recipe-search-pagination.md <test-file>

# Or if you do not even remember where you are at:
/charted-continue design-docs/001-recipe-search-pagination.md <PR-number>
```

:::tip
`charted-red` and `charted-green` work on one test at a time. The coarse option, is to write or fix all the tests of a PR at once:

```text
/charted-red @design-docs/001-recipe-search-pagination.md PR#1 all tests.
```

:::

:::tip
You can compose the skills with prompts such as:

```text
Keep on invoking `charted-continue` skill with PR#1 until all tasks and tests are completed.
Do not start working on another PR automatically.
```

:::
