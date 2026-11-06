import { playwright } from '@vitest/browser-playwright';
import { basename } from 'node:path';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

const projectName = basename(import.meta.dirname);

/**
 * - `*.browser.spec.ts` runs in a real browser.
 * - `*.spec.ts` runs in jsdom.
 * - `*.wide.spec.ts` runs in jsdom against the real backend (`pnpm start-server`),
 *   so `pnpm test` skips it. Run it with `pnpm test-wide`.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      setupFiles: ['src/test-setup.ts'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: `../../coverage/apps/${projectName}`,
        provider: 'v8',
      },
      watch: false,
      projects: [
        {
          extends: true,
          test: {
            name: 'browser',
            include: ['src/**/*.browser.spec.ts'],
            browser: {
              enabled: true,
              screenshotFailures: false,
              headless: true,
              provider: playwright({ actionTimeout: 3_000 }),
              instances: [
                { browser: 'chromium', viewport: { width: 1280, height: 800 } },
              ],
            },
          },
        },
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'jsdom',
            include: ['src/**/!(*.browser|*.wide).spec.ts'],
          },
        },
        {
          extends: true,
          test: {
            name: 'wide',
            environment: 'jsdom',
            include: ['src/**/*.wide.spec.ts'],
          },
        },
      ],
    },
  }),
);
