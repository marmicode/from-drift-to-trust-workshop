import nx from '@nx/eslint-plugin';
import {
  depConstraints,
  testDepConstraints,
} from './tools/eslint/dep-constraints.mts';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/vitest.config.*.timestamp*'],
  },
  {
    files: ['**/*.ts'],
    ignores: [
      '**/*.spec.ts',
      '**/*.contract.ts',
      '**/*devtools.ts',
      '**/test-setup.ts',
      '**/vite.config.ts',
      '**/workspace/**/*.ts',
    ],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          depConstraints,
        },
      ],
    },
  },
  {
    /* Dev tools only run in tests: test-setup.ts registers them. */
    files: ['**/*.spec.ts', '**/*.contract.ts', '**/*devtools.ts'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          depConstraints: testDepConstraints,
        },
      ],
    },
  },
];
