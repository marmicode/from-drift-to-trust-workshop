import {
  defineClaudeCodeOptions,
  defineUnifiedConfig,
} from '../shared/config.ts';
import { BASELINE_DIR, WITH_SKILL_DIR } from './hooks.ts';
import pagination from './tests/pagination.ts';

/* Without a key, Claude Code falls back to your login. promptfoo then skips
   its cache, so a key is required whenever there is one, and always on CI. */
const apiKeyRequired = !!process.env.CI || !!process.env.ANTHROPIC_API_KEY;

const HAIKU = 'claude-haiku-5-5';

export default defineUnifiedConfig({
  description: 'angular-mermaid skill',
  /* Records a span per turn and tool call, shown in the result's Traces tab. */
  tracing: { enabled: true },
  prompts: ['{{request}}'],
  providers: [
    /* TODO: add a `with-skill` and a `baseline` provider. Both are
       `anthropic:claude-agent-sdk` with `_sharedOptions()`. */
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
        config: { apiKeyRequired, showThinking: false },
      },
    },
  },
  /* One file per case in `tests/`, imported here. */
  tests: [pagination],
});

/**
 * Options both providers share. No `allow_all_tools`: the agent only gets
 * read-only tools. It replies with the diagram, so its answer can be cached
 * and graded as text.
 */
function _sharedOptions() {
  return defineClaudeCodeOptions({
    apiKeyRequired,
    model: HAIKU,
    max_turns: 20,
    /* Per test, so one runaway case cannot drain the shared key. */
    max_budget_usd: 0.3,
  });
}
