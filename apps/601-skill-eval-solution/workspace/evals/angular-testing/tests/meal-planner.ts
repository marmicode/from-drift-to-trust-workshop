import type { TestCase } from 'promptfoo';

export default {
  description: 'fakes the repository and keeps the store real',
  vars: {
    request: 'Write tests for the MealPlanner service.',
  },
  assert: [
    {
      type: 'regex',
      metric: 'injected-through-testbed',
      value: String.raw`TestBed\.inject\(MealPlanner\)`,
    },
    {
      type: 'not-regex',
      metric: 'no-constructor',
      value: String.raw`\bnew MealPlanner\(`,
    },
    {
      type: 'not-regex',
      metric: 'no-mocks',
      value: String.raw`vi\.mock\(|vi\.spyOn\(|useValue|HttpTestingController`,
    },
    {
      type: 'llm-rubric',
      metric: 'fake-repository-real-store',
      value: `The output is a spec for MealPlanner, and possibly other files.
MealRepository is replaced by an in-memory fake class that implements the same methods.
A vi.fn() stub, a spy object, or HttpTestingController fails.
MealStore is the real one: replacing it with a fake, a stub, or useValue fails.
One test rejects a duplicate recipe and expects the literal message "Can't add recipe.".`,
    },
  ],
} satisfies TestCase;
