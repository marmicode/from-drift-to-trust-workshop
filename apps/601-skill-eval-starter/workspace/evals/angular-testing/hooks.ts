import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const REPO_ROOT = resolve(import.meta.dirname, '../..');
const FIXTURE_DIR = join(import.meta.dirname, 'fixture');
/* `npx skills add` installs into `.agents/skills`, then links agent folders to it. */
const SKILL_DIRS = ['.claude/skills', '.agents/skills'].map((dir) =>
  join(REPO_ROOT, dir, 'angular-testing'),
);

/* Outside the repository, so the agent finds no parent `.claude` or `CLAUDE.md`. */
const WORKSPACES_DIR = join(tmpdir(), 'from-drift-to-trust-evals');
export const WITH_SKILL_DIR = join(WORKSPACES_DIR, 'with-skill');
export const BASELINE_DIR = join(WORKSPACES_DIR, 'baseline');

/**
 * Syncs the fixture into two workspaces, then the installed skill into the
 * with-skill one. The baseline cannot share the fixture: a skill on disk is
 * readable even when the agent does not load it.
 *
 * promptfoo caches an agent's answer by the mtimes of its working directory,
 * so only the files that changed are copied. Editing the skill re-runs the
 * with-skill provider, and the baseline stays cached.
 */
export async function beforeAll() {
  const skillDir = SKILL_DIRS.find((dir) => existsSync(dir));
  if (skillDir === undefined) {
    throw new Error(
      'Missing angular-testing skill. Install it first: npx skills add marmicode/skills',
    );
  }

  _syncDir(FIXTURE_DIR, BASELINE_DIR);
  _syncDir(FIXTURE_DIR, WITH_SKILL_DIR, ['.claude']);
  _syncDir(
    realpathSync(skillDir),
    join(WITH_SKILL_DIR, '.claude/skills/angular-testing'),
  );
}

/**
 * Makes `target` a copy of `source` without touching unchanged files.
 * Entries listed in `keep` are left alone in `target`.
 */
function _syncDir(source: string, target: string, keep: string[] = []) {
  mkdirSync(target, { recursive: true });

  const sourceEntries = readdirSync(source);
  for (const entry of readdirSync(target)) {
    if (!sourceEntries.includes(entry) && !keep.includes(entry)) {
      rmSync(join(target, entry), { recursive: true, force: true });
    }
  }

  for (const entry of sourceEntries) {
    const sourcePath = join(source, entry);
    const targetPath = join(target, entry);
    if (statSync(sourcePath).isDirectory()) {
      _syncDir(sourcePath, targetPath);
    } else if (
      !existsSync(targetPath) ||
      !readFileSync(sourcePath).equals(readFileSync(targetPath))
    ) {
      copyFileSync(sourcePath, targetPath);
    }
  }
}
