import { defineTestCase } from '../../shared/config.ts';
import {
  component,
  diagramAssertions,
  mermaidContains,
  mermaidOmits,
} from '../assertions.ts';

export default defineTestCase({
  description: 'draws inputs and outputs between components',
  vars: {
    request: 'Draw a Mermaid diagram of how pagination works in RecipeSearch.',
  },
  assert: [
    ...diagramAssertions({ maxNodes: 5 }),
    /* TODO: check that `Pager` is a component, that `pageNumber` is on a
       solid input arrow, and that `previousPage` and `nextPage` share one
       dotted output arrow. Then add an `llm-rubric` for what a regex can't
       see. */
  ],
});
