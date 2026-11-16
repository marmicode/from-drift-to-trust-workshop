import { inputBinding, outputBinding } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { Pager } from './pager.ng';

describe(Pager.name, () => {
  it('shows the page number', async () => {
    mountPager({ pageNumber: 2, hasNextPage: true });

    await expect.element(page.getByText('Page 2')).toBeVisible();
  });

  it('disables previous on the first page', async () => {
    const { previousButton, nextButton } = mountPager({
      pageNumber: 1,
      hasNextPage: true,
    });

    await expect.element(previousButton).toBeDisabled();
    await expect.element(nextButton).toBeEnabled();
  });

  it('disables next when there is no next page', async () => {
    const { previousButton, nextButton } = mountPager({
      pageNumber: 2,
      hasNextPage: false,
    });

    await expect.element(nextButton).toBeDisabled();
    await expect.element(previousButton).toBeEnabled();
  });

  it('emits previous page', async () => {
    const { previousButton, previousPage } = mountPager({
      pageNumber: 2,
      hasNextPage: true,
    });

    await previousButton.click();

    expect(previousPage).toHaveBeenCalledTimes(1);
  });

  it('emits next page', async () => {
    const { nextButton, nextPage } = mountPager({
      pageNumber: 1,
      hasNextPage: true,
    });

    await nextButton.click();

    expect(nextPage).toHaveBeenCalledTimes(1);
  });
});

function mountPager({
  pageNumber,
  hasNextPage,
}: {
  pageNumber: number;
  hasNextPage: boolean;
}) {
  const previousPage = vi.fn<() => void>();
  const nextPage = vi.fn<() => void>();

  TestBed.createComponent(Pager, {
    bindings: [
      inputBinding('pageNumber', () => pageNumber),
      inputBinding('hasNextPage', () => hasNextPage),
      outputBinding('previousPage', previousPage),
      outputBinding('nextPage', nextPage),
    ],
  });

  return {
    previousButton: page.getByRole('button', { name: 'Previous' }),
    nextButton: page.getByRole('button', { name: 'Next' }),
    previousPage,
    nextPage,
  };
}
