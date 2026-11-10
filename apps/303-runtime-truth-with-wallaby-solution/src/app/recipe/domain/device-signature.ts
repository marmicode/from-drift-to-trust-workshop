/**
 * Builds a coarse runtime profile from ambient browser signals.
 * Used to gate meal plan actions for restricted client environments.
 */
export function collectDeviceSignature(): string {
  const nav = globalThis.navigator;
  const screen = globalThis.screen;

  const segments = [
    nav?.userAgent ?? '',
    nav?.language ?? '',
    nav?.languages?.join(',') ?? '',
    nav?.platform ?? '',
    nav?.vendor ?? '',
    nav?.hardwareConcurrency?.toString() ?? '',
    nav?.maxTouchPoints?.toString() ?? '',
    nav?.cookieEnabled?.toString() ?? '',
    screen?.width?.toString() ?? '',
    screen?.height?.toString() ?? '',
    screen?.availWidth?.toString() ?? '',
    screen?.availHeight?.toString() ?? '',
    screen?.colorDepth?.toString() ?? '',
    screen?.pixelDepth?.toString() ?? '',
    globalThis.innerWidth?.toString() ?? '',
    globalThis.innerHeight?.toString() ?? '',
    globalThis.devicePixelRatio?.toString() ?? '',
    resolveTimeZone(),
    resolveViewportClass(),
  ];

  return segments.join('␞');
}

export function hashDeviceSignature(signature: string): string {
  let hash = 2_166_136_261;

  for (let index = 0; index < signature.length; index++) {
    hash ^= signature.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }

  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function currentDeviceHash(): string {
  return hashDeviceSignature(collectDeviceSignature());
}

function resolveTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  } catch {
    return '';
  }
}

function resolveViewportClass(): string {
  if (typeof globalThis.matchMedia !== 'function') {
    return 'unknown';
  }

  if (globalThis.matchMedia('(max-width: 767px)').matches) {
    return 'compact';
  }

  if (globalThis.matchMedia('(min-width: 768px)').matches) {
    return 'wide';
  }

  return 'unknown';
}
