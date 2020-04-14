import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as PatientsListActions from './patients-list.actions';
import { PatientsListEntity } from './patients-list.models';

export const PATIENTS_LIST_FEATURE_KEY = 'PatientsList';

export interface State extends EntityState<PatientsListEntity> {
  selectedId?: string | number; // which PatientsList record has been selected
  loaded: boolean; // has the PatientsList list been loaded
  error?: string | null; // last none error (if any)
  patient?: any;
}

export interface PatientsListPartialState {
  readonly [PATIENTS_LIST_FEATURE_KEY]: State;
}

export const PatientsListAdapter: EntityAdapter<
  PatientsListEntity
> = createEntityAdapter<PatientsListEntity>();

export const initialState: State = PatientsListAdapter.getInitialState({
  // set initial required properties
  loaded: false
});

const patientsListReducer = createReducer(
  initialState,
  on(PatientsListActions.loadPatientsList, state => ({
    ...state,
    loaded: false,
    error: null
  })),

  on(PatientsListActions.loadPatientsListSuccess, (state, { PatientsList }) =>
    PatientsListAdapter.addAll(PatientsList, { ...state, loaded: true })
  ),

  on(PatientsListActions.loadPatientsListFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(PatientsListActions.getCurrentPatientSuccess, (state, { Patient }) => ({
    ...state,
    patient: Patient
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return patientsListReducer(state, action);
}
