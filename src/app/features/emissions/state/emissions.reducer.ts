import { createFeature, createReducer, on } from '@ngrx/store';
import { EmissionsList } from '../../../models/emission.model';
import { emissionsPageActions } from './emissions.actions';

export interface EmissionsState {
  emissions: EmissionsList | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmissionsState = {
  emissions: null,
  loading: false,
  error: null,
};

export const emissionsFeature = createFeature({
  name: 'emissions',
  reducer: createReducer(
    initialState,
    on(emissionsPageActions.loadEmissions, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(emissionsPageActions.loadEmissionsSuccess, (state, { emissions }) => ({
      ...state,
      emissions,
      loading: false,
    })),
    on(emissionsPageActions.loadEmissionsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
  ),
});
