import { Injectable } from '@angular/core';

import { select, Store, Action } from '@ngrx/store';

import * as fromClinicianProfile from './clinician-profile.reducer';
import * as ClinicianProfileSelectors from './clinician-profile.selectors';
import * as ClinicianProfileAction from './clinician-profile.actions';

@Injectable()
export class ClinicianProfileFacade {
  loaded$ = this.store.pipe(
    select(ClinicianProfileSelectors.getClinicianProfileLoaded)
  );
  allClinicianProfile$ = this.store.pipe(
    select(ClinicianProfileSelectors.getAllClinicianProfile)
  );
  selectedClinicianProfile$ = this.store.pipe(
    select(ClinicianProfileSelectors.getSelected)
  );

  constructor(
    private store: Store<fromClinicianProfile.ClinicianProfilePartialState>
  ) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  getClinicianProfile() {
    this.store.dispatch(ClinicianProfileAction.loadClinicianProfile());
  }
}
