import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['eslint', 'typescript', 'unicorn', 'oxc'],
  jsPlugins: ['@nx/eslint-plugin'],
  ignorePatterns: ['**/dist', '**/out-tsc', '**/vitest.config.*.timestamp*'],
  rules: {
    '@nx/enforce-module-boundaries': [
      'error',
      {
        enforceBuildableLibDependency: true,
        allow: ['^.*/oxlint\\.config\\.[cm]?[jt]s$'],
        depConstraints: [
          {
            sourceTag: '*',
            onlyDependOnLibsWithTags: ['*'],
          },
        ],
      },
    ],
  },
});
