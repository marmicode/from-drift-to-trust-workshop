import { Component, input, output } from '@angular/core';

@Component({
  selector: 'wm-pager',
  template: `
    <button [disabled]="pageNumber() === 1" (click)="previousPage.emit()">Previous</button>
    <span>Page {{ pageNumber() }}</span>
    <button [disabled]="!hasNextPage()" (click)="nextPage.emit()">Next</button>
  `,
})
export class Pager {
  pageNumber = input.required<number>();
  hasNextPage = input.required<boolean>();
  previousPage = output<void>();
  nextPage = output<void>();
}
