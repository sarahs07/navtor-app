import { Route } from '@angular/router';

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
  },
  { path: '**', redirectTo: 'vessels' },
];
