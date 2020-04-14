import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  PATIENTS_LIST_FEATURE_KEY,
  State,
  PatientsListPartialState,
  PatientsListAdapter
} from './patients-list.reducer';

// Lookup the 'PatientsList' feature state managed by NgRx
export const getPatientsListState = createFeatureSelector<
  PatientsListPartialState,
  State
>(PATIENTS_LIST_FEATURE_KEY);

const { selectAll, selectEntities } = PatientsListAdapter.getSelectors();

export const getPatientsListLoaded = createSelector(
  getPatientsListState,
  (state: State) => state.loaded
);

export const getPatientsListError = createSelector(
  getPatientsListState,
  (state: State) => state.error
);

export const getAllPatientsList = createSelector(
  getPatientsListState,
  (state: State) => selectAll(state)
);

export const getPatient = createSelector(
  getPatientsListState,
  (state: State) => state.patient
);

export const getPatientsListEntities = createSelector(
  getPatientsListState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getPatientsListState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getPatientsListEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
