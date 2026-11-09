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

export function defineDevTools(
  toolGroup: DevToolsToolGroup,
): DevToolsToolGroup {
  return toolGroup;
}
