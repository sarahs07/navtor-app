import { TestBed } from '@angular/core/testing';

import { FetchData } from './fetch-data';

describe('FetchData', () => {
  let service: FetchData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
