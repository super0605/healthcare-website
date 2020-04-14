import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { map } from 'rxjs/operators';

import * as fromClinicianProfile from './clinician-profile.reducer';
import * as ClinicianProfileActions from './clinician-profile.actions';

import { StartupService } from '@medopad/shared/services';

@Injectable()
export class ClinicianProfileEffects {
  loadClinicianProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClinicianProfileActions.loadClinicianProfile),
      fetch({
        run: action => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          // return ClinicianProfileActions.loadClinicianProfileSuccess({
          //   clinicianProfile: []
          // });
          return this.startupservice.getClinicians().pipe(
            map(({ data }) => {
              return ClinicianProfileActions.loadClinicianProfileSuccess({
                clinicianProfile: data['users']
              });
            })
          );
        },

        onError: (action, error) => {
          console.error('Error', error);
          return ClinicianProfileActions.loadClinicianProfileFailure({ error });
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private startupservice: StartupService
  ) {}
}
