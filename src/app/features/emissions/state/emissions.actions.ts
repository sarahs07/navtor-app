import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { EmissionsList } from '../../../models/emission.model';

export const emissionsPageActions = createActionGroup({
  source: 'Emissions Page',
  events: {
    'Load Emissions': emptyProps(),
    'Load Emissions Success': props<{ emissions: EmissionsList }>(),
    'Load Emissions Failure': props<{ error: string }>(),
  },
});
