import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import {
  deviceSignatureDevTools,
  mealPlannerDevTools,
} from '@whiskmate/recipe/domain/devtools';
import { registerDevTools } from '@whiskmate/shared/testing';

setupTestBed({
  /* Keeps the last test's injector alive for the dev tools. */
  teardown: { destroyAfterEach: false },
});

registerDevTools([mealPlannerDevTools, deviceSignatureDevTools]);
