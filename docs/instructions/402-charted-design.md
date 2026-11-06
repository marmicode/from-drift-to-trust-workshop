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
npx skills add marmicode/skills # and select all the charted-* skills
```

#### 2. Prompt the agent to write the design.

```text
/charted-design paginate the recipe search by offset
```

#### 3. Design the feature.

Answer the agent's questions.
Feel free to edit and commit the design doc as you go.

Keep it small:

- Four recipes per page, with Previous and Next buttons.
- The recipe API already takes `offset` and `limit` in the search body. It does not return a total count.
- Four PRs: the repository, a `Pager` component, the search page, then the reset and empty cases.

:::warning
Do not implement the feature yet.
:::
