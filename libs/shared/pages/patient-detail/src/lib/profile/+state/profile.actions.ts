import { createAction, props } from '@ngrx/store';
import { ProfileEntity } from './profile.models';

export const getCurrentPatient = createAction(
  '[Profile] Get Current Patient',
  props<{ id }>()
);

export const getCurrentPatientSuccess = createAction(
  '[Profile] Get Patient Success',
  props<{ Patient: any }>()
);
