---
sidebar_label: 501. Sensors
---

# Sensors

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 501-sensors
```

Same code as the [404](./404-charted-autopilot.md) solution, plus a `ClockAdapter` in `shared/infra` and an ESLint rule that forbids `Date` and recommends `ClockAdapter` instead.

`.claude/settings.json` wires no hooks, and the two hooks in `.claude/hooks/` are work in progress.

## 🎯 Goal

Give the agent two sensors so it catches its own mistakes before it hands control back to you:

- **Lint on write**: every `Edit` or `Write` runs ESLint on the file and feeds the issues back to the agent.
- **Tests on stop**: when the agent wants to stop, the tests related to the changed files run, and a failure keeps the agent working.

## 📝 Steps

### Lint on write

#### 1. Paste this prompt before you wire the hook.

```text
In apps/whiskmate/src/app/recipe/domain/meal-planner.ts `addRecipe`,
prompt user with "are you still hungry?" if current date is december 25th
```

Make sure the generated code uses `Date` instead of `ClockAdapter`, then revert the change:

```sh
git checkout .
```

#### 2. Implement the hook.

- Edit `.claude/hooks/eslint-on-write.mts`.

- Parse `input.tool_input` with `toolInputSchema`. _(See [hook input schema](https://code.claude.com/docs/en/hooks#:~:text=Creates%20or%20overwrites%20a%20file))_

- Use `zx` to run ESLint on the file:

```ts
$`pnpm eslint --flag v10_config_lookup_from_file ${toolInput.file_path}`.nothrow();
```

- If ESLint exits with code 0, everything is fine. Return nothing.

- Otherwise, return an output with `hookSpecificOutput` containing `additionalContext`. The agent receives it as a prompt:

```text
ESLint reported issues in the file you just edited (${toolInput.file_path}).
Fix the issues that are related to the changes you made even if it's not caused by the changes you made.
Boy scout rule: leave the code better than you found it.

${lintErr}
```

#### 3. Wire the hook.

Register the hook in `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/eslint-on-write.mts",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

#### 4. Try the prompt again in a new session.

Does the agent switch to `ClockAdapter` without you asking? Revert the change.

### Tests on stop

#### 5. Paste this prompt before you wire the hook.

```text
In apps/whiskmate/src/app/recipe/domain/meal-planner.ts,
rename `addRecipe` to `plan` and let users plan the same recipe more than once.
Do not run the tests.
```

The agent hands control back to you. Run the tests:

```sh
pnpm test
```

Which test fails? Nothing told the agent. Revert the change.

#### 6. Implement the hook.

- Edit `.claude/hooks/test-on-stop.mts`.

- If `input.stop_hook_active` is `true`, return nothing. The agent is already continuing because of this hook, and this check caps the retries so the agent never loops forever.

- Run only the tests affected by the current changes. `--changed` reads them from git, including untracked files, and exits 0 when nothing changed:

```ts
const $app = $({ cwd: APP_ROOT });
const result =
  await $app`pnpm vitest --changed --run --project=!wide --reporter=minimal`.nothrow();
```

- If Vitest exits with code 0, return nothing.

- Otherwise, block the stop and give the failures as the reason. _(See [Stop hook](https://code.claude.com/docs/en/hooks))_

```ts
return {
  output: {
    decision: 'block',
    reason: `Tests related to the files you changed are failing.
Fix them before you stop. If a test contradicts what the user asked for, ask the user instead of changing the test.

${testErr}`,
  },
};
```

#### 7. Wire the hook.

Add a `Stop` hook next to `PostToolUse` in `.claude/settings.json`:

```json
"Stop": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "node .claude/hooks/test-on-stop.mts",
        "timeout": 300
      }
    ]
  }
]
```

#### 8. Try the prompt again in a new session.

- Does the hook block the stop? Which tests did it run, and which did it skip?
- What does the agent do with the failing test? Does it fix the code, change the test, or ask you?
- How long did you wait for the hook? What would happen with the whole test suite instead of `vitest --changed`?

:::tip
Cursor and Copilot CLI can run the same hooks. `.claude/hooks/internal/run-hook.mts` maps their event names and payloads to Claude Code's.
:::
