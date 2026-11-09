import { defineDevTools } from '@whiskmate/testing';
import { currentDeviceHash } from './device-signature';

export const deviceSignatureDevTools = defineDevTools({
  name: 'Device Profile',
  description: 'Tools for inspecting the Device Profile',
  tools: [
    {
      name: 'DeviceProfile.getCurrentHash',
      description: 'Hash of the current device profile',
      inputSchema: {},
      execute: async () => currentDeviceHash(),
    },
  ],
});
