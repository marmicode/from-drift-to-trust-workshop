import type { TestCase } from 'promptfoo';
import { diagramAssertions, mermaidContains } from '../assertions.ts';

export default {
  description: 'colors what a change adds and modifies',
  vars: {
    request: `Add a meal plan panel next to the recipe search.
It lists the planned recipes, each with a REMOVE button.
Draw the change before you write any code.`,
  },
  assert: [
    ...diagramAssertions(),
    {
      type: 'javascript',
      metric: 'new-class',
      value: mermaidContains(/^\s*classDef new\b/m),
    },
    {
      type: 'javascript',
      metric: 'new-component',
      value: mermaidContains(/\w+\[\[\w+\]\]:::new\b/),
    },
    {
      type: 'javascript',
      metric: 'colored-arrows',
      value: mermaidContains(/^\s*linkStyle\s+\d/m),
    },
    {
      type: 'llm-rubric',
      metric: 'new-changed-and-context',
      value: `The output plans the meal plan panel with a Mermaid diagram, and writes no code.
The new panel components are marked new, and MealPlanner is marked changed because it needs a way to remove a recipe.
Components that do not change, such as RecipeSearch or RecipeFilter, are either absent or left uncolored.
One sentence tells what the colors mean.`,
    },
  ],
} satisfies TestCase;
