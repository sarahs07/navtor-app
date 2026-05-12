import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    // No root feature keys — register slices with provideState on routes or lazy providers.
    provideStore({}),
    provideEffects(),
    ...(isDevMode()
      ? [
          provideStoreDevtools({
            maxAge: 25,
            trace: false,
            traceLimit: 75,
            connectInZone: true,
          }),
        ]
      : []),
  ],
};
