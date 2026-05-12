import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { EmissionsEffects } from './features/emissions/state/emissions.effects';
import { emissionsFeature } from './features/emissions/state/emissions.reducer';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'vessels' },
  {
    path: 'vessels',
    loadComponent: () =>
      import('./features/vessels/vessels.component').then(
        (m) => m.VesselsComponent,
      ),
  },
  {
    path: 'emissions',
    loadComponent: () =>
      import('./features/emissions/emissions.component').then(
        (m) => m.EmissionsComponent,
      ),
    providers: [
      provideState(emissionsFeature),
      provideEffects(EmissionsEffects),
    ],
  },
  { path: '**', redirectTo: 'vessels' },
];
