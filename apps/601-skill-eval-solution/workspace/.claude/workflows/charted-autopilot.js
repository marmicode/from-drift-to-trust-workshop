export const meta = {
  name: 'charted-autopilot',
  description:
    'Loops the Charted Coding scaffold/red/green/extra task cycle on one PR of a design doc, committing after each step, until the PR is done or the loop is stuck',
  phases: [
    { title: 'Next step', detail: 'read the design doc and the code' },
    { title: 'Step', detail: 'scaffold, red, green, or extra task' },
    { title: 'Commit', detail: 'one commit per step' },
  ],
};

// The same step running twice without checking anything off in the design doc means we are stuck.
const MAX_ATTEMPTS_PER_STEP = 2;

const designDocPath = args?.designDocPath;
const prNumber = Number(String(args?.prNumber ?? '').match(/\d+/)?.[0]);

if (!designDocPath || !Number.isInteger(prNumber)) {
  throw new Error(
    'charted-autopilot: args.designDocPath and args.prNumber are required',
  );
}

const steps = [];
let previous = null;

while (true) {
  const next = await computeNextStep();
  log(
    `PR#${prNumber} — ${next.done}/${next.total} checked off — next step: ${next.step} (${next.reason})`,
  );

  if (next.step === 'done') {
    return { status: 'done', steps };
  }

  // "extra task" legitimately repeats, one task at a time: only count attempts that checked nothing off.
  const isRetry =
    previous?.step === next.step && previous.checkedOff === next.done;
  const attempt = isRetry ? previous.attempt + 1 : 1;
  if (attempt > MAX_ATTEMPTS_PER_STEP) {
    log(`Stuck on "${next.step}" after ${previous.attempt} attempts`);
    return { status: 'stuck', step: next.step, reason: next.reason, steps };
  }
  previous = { step: next.step, attempt, checkedOff: next.done };

  const result = await runStep(next);
  const commit = await commitStep(next.step, result);
  steps.push({ step: next.step, attempt, ...result, commit });
}

async function computeNextStep() {
  return await agent(
    `Design doc: ${designDocPath}. You are deciding the next Charted Coding step for PR #${prNumber}. This is a READ-ONLY investigation: do not edit, create, or run anything.

Read the PR #${prNumber} section of the design doc: its Tasks (\`- [ ]\` pending, \`- [x]\` done) and its Testing Strategy (\`### 🚧\` pending, \`### ✅\` done). Then inspect the codebase.

Pick exactly one step, checking in this order:

1. "scaffold" — a pending test has no matching it.todo("{test title}") or it("{test title}") in any test file (titles match case-insensitively), or a production file, class, function, or component that the Tasks require does not exist yet.
2. "red" — scaffolding is done and AT LEAST ONE pending test is an it.todo whose body is empty or only contains step-by-step comments.
3. "green" — scaffolding is done and EVERY pending test has real test code (still it.todo, or already it(...) but not yet checked off in the design doc).
4. "extra task" — there is no pending test, and at least one Task is still unchecked.
5. "done" — the PR title is marked ✅, or there is no pending test and no unchecked Task.

Report the step, a one-line reason, the pending test titles (pendingTests), the unchecked tasks exactly as written (pendingTasks), how many tests and tasks are checked off (done) out of how many (total), and the paths of every test file holding tests of this PR (testFiles, empty if none exist yet).`,
    {
      schema: NEXT_STEP_SCHEMA,
      phase: 'Next step',
      label: `next-step:PR${prNumber}`,
    },
  );
}

async function runStep({ step, pendingTests, pendingTasks, testFiles }) {
  return await agent(stepPrompt(step, pendingTests, pendingTasks, testFiles), {
    schema: STEP_RESULT_SCHEMA,
    phase: 'Step',
    label: `${step}:PR${prNumber}`,
  });
}

