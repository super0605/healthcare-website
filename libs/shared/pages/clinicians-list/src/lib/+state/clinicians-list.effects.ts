import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { map } from 'rxjs/operators';

import * as fromCliniciansList from './clinicians-list.reducer';
import * as CliniciansListActions from './clinicians-list.actions';

import { StartupService } from '@medopad/shared/services';

@Injectable()
export class CliniciansListEffects {
  loadCliniciansList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CliniciansListActions.loadCliniciansList),
      fetch({
        run: action => {
          return this.startupservice.getClinicians().pipe(
            map(({ data }) =>
              CliniciansListActions.loadCliniciansListSuccess({
                cliniciansList: data['retrieveManagersForDeployment']
              })
            )
          );
        },

        onError: (action, error) => {
          console.log('GET Patients Error =>', error);
          return CliniciansListActions.loadCliniciansListFailure({ error });
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private startupservice: StartupService
  ) {}
}
