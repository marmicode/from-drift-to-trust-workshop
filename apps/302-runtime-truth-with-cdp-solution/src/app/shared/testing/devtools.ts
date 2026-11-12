import { beforeEach } from 'vitest';

type DevToolsHost = Window & {
  __whiskmateDevToolsListener?: (event: DevToolsToolDiscoveryEvent) => void;
};

/**
 * Exposes tool groups to Chrome DevTools (`chrome-devtools list_3p_developer_tools`).
 *
 * DevTools looks for the listener on `window.parent`, the Vitest page that
 * hosts the test iframe.
 */
export function registerDevTools(toolGroups: DevToolsToolGroup[]) {
  const host: DevToolsHost = window.parent;

  const listener = (event: DevToolsToolDiscoveryEvent) => {
    for (const toolGroup of toolGroups) {
      event.respondWith(toolGroup);
    }
  };

  beforeEach(() => {
    if (host.__whiskmateDevToolsListener) {
      host.removeEventListener(
        'devtoolstooldiscovery',
        host.__whiskmateDevToolsListener,
      );
    }
    host.__whiskmateDevToolsListener = listener;
    host.addEventListener('devtoolstooldiscovery', listener);
  });
}

export function defineDevToolGroup(
  toolGroup: DevToolsToolGroup,
): DevToolsToolGroup {
  return toolGroup;
}

/**
 * Defines a single tool, defaulting `inputSchema` to an empty schema
 * for tools that take no input.
 */
export function defineDevTool<TOOL extends DevToolDefinition>(
  tool: TOOL,
): TOOL & Pick<DevToolsTool, 'inputSchema'> {
  return { ...tool, inputSchema: tool.inputSchema ?? {} };
}

type DevToolDefinition = Omit<DevToolsTool, 'inputSchema'> &
  Partial<Pick<DevToolsTool, 'inputSchema'>>;
