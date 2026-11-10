import type { TestCase } from 'promptfoo';
import {
  component,
  diagramAssertions,
  mermaidContains,
  service,
} from '../assertions.ts';

/* No "diagram" or "Mermaid" in the request: the skill's description must be
   enough for the agent to load it. */
export default {
  description: 'draws a diagram to explain a flow without being asked',
  vars: {
    request: 'Explain how clicking ADD reaches MealPlanner.',
  },
  assert: [
    ...diagramAssertions({ maxNodes: 5 }),
    {
      type: 'javascript',
      metric: 'add-button-is-a-component',
      value: mermaidContains(component('RecipeAddButton')),
    },
    {
      type: 'javascript',
      metric: 'meal-planner-is-a-service',
      value: mermaidContains(service('MealPlanner')),
    },
    {
      type: 'javascript',
      metric: 'recipe-input',
      value: mermaidContains(/-->\s*\|"\[recipe: Recipe\]"\|/),
    },
    {
      type: 'llm-rubric',
      metric: 'input-from-the-binding-template',
      value: `The output explains how the ADD button reaches MealPlanner, with a Mermaid diagram.
The arrow carrying the recipe input to RecipeAddButton starts from RecipeSearch, the component whose template binds it, not from RecipePreview.
The arrow from RecipeAddButton to MealPlanner is solid. If it has a label, the label names addRecipe.`,
    },
  ],
} satisfies TestCase;
