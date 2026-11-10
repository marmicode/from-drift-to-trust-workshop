import type { UnifiedConfig } from 'promptfoo';
import { BASELINE_DIR, WITH_SKILL_DIR } from './hooks.ts';
import addToMealPlan from './tests/add-to-meal-plan.ts';
import mealPlanPanel from './tests/meal-plan-panel.ts';
import pagination from './tests/pagination.ts';

const HAIKU = 'claude-haiku-5-5';

const AGENT_OPTIONS = {
  model: HAIKU,
  max_turns: 20,
  /* Per test, so one runaway case cannot drain the shared key. */
  max_budget_usd: 0.3,
  /* No `allow_all_tools`: the agent only gets read-only tools. It replies
     with the diagram, so its answer can be cached and graded as text. */
};

export default {
  description: 'angular-mermaid skill',
  prompts: ['{{request}}'],
  providers: [
    {
      id: 'anthropic:claude-agent-sdk',
      label: `${HAIKU}:with-skill`,
      config: {
        ...AGENT_OPTIONS,
        working_dir: WITH_SKILL_DIR,
        /* Discovers `.claude/skills/*` but ignores user-level skills and settings. */
        setting_sources: ['project'],
        skills: ['angular-mermaid'],
      },
    },
    {
      id: 'anthropic:claude-agent-sdk',
      label: `${HAIKU}:baseline`,
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
      /* Haiku grades every llm-rubric. Thinking stays out of the verdict:
         promptfoo parses the first `{...}` it finds, and fails closed. */
      provider: {
        id: `anthropic:messages:${HAIKU}`,
        config: { showThinking: false },
      },
    },
  },
  tests: [pagination, addToMealPlan, mealPlanPanel],
} satisfies UnifiedConfig;
