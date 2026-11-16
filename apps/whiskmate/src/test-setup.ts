import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

/* Same global styles as the `build` target in `project.json`. */
import './material-theme.scss';
import './styles.css';

setupTestBed({
  teardown: { destroyAfterEach: false },
});
