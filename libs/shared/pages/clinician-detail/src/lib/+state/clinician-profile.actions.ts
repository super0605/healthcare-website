import { createAction, props } from '@ngrx/store';
import { ClinicianProfileEntity } from './clinician-profile.models';

export const loadClinicianProfile = createAction(
  '[ClinicianProfile] Load ClinicianProfile'
);

export const loadClinicianProfileSuccess = createAction(
  '[ClinicianProfile] Load ClinicianProfile Success',
  props<{ clinicianProfile: ClinicianProfileEntity[] }>()
);

export const loadClinicianProfileFailure = createAction(
  '[ClinicianProfile] Load ClinicianProfile Failure',
  props<{ error: any }>()
);
