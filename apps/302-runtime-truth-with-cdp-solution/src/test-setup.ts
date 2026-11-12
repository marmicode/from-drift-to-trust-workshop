import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { mealPlannerDevTools } from '@whiskmate/recipe/domain/devtools';
import { deviceSignatureDevTools } from '@whiskmate/recipe/infra/devtools';
import { registerDevTools } from '@whiskmate/shared/testing';

/* Same global styles as the `build` target in `project.json`. */
import './material-theme.scss';
import './styles.css';

setupTestBed({
  /* Keeps the last test's injector alive for the dev tools. */
  teardown: { destroyAfterEach: false },
});

registerDevTools([mealPlannerDevTools, deviceSignatureDevTools]);
