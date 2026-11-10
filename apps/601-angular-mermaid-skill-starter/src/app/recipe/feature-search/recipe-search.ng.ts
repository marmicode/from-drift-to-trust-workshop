import {
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RecipeAddButton } from '@whiskmate/recipe/feature-add-button';
import {
  createRecipeSearchParams,
  RecipeRepository,
  type RecipeSearchParams,
} from '@whiskmate/recipe/infra';
import {
  createDefaultRecipeFilterCriteria,
  type RecipeFilterCriteria,
} from '@whiskmate/recipe/model';
import { RecipePreview } from '@whiskmate/recipe/ui';
import { NoRecipes, RecipeFilter } from '@whiskmate/recipe/ui-search';
import { Catalog, Pager } from '@whiskmate/shared/ui';

const PAGE_SIZE = 4;

@Component({
  selector: 'wm-recipe-search',
  imports: [
    Catalog,
    NoRecipes,
    Pager,
    RecipeAddButton,
    RecipeFilter,
    RecipePreview,
  ],
  template: `
    <wm-recipe-filter (filterChange)="filter.set($event)" />
    <wm-catalog>
      @if (recipes(); as recipes) {
        @if (recipes.length === 0) {
          <wm-no-recipes />
        } @else {
          @for (recipe of recipes; track recipe.id) {
            <wm-recipe-preview [recipe]="recipe">
              <wm-recipe-add-button [recipe]="recipe" />
            </wm-recipe-preview>
          }
        }
      }
    </wm-catalog>
    @if (recipes()?.length) {
      <wm-pager
        [pageNumber]="pageNumber()"
        [hasNextPage]="hasNextPage()"
        (previousPage)="previousPage()"
        (nextPage)="nextPage()"
      />
    }
  `,
  styles: `
    :host {
      display: block;
      padding: 1.5rem;
    }
  `,
})
export class RecipeSearch {
  filter = signal<RecipeFilterCriteria>(createDefaultRecipeFilterCriteria());

  /* Goes back to the first page whenever the filter changes. */
  offset = linkedSignal({ source: this.filter, computation: () => 0 });

  pageNumber = computed(() => this.offset() / PAGE_SIZE + 1);

  private _recipeRepository = inject(RecipeRepository);

  /* One recipe more than the page size tells whether there is a next page. */
  private _recipes = rxResource({
    params: () => ({
      ...toRecipeSearchParams(this.filter()),
      offset: this.offset(),
      limit: PAGE_SIZE + 1,
    }),
    stream: ({ params }) => this._recipeRepository.search(params),
  });

  recipes = computed(() =>
    this._recipes.hasValue()
      ? this._recipes.value().slice(0, PAGE_SIZE)
      : undefined,
  );

  hasNextPage = computed(
    () => this._recipes.hasValue() && this._recipes.value().length > PAGE_SIZE,
  );

  nextPage() {
    this.offset.update((offset) => offset + PAGE_SIZE);
  }

  previousPage() {
    this.offset.update((offset) => Math.max(0, offset - PAGE_SIZE));
  }
}

function toRecipeSearchParams({
  keywords,
  maxIngredientCount,
  maxStepCount,
  courses,
}: RecipeFilterCriteria): RecipeSearchParams {
  return createRecipeSearchParams({
    keywords,
    maxIngredientCount,
    maxStepCount,
    ...(courses != null ? { courses } : {}),
  });
}
