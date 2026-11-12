import { Service } from '@angular/core';
import type { Recipe } from '@whiskmate/shared-recipe/model';

/**
 * The core menu is available all year round.
 */
const CORE_MENU_KEYWORDS = [
  'aubergine',
  'brownies',
  'cake',
  'chicken',
  'fritters',
  'hummus',
  'kofte',
  'pie',
  'shakshuka',
];

/**
 * Dishes that join the menu for part of the year, by month (0 = January).
 */
const SEASONAL_KEYWORDS: Record<number, string[]> = {
  0: ['soup', 'stew'],
  1: ['soup', 'stew'],
  2: ['soup'],
  5: ['salad', 'gazpacho'],
  6: ['salad', 'gazpacho', 'granita'],
  7: ['salad', 'granita'],
  10: ['soup', 'stew'],
  11: ['soup', 'stew'],
};

/**
 * Keeps recipes that are not on the current menu out of the plan.
 * ADD buttons stay disabled until the recipe is in season.
 */
@Service()
export class SeasonalAvailabilityPolicy {
  readonly name = 'seasonal-availability';

  allows(recipe: Recipe): boolean {
    const month = new Date().getMonth();
    const keywords = [
      ...CORE_MENU_KEYWORDS,
      ...(SEASONAL_KEYWORDS[month] ?? []),
    ];
    const slug = recipe.name.toLowerCase();
    return keywords.some((keyword) => slug.includes(keyword));
  }
}
