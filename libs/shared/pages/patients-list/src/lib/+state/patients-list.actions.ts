import { createAction, props } from '@ngrx/store';
import { PatientsListEntity } from './patients-list.models';

export const loadPatientsList = createAction(
  '[PatientsList] Load PatientsList'
);

export const loadMyPatientsList = createAction(
  '[PatientsList] Load PatientsList'
);

export const loadPatientsListSuccess = createAction(
  '[PatientsList] Load PatientsList Success',
  props<{ PatientsList: PatientsListEntity[] }>()
);

export const getCurrentPatient = createAction(
  '[PatientsList] Get Current Patient',
  props<{ Patient: any }>()
);

export const getCurrentPatientSuccess = createAction(
  '[PatientsList] Get Patient Success',
  props<{ Patient: any }>()
);

export const loadPatientsListFailure = createAction(
  '[PatientsList] Load PatientsList Failure',
  props<{ error: any }>()
);
