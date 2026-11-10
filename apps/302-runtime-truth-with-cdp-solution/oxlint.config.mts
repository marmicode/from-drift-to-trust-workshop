import { defineConfig } from 'oxlint';
import baseConfig from '../../oxlint.config.mts';

export default defineConfig({
  extends: [baseConfig],
  jsPlugins: ['@angular-eslint/eslint-plugin'],
  rules: {
    '@angular-eslint/contextual-lifecycle': 'error',
    '@angular-eslint/no-empty-lifecycle-method': 'error',
    '@angular-eslint/no-input-rename': 'error',
    '@angular-eslint/no-inputs-metadata-property': 'error',
    '@angular-eslint/no-output-native': 'error',
    '@angular-eslint/no-output-on-prefix': 'error',
    '@angular-eslint/no-output-rename': 'error',
    '@angular-eslint/no-outputs-metadata-property': 'error',
    '@angular-eslint/prefer-inject': 'error',
    '@angular-eslint/prefer-on-push-component-change-detection': 'error',
    '@angular-eslint/prefer-standalone': 'error',
    '@angular-eslint/use-pipe-transform-interface': 'error',
    '@angular-eslint/directive-selector': [
      'error',
      {
        type: 'attribute',
        prefix: 'wm',
        style: 'camelCase',
      },
    ],
    '@angular-eslint/component-selector': [
      'error',
      {
        type: 'element',
        prefix: 'wm',
        style: 'kebab-case',
      },
    ],
  },
});
