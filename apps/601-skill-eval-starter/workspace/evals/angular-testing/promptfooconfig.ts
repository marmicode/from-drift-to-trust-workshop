import type { UnifiedConfig } from 'promptfoo';
import { BASELINE_DIR, WITH_SKILL_DIR } from './hooks.ts';
import mealPlanner from './tests/meal-planner.ts';

const HAIKU = 'claude-haiku-5-5';

/* Read-only tools: the agent replies with the spec instead of writing it,
   so its answer can be cached and graded as text. */
const PROMPT = `{{request}}
Do not create or edit files. Reply with each file you would create: a \`### <path>\` heading, then its content in a code block.`;

const AGENT_OPTIONS = {
  model: HAIKU,
  max_turns: 20,
  /* Per test, so one runaway case cannot drain the shared key. */
  max_budget_usd: 0.3,
};

export default {
  description: 'angular-testing skill',
  prompts: [PROMPT],
  providers: [
    {
      id: 'anthropic:claude-agent-sdk',
      label: 'with-skill',
      config: {
        ...AGENT_OPTIONS,
        working_dir: WITH_SKILL_DIR,
        /* Discovers `.claude/skills/*` but ignores user-level skills and settings. */
        setting_sources: ['project'],
        skills: ['angular-testing'],
      },
    },
    {
      id: 'anthropic:claude-agent-sdk',
      label: 'baseline',
      config: {
        ...AGENT_OPTIONS,
        working_dir: BASELINE_DIR,
      },
    },
  ],
  extensions: ['file://hooks.ts:beforeAll'],
  /* Re-runs only what changed: the agent's answer is keyed by its working
     directory, and the grader's verdict by the rubric and the answer. */
  evaluateOptions: { cache: true },
  defaultTest: {
    options: {
      /* Assertions see the files only, so a note in the agent's prose
         ("or call fixture.detectChanges()") cannot trip a not-regex. */
      transform: (output) =>
        String(output)
          .match(/^#{1,6} .*$|^```[\s\S]*?^```/gm)
          ?.join('\n\n') ?? '',
      /* Haiku grades every llm-rubric. Thinking stays out of the verdict:
         promptfoo parses the first `{...}` it finds, and fails closed. */
      provider: {
        id: `anthropic:messages:${HAIKU}`,
        config: { showThinking: false },
      },
    },
  },
  tests: [mealPlanner],
} satisfies UnifiedConfig;
