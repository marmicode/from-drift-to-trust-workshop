import { defineConfig } from 'oxlint';
import {
  depConstraints,
  testDepConstraints,
} from './tools/oxlint/dep-constraints.mts';

export default defineConfig({
  plugins: ['eslint', 'typescript', 'unicorn', 'oxc'],
  jsPlugins: ['@nx/eslint-plugin'],
  ignorePatterns: ['**/dist', '**/out-tsc', '**/vitest.config.*.timestamp*'],
  overrides: [
    {
      files: ['**/*.ts'],
      excludeFiles: [
        '**/*.spec.ts',
        '**/*.contract.ts',
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
      files: ['**/*.spec.ts', '**/*.contract.ts'],
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
  ],
});
