import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vessel } from '../models/vessel.model';
import { HttpClient } from '@angular/common/http';

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
}
