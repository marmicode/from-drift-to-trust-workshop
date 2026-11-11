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

The workflow-authoring skill usually passes scripts inline. Here you want a file, so you can read it, commit it, and run it again for the next PR. A file in `.claude/workflows/` is registered under its `meta.name`, so the agent can run it with `Workflow({ name: "charted-autopilot", args })`, or with `scriptPath` pointing at the file.

Read the script before running it. Does it do what you asked, and nothing more?

Then commit it on its own, so the autopilot's first commit does not sweep it in:

```sh
git add .claude/workflows/charted-autopilot.js
git commit -m "build: 📦 add charted-autopilot workflow"
```

:::tip
The skill explains the script API: `agent()` with a `schema` for structured output, `log()`, `phase()`, and `args`.
:::

#### 3. Start the autopilot.

```text
Run the charted-autopilot workflow with args { designDocPath: "design-docs/001-recipe-search-pagination.md", prNumber: YOUR_PR_NUMBER_HERE }.
```

#### 4. Watch for judgment calls while it runs.

Each time you would have stopped the agent, write down why. Did it pass a test too easily? Did it touch a file outside the PR? Did it change a test to make it green?

#### 5. Review the commits one by one.

```sh
git log --oneline main..
```

The oldest commits are cook's "focus on" commit and your workflow script. The autopilot's commits come after them.

For each commit, `git show <sha>` and ask:

- Does the test read like a spec of the behavior?
- Does the red commit come before the green one?
- Would you have let this commit through?

#### 6. Run the next PR.

Start the workflow again with the next PR number. Did the second run need any change to the script?

The pager shows up in the app once PR#3 (Page through the search results) is done. From a clean start, run the workflow once more for PR#3.

#### 7. Start the app and page through the recipes.

```sh
pnpm start
```

:::tip
The solution ships a `charted-autopilot.js` you can compare with yours: `pnpm cook solution`, then open `.claude/workflows/charted-autopilot.js`.
:::
