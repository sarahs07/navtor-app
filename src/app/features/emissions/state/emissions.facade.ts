import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { emissionsPageActions } from './emissions.actions';
import { emissionsFeature } from './emissions.reducer';

/**
 * Thin API over the emissions store slice: components depend on this instead of
 * dispatching actions and wiring selectors directly.
 */
@Injectable({ providedIn: 'root' })
export class EmissionsFacade {
  private readonly store = inject(Store);

  readonly emissions$ = this.store.select(emissionsFeature.selectEmissions);
  readonly loading$ = this.store.select(emissionsFeature.selectLoading);
  readonly error$ = this.store.select(emissionsFeature.selectError);

  loadEmissions(): void {
    this.store.dispatch(emissionsPageActions.loadEmissions());
  }
}
