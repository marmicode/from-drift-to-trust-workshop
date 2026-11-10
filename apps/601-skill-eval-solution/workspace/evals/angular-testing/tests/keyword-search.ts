import type { TestCase } from 'promptfoo';

export default {
  description: 'tests a debounce with fake timers',
  vars: {
    request:
      'Write tests for KeywordSearch. The debounce is the behavior under test: cover both before and after the delay.',
  },
  assert: [
    {
      type: 'regex',
      metric: 'fake-timers',
      value: String.raw`\bvi\.useFakeTimers\(`,
    },
    {
      type: 'regex',
      metric: 'async-advance',
      value: String.raw`\badvanceTimersByTimeAsync\(`,
    },
    {
      type: 'regex',
      metric: 'output-binding',
      /* Also matches `outputBinding<string>(`. */
      value: String.raw`\boutputBinding\s*(<[^>]*>)?\s*\(`,
    },
    {
      type: 'not-regex',
      metric: 'no-zone-timers',
      value: String.raw`\bfakeAsync\b|\btick\(|\bvi\.advanceTimersByTime\(`,
    },
    {
      type: 'llm-rubric',
      metric: 'both-sides-of-the-delay',
      value: `The output is a spec for KeywordSearch.
Fake timers are installed before the component is created, and real timers are restored when the test finishes.
One test advances to just before 300ms and expects that nothing was emitted yet.
Another advances past 300ms and expects the literal keywords the user typed.
Advancing by exactly 300ms fails.`,
    },
  ],
} satisfies TestCase;
