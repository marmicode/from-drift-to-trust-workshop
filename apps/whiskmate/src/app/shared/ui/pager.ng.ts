import { Component, input, output } from '@angular/core';

/**
 * @deprecated 🚧 work in progress
 */
@Component({
  selector: 'wm-pager',
  template: `Pager - 🚧 work in progress`,
})
export class Pager {
  pageNumber = input.required<number>();
  hasNextPage = input.required<boolean>();
  previousPage = output<void>();
  nextPage = output<void>();
}
