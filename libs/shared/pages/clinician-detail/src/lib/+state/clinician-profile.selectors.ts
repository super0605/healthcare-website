import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  CLINICIANPROFILE_FEATURE_KEY,
  State,
  ClinicianProfilePartialState,
  clinicianProfileAdapter
} from './clinician-profile.reducer';

// Lookup the 'ClinicianProfile' feature state managed by NgRx
export const getClinicianProfileState = createFeatureSelector<
  ClinicianProfilePartialState,
  State
>(CLINICIANPROFILE_FEATURE_KEY);

const { selectAll, selectEntities } = clinicianProfileAdapter.getSelectors();

export const getClinicianProfileLoaded = createSelector(
  getClinicianProfileState,
  (state: State) => state.loaded
);

export const getClinicianProfileError = createSelector(
  getClinicianProfileState,
  (state: State) => state.error
);

export const getAllClinicianProfile = createSelector(
  getClinicianProfileState,
  (state: State) => selectAll(state)
);

export const getClinicianProfileEntities = createSelector(
  getClinicianProfileState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getClinicianProfileState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getClinicianProfileEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
