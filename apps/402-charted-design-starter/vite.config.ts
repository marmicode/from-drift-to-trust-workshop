import angular from '@analogjs/vite-plugin-angular';
import { basename } from 'node:path';
import { defineConfig } from 'vite';

const projectName = basename(import.meta.dirname);

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: `../../node_modules/.vite/apps/${projectName}`,
  publicDir: 'public',
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [angular()],
});
