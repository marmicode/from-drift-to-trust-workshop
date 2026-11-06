import { Component, computed, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MealPlanner } from '@whiskmate/recipe/domain';
import type { Recipe } from '@whiskmate/shared-recipe/model';

@Component({
  selector: 'wm-recipe-add-button',
  imports: [MatButton],
  template: `
    <button
      mat-flat-button
      type="button"
      [disabled]="!canAdd()"
      (click)="addRecipe()"
    >
      ADD
    </button>
  `,
})
export class RecipeAddButton {
  recipe = input.required<Recipe>();

  private _mealPlanner = inject(MealPlanner);

  protected canAdd = computed(() =>
    this._mealPlanner.canAddRecipe(this.recipe()),
  );

  protected addRecipe() {
    this._mealPlanner.addRecipe(this.recipe());
  }
}
