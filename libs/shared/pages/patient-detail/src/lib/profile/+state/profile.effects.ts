import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as fromProfile from './profile.reducer';
import * as ProfileActions from './profile.actions';
import { StartupService } from '@medopad/shared/services';
import { map } from 'rxjs/operators';

@Injectable()
export class ProfileEffects {
  loadPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.getCurrentPatient),
      fetch({
        run: (action: any) => {
          return this.startupservice.getCurrentPatient(action.id).pipe(
            map(({ data }) => {
              return ProfileActions.getCurrentPatientSuccess({
                Patient: data
              });
            })
          );
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private startupservice: StartupService
  ) {}
}
