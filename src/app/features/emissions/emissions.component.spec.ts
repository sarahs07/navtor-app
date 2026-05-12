import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import type { Options } from 'highcharts';
import { provideHighcharts } from 'highcharts-angular';
import { EmissionsList } from '../../models/emission.model';
import { EmissionsFacade } from './state/emissions.facade';
import { EmissionsComponent } from './emissions.component';

/** Avoid loading highcharts-angular ESM in Jest (worker parse errors on dynamic import). */
jest.mock('highcharts-angular', () => {
  const { Component, Input } = require('@angular/core');

  @Component({
    selector: 'highcharts-chart',
    standalone: true,
    template: '',
  })
  class HighchartsChartComponent {
    @Input() options: unknown;
  }

  return {
    HighchartsChartComponent,
    provideHighcharts: () => [],
  };
});

describe('EmissionsComponent', () => {
  let fixture: ComponentFixture<EmissionsComponent>;
  let emissionsSubject: BehaviorSubject<EmissionsList | null>;
  let loadingSubject: BehaviorSubject<boolean>;
  let errorSubject: BehaviorSubject<string | null>;
  let facadeMock: {
    emissions$: ReturnType<typeof emissionsSubject.asObservable>;
    loading$: ReturnType<typeof loadingSubject.asObservable>;
    error$: ReturnType<typeof errorSubject.asObservable>;
    loadEmissions: jest.Mock;
  };

  const mockEmissions: EmissionsList = [
    {
      id: 10001,
      timeSeries: [
        {
          report_from_utc: '2023-01-01T00:00:00Z',
          report_to_utc: '2023-01-02T00:00:00',
          co2_emissions: 94.05,
          sox_emissions: 1.62,
          nox_emissions: 2.8,
          pm_emissions: 0.37,
          ch4_emissions: 1.51,
        },
        {
          report_from_utc: '2023-01-02T00:00:00Z',
          report_to_utc: '2023-01-03T00:00:00',
          co2_emissions: 80,
          sox_emissions: 1,
          nox_emissions: 2,
          pm_emissions: 0.3,
          ch4_emissions: 1.2,
        },
      ],
    },
    {
      id: 10002,
      timeSeries: [
        {
          report_from_utc: '2023-01-01T00:00:00Z',
          report_to_utc: '2023-01-02T00:00:00',
          co2_emissions: 50,
          sox_emissions: 0.5,
          nox_emissions: 1,
          pm_emissions: 0.1,
          ch4_emissions: 0.5,
        },
      ],
    },
  ];

  beforeEach(async () => {
    emissionsSubject = new BehaviorSubject<EmissionsList | null>(null);
    loadingSubject = new BehaviorSubject(false);
    errorSubject = new BehaviorSubject<string | null>(null);
    facadeMock = {
      emissions$: emissionsSubject.asObservable(),
      loading$: loadingSubject.asObservable(),
      error$: errorSubject.asObservable(),
      loadEmissions: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [EmissionsComponent],
      providers: [
        { provide: EmissionsFacade, useValue: facadeMock },
        provideHighcharts(),
      ],
      // Disables animate.enter / animate.leave in tests (replaces deprecated provideNoopAnimations).
      animationsEnabled: false,
    }).compileComponents();

    fixture = TestBed.createComponent(EmissionsComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call loadEmissions on init', () => {
    expect(facadeMock.loadEmissions).toHaveBeenCalledTimes(1);
  });

  it('should show loading text when loading$ is true', () => {
    loadingSubject.next(true);
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).textContent,
    ).toContain('Loading');
  });

  it('should show error when error$ emits', () => {
    errorSubject.next('Network failed');
    fixture.detectChanges();
    const alert = (fixture.nativeElement as HTMLElement).querySelector(
      '[role="alert"]',
    );
    expect(alert?.textContent).toContain('Network failed');
  });

  it('should render vessel dropdown and chart when data is present', async () => {
    emissionsSubject.next(mockEmissions);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('mat-form-field')).toBeTruthy();
    expect(el.querySelector('mat-select')).toBeTruthy();
    expect(el.querySelector('highcharts-chart')).toBeTruthy();

    // Options render in the CDK overlay (document body), not inside the fixture root.
    const selectEl = fixture.debugElement.query(By.css('mat-select'));
    selectEl.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const options = document.querySelectorAll(
      '.cdk-overlay-container mat-option',
    );
    expect(options.length).toBe(2);
    expect(options[0].textContent?.trim()).toContain('10001');
    expect(options[1].textContent?.trim()).toContain('10002');
  });

  it('should auto-select first vessel and build CO₂ + NOx series', () => {
    emissionsSubject.next(mockEmissions);
    fixture.detectChanges();

    const instance = fixture.componentInstance as unknown as {
      selectedVesselId: () => number | null;
      chartOptions: () => Options;
    };

    expect(instance.selectedVesselId()).toBe(10001);

    const opts = instance.chartOptions();
    const series = opts.series ?? [];
    expect(series).toHaveLength(2);
    expect(series.map((s) => ('name' in s ? s.name : ''))).toEqual([
      'CO₂',
      'NOx',
    ]);

    const co2 = series[0] as { data?: [number, number][] };
    expect(co2.data).toHaveLength(2);
    expect(co2.data?.[0][1]).toBe(94.05);
  });

  it('should update selected vessel when onVesselSelected runs', () => {
    emissionsSubject.next(mockEmissions);
    fixture.detectChanges();

    const instance = fixture.componentInstance as unknown as {
      onVesselSelected: (id: number) => void;
      selectedVesselId: () => number | null;
      chartOptions: () => Options;
    };

    instance.onVesselSelected(10002);
    fixture.detectChanges();

    expect(instance.selectedVesselId()).toBe(10002);
    expect(instance.chartOptions().title?.text).toContain('10002');

    const series = (instance.chartOptions().series ?? []) as {
      data?: [number, number][];
    }[];
    expect(series[0].data).toHaveLength(1);
  });
});
