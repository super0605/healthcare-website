import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { map } from 'rxjs/operators';

import * as fromPatientsList from './patients-list.reducer';
import * as PatientsListActions from './patients-list.actions';
import { StartupService } from '@medopad/shared/services';

@Injectable()
export class PatientsListEffects {
  loadPatientsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientsListActions.loadPatientsList),
      fetch({
        run: action => {
          return this.startupservice.getPatients().pipe(
            map(({ data }) => {
              data['users'].map(user => {
                user['redModuleNames'] = user['redModuleNames'].map(
                  item => (item = { name: item, type: 'red' })
                );
                user['amberModuleNames'] = user['amberModuleNames'].map(
                  item => (item = { name: item, type: 'amber' })
                );
                user['greenModuleNames'] = user['greenModuleNames'].map(
                  item => (item = { name: item, type: 'green' })
                );
              });

              return PatientsListActions.loadPatientsListSuccess({
                PatientsList: data['users']
              });
            })
          );
        },
        onError: (action, error) => {
          return PatientsListActions.loadPatientsListFailure({ error });
        }
      })
    )
  );

  getPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientsListActions.getCurrentPatient),
      fetch({
        run: action => {
          return PatientsListActions.getCurrentPatientSuccess({
            Patient: action
          });
        }
      })
    )
  );

  loadMyPatientsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientsListActions.loadMyPatientsList),
      fetch({
        run: action => {
          return this.startupservice.getMyPatients().pipe(
            map(({ data }) => {
              data['users'].map(user => {
                user['redModuleNames'] = user['redModuleNames'].map(
                  item => (item = { name: item, type: 'red' })
                );
                user['amberModuleNames'] = user['amberModuleNames'].map(
                  item => (item = { name: item, type: 'amber' })
                );
                user['greenModuleNames'] = user['greenModuleNames'].map(
                  item => (item = { name: item, type: 'green' })
                );
              });

              return PatientsListActions.loadPatientsListSuccess({
                PatientsList: data['users']
              });
            })
          );
        },
        onError: (action, error) => {
          return PatientsListActions.loadPatientsListFailure({ error });
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private startupservice: StartupService
  ) {}
}
