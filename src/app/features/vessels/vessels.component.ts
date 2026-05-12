import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  colorSchemeDark,
  Module,
  themeQuartz,
} from 'ag-grid-community';
import { FetchData } from '../../services/fetch-data';
import { Vessel } from '../../models/vessel.model';

@Component({
  selector: 'app-vessels',
  standalone: true,
  templateUrl: './vessels.component.html',
  styleUrl: './vessels.component.scss',
  imports: [AgGridAngular],
})
export class VesselsComponent {
  public theme = themeQuartz.withPart(colorSchemeDark);
  private readonly fetchData = inject(FetchData);

  /** Community modules for this grid only (keeps main bundle smaller). */
  protected readonly gridModules: Module[] = [AllCommunityModule];

  protected readonly vessels = toSignal(this.fetchData.getVessels(), {
    initialValue: [] as Vessel[],
  });

  protected readonly columnDefs: ColDef<Vessel>[] = [
    { field: 'name', flex: 1, minWidth: 130 },
    { field: 'mmsi', filter: 'agNumberColumnFilter' },
    { field: 'imo', filter: 'agNumberColumnFilter' },
    { field: 'companyName', flex: 1, minWidth: 150 },
    { field: 'vesselType', headerName: 'Vessel type', flex: 1, minWidth: 140 },
  ];

  protected readonly defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };
}
