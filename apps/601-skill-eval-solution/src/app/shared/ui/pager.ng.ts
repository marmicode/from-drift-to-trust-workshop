import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'wm-pager',
  imports: [MatButton],
  host: {
    role: 'navigation',
    'aria-label': 'Pagination',
  },
  template: `
    <button
      mat-stroked-button
      type="button"
      [disabled]="pageNumber() === 1"
      (click)="previousPage.emit()"
    >
      Previous
    </button>
    <span>Page {{ pageNumber() }}</span>
    <button
      mat-stroked-button
      type="button"
      [disabled]="!hasNextPage()"
      (click)="nextPage.emit()"
    >
      Next
    </button>
  `,
  styles: `
    :host {
      align-items: center;
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
  `,
})
export class Pager {
  pageNumber = input.required<number>();
  hasNextPage = input.required<boolean>();

  previousPage = output();
  nextPage = output();
}
