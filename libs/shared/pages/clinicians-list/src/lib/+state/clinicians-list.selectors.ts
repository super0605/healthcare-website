import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  CLINICIANSLIST_FEATURE_KEY,
  State,
  CliniciansListPartialState,
  cliniciansListAdapter
} from './clinicians-list.reducer';

// Lookup the 'CliniciansList' feature state managed by NgRx
export const getCliniciansListState = createFeatureSelector<
  CliniciansListPartialState,
  State
>(CLINICIANSLIST_FEATURE_KEY);

const { selectAll, selectEntities } = cliniciansListAdapter.getSelectors();

export const getCliniciansListLoaded = createSelector(
  getCliniciansListState,
  (state: State) => state.loaded
);

export const getCliniciansListError = createSelector(
  getCliniciansListState,
  (state: State) => state.error
);

export const getAllCliniciansList = createSelector(
  getCliniciansListState,
  (state: State) => selectAll(state)
);

export const getCliniciansListEntities = createSelector(
  getCliniciansListState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getCliniciansListState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getCliniciansListEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