function stepPrompt(step, pendingTests, pendingTasks, testFiles) {
  const files = testFiles.length
    ? `Test files of this PR:\n${bullets(testFiles)}`
    : 'Locate the test files of this PR yourself.';

  switch (step) {
    case 'scaffold':
      return `${skill('charted-scaffold')} with designDocPath=${designDocPath} and prNumber=${prNumber}. Scaffold the whole PR: every WIP production item its Tasks require, and one it.todo per scenario of its Testing Strategy. Do not write real test code and do not implement any behavior. Report success and a one-line summary.`;
    case 'red':
      return `${skill('charted-red')} with designDocPath=${designDocPath}, for PR #${prNumber}.

The skill handles one test of one file at a time: apply it repeatedly until EVERY pending test of this PR has real test code.

Pending tests of this PR:
${bullets(pendingTests)}

${files}

Keep every test as it.todo, never write or change production code, and never edit the design doc. Report success (true only if all of them are implemented) and a one-line summary.`;
    case 'green':
      return `${skill('charted-green')} with designDocPath=${designDocPath}, for PR #${prNumber}.

Apply it to each test file in turn until EVERY pending test of this PR is green: activate the tests one at a time (it.todo -> it), implement just enough for that test to pass, then flip its design doc markers as the skill says.

Pending tests of this PR:
${bullets(pendingTests)}

${files}

Only touch tests that belong to this PR. Report success (true only if all pending tests are green) and a one-line summary.`;
    case 'extra task':
      return `Design doc: ${designDocPath} — the single source of truth. Every test of PR #${prNumber} is green, but some of its Tasks are still unchecked:
${bullets(pendingTasks)}

Complete the FIRST task of that list, and only that one. If it is already done, verify it and just check it off. Keep every existing test passing. Then flip its \`- [ ]\` to \`- [x]\` in the design doc, and flip the PR's 🚧 to ✅ if everything in the PR is now checked off. Never reword, reorder, add, or remove anything else in the design doc. Report success and a one-line summary.`;
  }
}

function skill(name) {
  return `Use the \`${name}\` skill (invoke it via the Skill tool; if it is unavailable, read .claude/skills/${name}/SKILL.md and follow it exactly)`;
}

async function commitStep(step, result) {
  const subject = `${COMMIT_PREFIXES[step]} ${step} waypoint #${prNumber}: ${result.summary}`;
  const commit = await agent(
    `Run \`git status --porcelain\`. If it prints nothing, report committed=false and stop. Otherwise stage everything (\`git add -A\`) and create ONE commit whose subject line is exactly this JSON string's value: ${JSON.stringify(subject)}. Do not push. Report committed and the short sha.`,
    {
      schema: COMMIT_SCHEMA,
      effort: 'low',
      phase: 'Commit',
      label: `commit:${step}:PR${prNumber}`,
    },
  );
  log(
    commit?.committed
      ? `Committed ${commit.sha ?? ''} — ${subject}`
      : `Nothing to commit after ${step}`,
  );
  return commit?.committed ? subject : null;
}

const COMMIT_PREFIXES = {
  scaffold: 'refactor: 🛠️',
  red: 'test: ✅',
  green: 'feat: 🚀',
  'extra task': 'refactor: 🛠️',
};

function bullets(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

const NEXT_STEP_SCHEMA = {
  type: 'object',
  properties: {
    step: {
      type: 'string',
      enum: ['scaffold', 'red', 'green', 'extra task', 'done'],
    },
    reason: { type: 'string' },
    pendingTests: { type: 'array', items: { type: 'string' } },
    pendingTasks: { type: 'array', items: { type: 'string' } },
    done: { type: 'number' },
    total: { type: 'number' },
    testFiles: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'step',
    'reason',
    'pendingTests',
    'pendingTasks',
    'done',
    'total',
    'testFiles',
  ],
};

const STEP_RESULT_SCHEMA = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    summary: { type: 'string' },
  },
  required: ['success', 'summary'],
};

const COMMIT_SCHEMA = {
  type: 'object',
  properties: {
    committed: { type: 'boolean' },
    sha: { type: 'string' },
  },
  required: ['committed'],
};
