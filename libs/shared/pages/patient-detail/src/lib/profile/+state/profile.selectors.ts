import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  PROFILE_FEATURE_KEY,
  State,
  ProfilePartialState,
  ProfileAdapter
} from './profile.reducer';

// Lookup the 'Profile' feature state managed by NgRx
export const getProfileState = createFeatureSelector<
  ProfilePartialState,
  State
>(PROFILE_FEATURE_KEY);

const { selectEntities } = ProfileAdapter.getSelectors();

export const getPatient = createSelector(
  getProfileState,
  (state: State) => state.patient
);

export const getProfileEntities = createSelector(
  getProfileState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getProfileState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getProfileEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
