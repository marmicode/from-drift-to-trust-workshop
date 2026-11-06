---
sidebar_label: 404. Charted Autopilot
---

# Charted Autopilot

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

Do [403. Charted Implementation](./403-charted-implementation.md) first.

## Setup

Keep going from where 403 left you: same branch, same design doc.

If you prefer a clean start, cook the exercise. The design doc is at `design-docs/001-recipe-search-pagination.md` and nothing is implemented yet, so start with PR#1.

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
Use the workflow-authoring skill and create a workflow at .claude/workflows/charted-autopilot.js that runs one PR of a Charted Coding design doc on autopilot.

It takes `designDocPath` and `prNumber` as args and loops until the PR is done:

1. A read-only agent reads the PR section of the design doc (its Tasks `- [ ]` and its Testing Strategy `### 🚧`), inspects the code, and reports as structured output: the pending tests, the unchecked tasks, how many items are checked off, the test files of the PR, and the next step:
   - "scaffold" when a pending test has no matching `it.todo` or a production item the Tasks require is missing
   - "red" when a pending `it.todo` only contains comments
   - "green" when every pending test has real test code
   - "extra task" when there is no pending test but a task is still unchecked
   - "done" when the PR is marked ✅ or nothing is pending
2. An agent runs that step: `charted-scaffold` for the whole PR, `charted-red` or `charted-green` until every pending test of the PR is handled, or a plain prompt that completes the first unchecked task and checks it off in the design doc.
3. An agent commits everything with a subject that names the step and the PR, like "test: ✅ red waypoint #2: ...".
4. Stop with a "stuck" status when the same step runs twice without checking anything off.

Return the steps that ran with their commits.
```

Read the script before running it. Does it do what you asked, and nothing more?

:::tip
The skill explains the script API: `agent()` with a `schema` for structured output, `log()`, `phase()`, and `args`.
:::

#### 3. Start the autopilot.

```text
Run the charted-autopilot workflow with designDocPath=design-docs/001-recipe-search-pagination.md and prNumber=YOUR_PR_NUMBER_HERE.
```

#### 4. Watch for judgment calls while it runs.

Each time you would have stopped the agent, write down why. Did it pass a test too easily? Did it touch a file outside the PR? Did it change a test to make it green?

#### 5. Review the commits one by one.

```sh
git log --oneline main..
```

For each commit, `git show <sha>` and ask:

- Does the test read like a spec of the behavior?
- Does the red commit come before the green one?
- Would you have let this commit through?

#### 6. Run the next PR.

Start the workflow again with the next PR number. Did the second run need any change to the script?

#### 7. Start the app and page through the recipes.

```sh
pnpm start
```

:::tip
The solution ships a `charted-autopilot.js` you can compare with yours: `pnpm cook solution`, then open `.claude/workflows/charted-autopilot.js`.
:::
