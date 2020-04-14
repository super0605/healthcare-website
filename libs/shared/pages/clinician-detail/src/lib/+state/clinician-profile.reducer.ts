import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as ClinicianProfileActions from './clinician-profile.actions';
import { ClinicianProfileEntity } from './clinician-profile.models';

export const CLINICIANPROFILE_FEATURE_KEY = 'clinicianProfile';

export interface State extends EntityState<ClinicianProfileEntity> {
  selectedId?: string | number; // which ClinicianProfile record has been selected
  loaded: boolean; // has the ClinicianProfile list been loaded
  error?: string | null; // last none error (if any)
}

export interface ClinicianProfilePartialState {
  readonly [CLINICIANPROFILE_FEATURE_KEY]: State;
}

export const clinicianProfileAdapter: EntityAdapter<
  ClinicianProfileEntity
> = createEntityAdapter<ClinicianProfileEntity>();

export const initialState: State = clinicianProfileAdapter.getInitialState({
  // set initial required properties
  loaded: false
});

const clinicianProfileReducer = createReducer(
  initialState,
  on(ClinicianProfileActions.loadClinicianProfile, state => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(
    ClinicianProfileActions.loadClinicianProfileSuccess,
    (state, { clinicianProfile }) =>
      clinicianProfileAdapter.addAll(clinicianProfile, {
        ...state,
        loaded: true
      })
  ),
  on(
    ClinicianProfileActions.loadClinicianProfileFailure,
    (state, { error }) => ({ ...state, error })
  )
);

export function reducer(state: State | undefined, action: Action) {
  return clinicianProfileReducer(state, action);
}
