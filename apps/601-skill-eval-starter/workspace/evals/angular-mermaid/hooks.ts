import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';

const REPO_ROOT = resolve(import.meta.dirname, '../..');
/* The cooked exercise: the agent draws the app you have been working on. */
const APP_DIR = join(REPO_ROOT, 'apps/whiskmate');
const SKILL_DIR = join(REPO_ROOT, '.claude/skills/angular-mermaid');

/* Outside the repository, so the agent finds no parent `.claude` or `CLAUDE.md`. */
const WORKSPACES_DIR = join(
  tmpdir(),
  'from-drift-to-trust-evals/angular-mermaid',
);
export const WITH_SKILL_DIR = join(WORKSPACES_DIR, 'with-skill');
export const BASELINE_DIR = join(WORKSPACES_DIR, 'baseline');

/**
 * Syncs the app's sources into two workspaces, then the skill into the
 * with-skill one. The baseline cannot share the workspace: a skill on disk is
 * readable even when the agent does not load it.
 *
 * promptfoo caches an agent's answer by the mtimes of its working directory,
 * so only the files that changed are copied. Editing the skill re-runs the
 * with-skill provider, and the baseline stays cached.
 */
export async function beforeAll() {
  if (!existsSync(SKILL_DIR)) {
    throw new Error(`Missing angular-mermaid skill in ${SKILL_DIR}.`);
  }

  _syncDir(APP_DIR, BASELINE_DIR, _isAppSource);
  _syncDir(APP_DIR, WITH_SKILL_DIR, _isAppSource, ['.claude']);
  _syncDir(
    SKILL_DIR,
    join(WITH_SKILL_DIR, '.claude/skills/angular-mermaid'),
    () => true,
  );
}

/**
 * The app's components and services, plus `tsconfig.json` for the path
 * aliases. Specs are left out: the diagrams are about the app, not its tests.
 */
function _isAppSource(path: string) {
  if (path.endsWith('.spec.ts')) return false;
  return (
    path === 'tsconfig.json' ||
    path === 'src' ||
    path === join('src', 'app') ||
    path.startsWith(join('src', 'app') + sep)
  );
}

/**
 * Makes `target` a copy of the entries of `source` that `include` accepts,
 * without touching unchanged files. `include` gets paths relative to `source`.
 * Entries listed in `keep` are left alone in `target`.
 */
function _syncDir(
  source: string,
  target: string,
  include: (path: string) => boolean,
  keep: string[] = [],
  path = '',
) {
  mkdirSync(target, { recursive: true });

  const sourceEntries = readdirSync(source).filter((entry) =>
    include(join(path, entry)),
  );
  for (const entry of readdirSync(target)) {
    if (!sourceEntries.includes(entry) && !keep.includes(entry)) {
      rmSync(join(target, entry), { recursive: true, force: true });
    }
  }

  for (const entry of sourceEntries) {
    const sourcePath = join(source, entry);
    const targetPath = join(target, entry);
    if (statSync(sourcePath).isDirectory()) {
      _syncDir(sourcePath, targetPath, include, [], join(path, entry));
    } else if (
      !existsSync(targetPath) ||
      !readFileSync(sourcePath).equals(readFileSync(targetPath))
    ) {
      copyFileSync(sourcePath, targetPath);
    }
  }
}
