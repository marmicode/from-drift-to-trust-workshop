import { defineDevTool } from './devtools';

describe(defineDevTool.name, () => {
  it('adds an empty input schema when missing', () => {
    const execute = async () => 'result';

    const tool = defineDevTool({
      name: 'Test.tool',
      description: 'Test tool',
      execute,
    });

    expect(tool).toEqual({
      name: 'Test.tool',
      description: 'Test tool',
      inputSchema: {},
      execute,
    });
  });

  it('keeps the input schema when provided', () => {
    const inputSchema = {
      type: 'object',
      properties: { id: { type: 'string' } },
    };

    const tool = defineDevTool({
      name: 'Test.tool',
      description: 'Test tool',
      inputSchema,
      execute: async () => 'result',
    });

    expect(tool.inputSchema).toBe(inputSchema);
  });
});
