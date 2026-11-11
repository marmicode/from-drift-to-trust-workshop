---
sidebar_label: 402. Charted Design
---

# Charted Design

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 402-charted-design
```

Same code as the [301](./301-angular-testing-skill.md) solution: `RecipeSearch` lists every recipe matching the filters. There is no pagination yet.

## 🎯 Goal

Install the Charted Coding skills and write the design doc for paginating the recipe search.
Do not implement pagination.

## 📝 Steps

#### 1. Install the Charted Coding skills.

```sh
npx skills add marmicode/skills --skill charted-continue charted-design charted-green charted-red charted-review charted-scaffold
```

When prompted, pick your agent and the **project** scope. Check that `.claude/skills/charted-design/SKILL.md` now exists and that `skills-lock.json` lists the six skills: 403 and 404 expect them next to the project's other skills.

#### 2. Prompt the agent to write the design.

```text
/charted-design paginate the recipe search by offset
```

#### 3. Design the feature.

Answer the agent's questions.
Ask it to write the doc at the workspace root, in `design-docs/001-recipe-search-pagination.md` (403 and 404 use that path).
Feel free to edit and commit the design doc as you go.

Keep it small:

- Four recipes per page, with Previous and Next buttons.
- The recipe API already takes `offset` and `limit` in the search body. It does not return a total count, so decide with the agent how the page knows whether there is a next one.
- Four PRs: the repository, a `Pager` component, the search page, then hiding the pager when there are no recipes.

The doc is done when each of the four PRs lists its tasks and its tests, and you would hand it to someone else to implement.

:::warning
Do not implement the feature yet.
:::
