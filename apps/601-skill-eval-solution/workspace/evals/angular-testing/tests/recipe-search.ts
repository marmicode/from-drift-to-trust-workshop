import type { TestCase } from 'promptfoo';

export default {
  description: 'tests a component through the DOM',
  vars: {
    request: 'Write tests for the RecipeSearch component.',
  },
  assert: [
    {
      type: 'contains',
      metric: 'browser-mode',
      value: 'recipe-search.browser.spec.ts',
    },
    {
      type: 'regex',
      metric: 'locators',
      value: String.raw`\bpage\.getBy`,
    },
    {
      type: 'regex',
      metric: 'retrying-assertions',
      value: String.raw`\bexpect\.element\(`,
    },
    {
      type: 'not-regex',
      metric: 'no-fixture',
      value: String.raw`\.detectChanges\(|\.componentInstance\b|\.nativeElement\b|querySelector`,
    },
    {
      type: 'llm-rubric',
      metric: 'fake-repository-asserted-on-screen',
      value: `The output is a spec for RecipeSearch, and possibly a fake.
RecipeRepository is replaced by an in-memory fake, arranged before the component is mounted.
A vi.fn() stub, a spy object, or HttpTestingController fails.
The spec asserts the recipe names the user sees in headings, and the "No recipes found" copy.
Reading a component property or calling a component method fails.`,
    },
  ],
} satisfies TestCase;
