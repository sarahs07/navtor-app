import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColDef } from 'ag-grid-community';
import { of } from 'rxjs';
import { FetchData } from '../../services/fetch-data';
import { Vessel } from '../../models/vessel.model';
import { VesselsComponent } from './vessels.component';

describe('VesselsComponent', () => {
  let fixture: ComponentFixture<VesselsComponent>;
  let fetchDataMock: { getVessels: jest.Mock };

  const mockVessels: Vessel[] = [
    {
      id: 10001,
      name: 'MS Alpha',
      mmsi: 999999901,
      imo: 1023401,
      companyId: 2301,
      companyName: 'Alpha Company',
      startDate: '1998-01-01T00:00:00Z',
      active: true,
      vesselType: 'Dry Cargo',
    },
  ];

  beforeEach(async () => {
    fetchDataMock = {
      getVessels: jest.fn().mockReturnValue(of(mockVessels)),
    };

    await TestBed.configureTestingModule({
      imports: [VesselsComponent],
      providers: [{ provide: FetchData, useValue: fetchDataMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(VesselsComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should request vessels from FetchData', () => {
    expect(fetchDataMock.getVessels).toHaveBeenCalledTimes(1);
  });

  it('should expose loaded vessels on the vessels signal', () => {
    const instance = fixture.componentInstance as unknown as {
      vessels: () => Vessel[];
    };
    expect(instance.vessels()).toEqual(mockVessels);
  });

  it('should configure AG Grid columns for vessel fields', () => {
    const columnDefs = (
      fixture.componentInstance as unknown as {
        columnDefs: ColDef<Vessel>[];
      }
    ).columnDefs;
    const fields = columnDefs.map((c) => c.field);
    expect(fields).toEqual([
      'name',
      'mmsi',
      'imo',
      'companyName',
      'vesselType',
    ]);
  });

  it('should enable sort, filter, and resize on default column def', () => {
    const defaultColDef = (
      fixture.componentInstance as unknown as {
        defaultColDef: ColDef;
      }
    ).defaultColDef;
    expect(defaultColDef.sortable).toBe(true);
    expect(defaultColDef.filter).toBe(true);
    expect(defaultColDef.resizable).toBe(true);
  });

  it('should render title and ag-grid host', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Vessels');
    expect(el.querySelector('ag-grid-angular')).toBeTruthy();
  });
});
