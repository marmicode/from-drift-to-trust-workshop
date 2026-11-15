---
sidebar_label: 404. Charted Autopilot
---

# Charted Autopilot

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

Do [403. Charted Implementation](./403-charted-implementation.md) first.

You need Claude Code with the Workflow tool: the agent writes and runs a workflow script.

## Setup

```sh
pnpm cook start 404-charted-autopilot
```

## 🎯 Goal

Build a workflow that runs a whole PR on its own, let it run, then review the commits one by one.

In 403, you drove each step: scaffold, red, green, commit, again. Now a dynamic workflow drives the loop. Claude Code workflows are scripts in `.claude/workflows/` that spawn agents with deterministic control flow: loops, conditions, and structured outputs. Your job moves from driving to reviewing.

## 📝 Steps

#### 1. Pick the next PR in the plan.

Open `design-docs/001-recipe-search-pagination.md` and find the first PR that is not done yet.

#### 2. Ask the agent to write the workflow.

```text
/workflow-authoring create a workflow at .claude/workflows/charted-autopilot.js that runs one PR of a Charted Coding design doc on autopilot.

It takes `args` as an object, `{ designDocPath: string, prNumber: number }`, and loops until the PR is done:

1. A read-only agent reads the PR section of the design doc (its Tasks `- [ ]` and its Testing Strategy `### 🚧`), inspects the code, and reports as structured output: the pending tests, the unchecked tasks, how many items are checked off, the test files of the PR, and the next step:
   - "scaffold" when a pending test has no matching `it.todo` or a production item the Tasks require is missing
   - "red" when a pending `it.todo` only contains comments
   - "green" when every pending test has real test code
   - "extra task" when there is no pending test but a task is still unchecked
   - "done" when the PR is marked ✅ or nothing is pending
2. An agent runs that step: `charted-scaffold` for the whole PR, `charted-red` or `charted-green` with the test files from step 1 until every pending test of the PR is handled, or a plain prompt that completes the first unchecked task and checks it off in the design doc.
3. An agent commits everything with a subject that names the step and the PR, like "test: ✅ red PR#2: ...".
4. Stop with a "stuck" status when step 1 picks the same step twice in a row and the number of checked-off items has not changed. Red checks nothing off, but it is followed by green, so it never counts as stuck on its own.

Return the steps that ran with their commits.
```

Commit the workflow script on its own, so the autopilot's first commit does not sweep it in:

```sh
git add .claude/workflows/charted-autopilot.js
git commit -m "build: 📦 add charted-autopilot workflow"
```

#### 3. Try the autopilot.

```text
/charted-autopilot { designDocPath: "design-docs/001-recipe-search-pagination.md", prNumber: YOUR_PR_NUMBER_HERE }.
```
