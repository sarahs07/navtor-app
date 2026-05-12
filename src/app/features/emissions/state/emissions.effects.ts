import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { FetchData } from '../../../services/fetch-data';
import { emissionsPageActions } from './emissions.actions';

@Injectable()
export class EmissionsEffects {
  private readonly actions$ = inject(Actions);
  private readonly fetchData = inject(FetchData);

  readonly loadEmissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(emissionsPageActions.loadEmissions),
      mergeMap(() =>
        this.fetchData.getEmissions().pipe(
          map((emissions) =>
            emissionsPageActions.loadEmissionsSuccess({ emissions }),
          ),
          catchError((e: unknown) =>
            of(
              emissionsPageActions.loadEmissionsFailure({
                error:
                  e instanceof Error ? e.message : 'Failed to load emissions',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
