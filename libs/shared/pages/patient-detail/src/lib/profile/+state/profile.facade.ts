import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromProfile from './profile.reducer';
import * as ProfileSelectors from './profile.selectors';
import * as ProfileAction from './profile.actions';

@Injectable()
export class ProfileFacade {
  currentPatient$ = this.store.pipe(select(ProfileSelectors.getPatient));

  constructor(private store: Store<fromProfile.ProfilePartialState>) {}

  getCurrentPatient(id) {
    this.store.dispatch(ProfileAction.getCurrentPatient({ id: id }));
  }
}
