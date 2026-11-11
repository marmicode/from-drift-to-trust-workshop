#!/usr/bin/env node

import { $ } from 'zx';
import { runHook } from './internal/run-hook.mts';

const APP_ROOT = 'apps/whiskmate';

await runHook({
  hookEventName: 'Stop',
  handler: async (input) => {
    throw new Error('🚧 Work in progress!');
  },
});
