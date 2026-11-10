import type { TestCase } from 'promptfoo';
import {
  component,
  diagramAssertions,
  mermaidContains,
  mermaidOmits,
} from '../assertions.ts';

export default {
  description: 'draws inputs and outputs between components',
  vars: {
    request: 'Draw a Mermaid diagram of how pagination works in RecipeSearch.',
  },
  assert: [
    ...diagramAssertions({ maxNodes: 5 }),
    {
      type: 'javascript',
      metric: 'pager-is-a-component',
      value: mermaidContains(component('Pager')),
    },
    {
      type: 'javascript',
      metric: 'inputs-on-solid-arrow',
      value: mermaidContains(/-->\s*\|"\[[^"]*\bpageNumber\b[^"]*\]"\|/),
    },
    {
      type: 'javascript',
      metric: 'outputs-on-dotted-arrow',
      value: mermaidContains(/-\.->\s*\|"\([^"]*\bnextPage\b[^"]*\)"\|/),
    },
    {
      type: 'javascript',
      metric: 'one-arrow-per-direction',
      value: mermaidOmits(/\|"\(\s*(?:previousPage|nextPage)\s*\)"\|/),
    },
    {
      type: 'llm-rubric',
      metric: 'answers-the-question',
      value: `The output is about how pagination works in RecipeSearch, with a Mermaid diagram.
RecipeSearch passes pageNumber and hasNextPage to Pager in one input arrow.
Pager emits previousPage and nextPage back to RecipeSearch in one dotted output arrow, without payload types.
The diagram leaves out RecipePreview and RecipeAddButton: they play no part in pagination.`,
    },
  ],
} satisfies TestCase;
