---
sidebar_label: 401. Review Fatigue
---

# Review Fatigue

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 401-review-fatigue
```

## 🎯 Goal

You have **10 minutes** to find contradictions in the documents you are assigned.

A contradiction is two statements in your packet that cannot both be true, for example a field that one section calls required and another calls optional. Typos, style, and missing details do not count.

## 📝 Steps

#### 1. Read only the packet you are assigned.

The facilitator splits the room into two groups. Working alone? Do Group A now, and Group B another day.

- Group A - Design doc: `design-docs/001-weekly-meal-plan.md`
- Group B - Spec Kit folder: `specs/001-weekly-meal-plan/`

:::warning

- Do not open the other packet.
- Do not use an agent.
- Do not search across the other group's files.
  :::

#### 2. Stop when the clock runs out.

Ten minutes. Both groups stop together.

#### 3. Note the contradictions you found.

Write them down, on paper or in a file outside the repository. For each one, name the two statements and the sections they come from.

#### 4. Compare.

Share your count with the room, then compare Group A with Group B: which packet was easier to review, and why?

<details>
<summary>Answer key</summary>

`pnpm cook solution` adds `contradictions.md` at the workspace root. It lists the contradictions planted in both packets.

</details>
