import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmissionsList } from '../models/emission.model';
import { Vessel } from '../models/vessel.model';

@Injectable({
  providedIn: 'root',
})
export class FetchData {
  public httpClient = inject(HttpClient);

  getVessels(): Observable<Vessel[]> {
    return this.httpClient.get<Vessel[]>(
      'https://frontendteamfiles.blob.core.windows.net/exercises/vessels.json',
    );
  }

  getEmissions(): Observable<EmissionsList> {
    return this.httpClient.get<EmissionsList>(
      'https://frontendteamfiles.blob.core.windows.net/exercises/emissions.json',
    );
  }
}
