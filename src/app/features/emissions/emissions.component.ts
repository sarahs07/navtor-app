import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import {
  EmissionMetricKey,
  EmissionsList,
  emissionMetricOptionsForRecords,
} from '../../models/emission.model';
import { EmissionsFacade } from './state/emissions.facade';

@Component({
  selector: 'app-emissions',
  standalone: true,
  imports: [
    AsyncPipe,
    DecimalPipe,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
  ],
  templateUrl: './emissions.component.html',
  styleUrl: './emissions.component.scss',
})
export class EmissionsComponent implements OnInit {
  private readonly emissionsFacade = inject(EmissionsFacade);

  protected readonly emissions$ = this.emissionsFacade.emissions$;
  protected readonly loading$ = this.emissionsFacade.loading$;
  protected readonly error$ = this.emissionsFacade.error$;

  protected readonly selectedMetric = signal<EmissionMetricKey>('co2_emissions');

  ngOnInit(): void {
    this.emissionsFacade.loadEmissions();
  }

  protected metricOptionsFor(records: EmissionsList) {
    return emissionMetricOptionsForRecords(records);
  }

  protected onMetricSelected(key: EmissionMetricKey): void {
    this.selectedMetric.set(key);
  }

  protected metricTotal(records: EmissionsList, key: EmissionMetricKey): number {
    let sum = 0;
    for (const record of records) {
      for (const point of record.timeSeries) {
        sum += point[key];
      }
    }
    return sum;
  }
}
