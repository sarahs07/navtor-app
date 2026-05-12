import { AsyncPipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import type { Options } from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';
import { EmissionsList } from '../../models/emission.model';
import { EmissionsFacade } from './state/emissions.facade';

@Component({
  selector: 'app-emissions',
  standalone: true,
  imports: [
    AsyncPipe,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    HighchartsChartComponent,
  ],
  templateUrl: './emissions.component.html',
  styleUrl: './emissions.component.scss',
})
export class EmissionsComponent implements OnInit {
  private readonly emissionsFacade = inject(EmissionsFacade);

  protected readonly emissions$ = this.emissionsFacade.emissions$;
  protected readonly loading$ = this.emissionsFacade.loading$;
  protected readonly error$ = this.emissionsFacade.error$;

  /** Loaded records as a signal for chart + vessel selection. */
  protected readonly records = toSignal(this.emissionsFacade.emissions$, {
    initialValue: null as EmissionsList | null,
  });

  protected readonly selectedVesselId = signal<number | null>(null);

  protected readonly chartOptions = computed<Options>(() => {
    const records = this.records();
    const vesselId = this.selectedVesselId();
    const base: Options = {
      chart: { type: 'line', backgroundColor: 'transparent' },
      title: {
        text: vesselId !== null ? `Vessel ${vesselId} — emissions` : 'Vessel emissions',
        style: { color: '#e8eaed', fontSize: '16px' },
      },
      credits: { enabled: false },
      legend: {
        enabled: true,
        itemStyle: { color: '#e8eaed' },
      },
      xAxis: {
        type: 'datetime',
        title: { text: 'Time (UTC)', style: { color: '#9aa0a6' } },
        labels: { style: { color: '#9aa0a6' } },
        gridLineColor: 'rgba(255,255,255,0.08)',
      },
      yAxis: {
        title: { text: 'Emissions', style: { color: '#9aa0a6' } },
        labels: { style: { color: '#9aa0a6' } },
        gridLineColor: 'rgba(255,255,255,0.08)',
      },
      tooltip: {
        shared: true,
        valueDecimals: 2,
      },
      series: [],
    };

    if (!records?.length || vesselId === null) {
      return base;
    }

    const vessel = records.find((r) => r.id === vesselId);
    if (!vessel?.timeSeries?.length) {
      return base;
    }

    const toPoints = (pick: 'co2_emissions' | 'nox_emissions') =>
      vessel.timeSeries.map((p) => [
        Date.parse(p.report_from_utc),
        p[pick],
      ] as [number, number]);

    base.series = [
      { type: 'line', name: 'CO₂', data: toPoints('co2_emissions') },
      { type: 'line', name: 'NOx', data: toPoints('nox_emissions') },
    ];

    return base;
  });

  constructor() {
    effect(() => {
      const list = this.records();
      if (list?.length && this.selectedVesselId() === null) {
        this.selectedVesselId.set(list[0].id);
      }
    });
  }

  ngOnInit(): void {
    this.emissionsFacade.loadEmissions();
  }

  protected onVesselSelected(id: number): void {
    this.selectedVesselId.set(id);
  }
}
