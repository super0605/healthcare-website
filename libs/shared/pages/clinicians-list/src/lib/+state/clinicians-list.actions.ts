import { createAction, props } from '@ngrx/store';
import { CliniciansListEntity } from './clinicians-list.models';

export const loadCliniciansList = createAction(
  '[CliniciansList] Load CliniciansList'
);

export const loadCliniciansListSuccess = createAction(
  '[CliniciansList] Load CliniciansList Success',
  props<{ cliniciansList: CliniciansListEntity[] }>()
);

export const loadCliniciansListFailure = createAction(
  '[CliniciansList] Load CliniciansList Failure',
  props<{ error: any }>()
);
