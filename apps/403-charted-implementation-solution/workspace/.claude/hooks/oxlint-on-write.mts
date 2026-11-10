#!/usr/bin/env node

import { z } from 'zod';
import { $ } from 'zx';
import { runHook } from './internal/run-hook.mts';

const toolInputSchema = z.object({
  file_path: z.string(),
});

await runHook({
  hookEventName: 'PostToolUse',
  handler: async (input) => {
    const toolInput = toolInputSchema.parse(input.tool_input);

    const result = await $`pnpm oxlint ${toolInput.file_path}`.nothrow();

    if (result.exitCode === 0) {
      return;
    }

    const lintErr =
      `${result.stderr}${result.stdout}`.trim() ||
      'Oxlint failed with no output';

    return {
      output: {
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `Oxlint reported issues in the file you just edited (${toolInput.file_path}).
  Fix the issues that are related to the changes you made even if it's not caused by the changes you made.
  Boy scout rule: leave the code better than you found it.
          
          ${lintErr}`,
        },
      },
    };
  },
});
