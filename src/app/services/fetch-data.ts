import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { EmissionsList } from '../models/emission.model';
import { Vessel } from '../models/vessel.model';

const VESSELS_URL =
  'https://frontendteamfiles.blob.core.windows.net/exercises/vessels.json';
const EMISSIONS_URL =
  'https://frontendteamfiles.blob.core.windows.net/exercises/emissions.json';

@Injectable({
  providedIn: 'root',
})
export class FetchData {
  public httpClient = inject(HttpClient);

  /**
   * One in-flight request; last value replayed to every later subscriber (e.g. revisiting Vessels).
   * `refCount: false` keeps the result for the app lifetime — fine for static exercise JSON.
   */
  private readonly vesselsShared$ = this.httpClient.get<Vessel[]>(VESSELS_URL).pipe(
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  getVessels(): Observable<Vessel[]> {
    return this.vesselsShared$;
  }

  /** Same caching strategy as {@link getVessels} — one fetch, replay for revisits / NgRx. */
  private readonly emissionsShared$ = this.httpClient
    .get<EmissionsList>(EMISSIONS_URL)
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  getEmissions(): Observable<EmissionsList> {
    return this.emissionsShared$;
  }
}
