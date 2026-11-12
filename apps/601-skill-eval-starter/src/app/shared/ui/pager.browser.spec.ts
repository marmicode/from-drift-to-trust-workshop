import { inputBinding, outputBinding } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Pager } from './pager.ng';

describe(Pager, () => {
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
    const { previousPage, previousButton } = mountPager({
      pageNumber: 2,
      hasNextPage: true,
    });

    await previousButton.click();

    expect(previousPage).toHaveBeenCalledOnce();
  });

  it('emits next page', async () => {
    const { nextPage, nextButton } = mountPager({
      pageNumber: 1,
      hasNextPage: true,
    });

    await nextButton.click();

    expect(nextPage).toHaveBeenCalledOnce();
  });
});

function mountPager({
  pageNumber,
  hasNextPage,
}: {
  pageNumber: number;
  hasNextPage: boolean;
}) {
  const previousPage = vi.fn();
  const nextPage = vi.fn();

  TestBed.createComponent(Pager, {
    bindings: [
      inputBinding('pageNumber', () => pageNumber),
      inputBinding('hasNextPage', () => hasNextPage),
      outputBinding('previousPage', previousPage),
      outputBinding('nextPage', nextPage),
    ],
  });

  return {
    previousPage,
    nextPage,
    previousButton: page.getByRole('button', { name: 'Previous' }),
    nextButton: page.getByRole('button', { name: 'Next' }),
  };
}
