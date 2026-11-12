import { defineDevTools } from '@whiskmate/shared/testing';
import { currentDeviceHash } from './device-signature';

export const deviceSignatureDevTools = defineDevTools({
  name: 'Device Signature',
  description: 'Tools for inspecting the Device Signature',
  tools: [
    {
      name: 'DeviceSignature.getCurrentHash',
      description: 'Hash of the current device signature',
      inputSchema: {},
      execute: async () => currentDeviceHash(),
    },
  ],
});
