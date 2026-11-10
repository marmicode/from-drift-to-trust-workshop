import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

setupTestBed({
  /* Keeps the last test's injector alive for the dev tools. */
  teardown: { destroyAfterEach: false },
});
