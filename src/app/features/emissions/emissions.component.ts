import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { EmissionsFacade } from './state/emissions.facade';

@Component({
  selector: 'app-emissions',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './emissions.component.html',
})
export class EmissionsComponent implements OnInit {
  private readonly emissionsFacade = inject(EmissionsFacade);

  protected readonly emissions$ = this.emissionsFacade.emissions$;
  protected readonly loading$ = this.emissionsFacade.loading$;
  protected readonly error$ = this.emissionsFacade.error$;

  ngOnInit(): void {
    this.emissionsFacade.loadEmissions();
  }
}
