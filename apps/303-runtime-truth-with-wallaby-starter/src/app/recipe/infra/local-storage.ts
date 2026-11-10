import { Service } from '@angular/core';

/**
 * The browser's local storage, injected so that tests can replace it.
 */
@Service({ factory: () => globalThis.localStorage })
export abstract class LocalStorage {
  abstract getItem(key: string): string | null;

  abstract setItem(key: string, value: string): void;
}
