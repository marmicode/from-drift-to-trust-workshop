/**
 * Third-party developer tools that Chrome DevTools discovers by dispatching
 * a `devtoolstooldiscovery` event on the page (see `chrome-devtools-mcp`,
 * which ships no types).
 */
interface DevToolsTool {
  name: string;
  description: string;
  inputSchema: object;
  execute(params: Record<string, unknown>): Promise<unknown>;
}

interface DevToolsToolGroup {
  name: string;
  description?: string;
  tools: DevToolsTool[];
}

interface DevToolsToolDiscoveryEvent extends Event {
  respondWith(toolGroup: DevToolsToolGroup): void;
}

interface WindowEventMap {
  devtoolstooldiscovery: DevToolsToolDiscoveryEvent;
}
