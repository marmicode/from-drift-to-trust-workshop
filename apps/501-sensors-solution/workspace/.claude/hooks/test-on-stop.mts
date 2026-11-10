#!/usr/bin/env node

import { $ } from 'zx';
import { runHook } from './internal/run-hook.mts';

const APP_ROOT = 'apps/whiskmate';

await runHook({
  hookEventName: 'Stop',
  handler: async (input) => {
    /* The agent is already fixing what this hook reported last time.
     * Let it stop so we don't loop forever. */
    if (input.stop_hook_active) {
      return;
    }

    const $app = $({ cwd: APP_ROOT });

    const changedFiles = (
      await $app`git diff --name-only --relative HEAD`
    ).lines();

    if (changedFiles.length === 0) {
      return;
    }

    const result =
      await $app`pnpm vitest related ${changedFiles} --run --project=!wide --passWithNoTests --reporter=minimal`.nothrow();

    if (result.exitCode === 0) {
      return;
    }

    const testErr =
      `${result.stderr}${result.stdout}`.trim() ||
      'Vitest failed with no output';

    return {
      output: {
        decision: 'block',
        reason: `Tests related to the files you changed are failing.
Fix them before you stop. If a test contradicts what the user asked for, ask the user instead of changing the test.

${testErr}`,
      },
    };
  },
});
