import { defineDevTool, defineDevToolGroup } from '@whiskmate/shared/testing';
import { currentDeviceHash } from './device-signature';

export const deviceSignatureDevTools = defineDevToolGroup({
  name: 'Device Signature',
  description: 'Tools for inspecting the Device Signature',
  tools: [
    defineDevTool({
      name: 'DeviceSignature.getCurrentHash',
      description: 'Hash of the current device signature',
      execute: async () => currentDeviceHash(),
    }),
  ],
});
