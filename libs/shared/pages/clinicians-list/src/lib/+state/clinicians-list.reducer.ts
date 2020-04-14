import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as CliniciansListActions from './clinicians-list.actions';
import { CliniciansListEntity } from './clinicians-list.models';

export const CLINICIANSLIST_FEATURE_KEY = 'cliniciansList';

export interface State extends EntityState<CliniciansListEntity> {
  selectedId?: string | number; // which CliniciansList record has been selected
  loaded: boolean; // has the CliniciansList list been loaded
  error?: string | null; // last none error (if any)
}

export interface CliniciansListPartialState {
  readonly [CLINICIANSLIST_FEATURE_KEY]: State;
}

export const cliniciansListAdapter: EntityAdapter<
  CliniciansListEntity
> = createEntityAdapter<CliniciansListEntity>();

export const initialState: State = cliniciansListAdapter.getInitialState({
  // set initial required properties
  loaded: false
});

const cliniciansListReducer = createReducer(
  initialState,
  on(CliniciansListActions.loadCliniciansList, state => ({
    ...state,
    loaded: false,
    error: null
  })),

  on(
    CliniciansListActions.loadCliniciansListSuccess,
    (state, { cliniciansList }) =>
      cliniciansListAdapter.addAll(cliniciansList, { ...state, loaded: true })
  ),

  on(CliniciansListActions.loadCliniciansListFailure, (state, { error }) => ({
    ...state,
    error
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return cliniciansListReducer(state, action);
}
