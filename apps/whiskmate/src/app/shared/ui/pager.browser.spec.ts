import { describe, it } from 'vitest';
import { Pager } from './pager.ng';

describe(Pager.name, () => {
  it.todo('shows the page number', () => {
    // Mount `Pager` with `pageNumber: 2` and `hasNextPage: true`.
    // Assert "Page 2" is shown.
  });

  it.todo('disables previous on the first page', () => {
    // Mount `Pager` with `pageNumber: 1` and `hasNextPage: true`.
    // Assert Previous is disabled.
    // Assert Next is enabled.
  });

  it.todo('disables next when there is no next page', () => {
    // Mount `Pager` with `pageNumber: 2` and `hasNextPage: false`.
    // Assert Next is disabled.
    // Assert Previous is enabled.
  });

  it.todo('emits previous page', () => {
    // Mount `Pager` with `pageNumber: 2` and `hasNextPage: true`.
    // Click Previous.
    // Assert `previousPage` emitted exactly once.
  });

  it.todo('emits next page', () => {
    // Mount `Pager` with `pageNumber: 1` and `hasNextPage: true`.
    // Click Next.
    // Assert `nextPage` emitted exactly once.
  });
});
