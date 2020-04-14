import { Injectable } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';
import * as fromPatientsList from './patients-list.reducer';
import * as PatientsListSelectors from './patients-list.selectors';
import * as PatientsListAction from './patients-list.actions';

@Injectable()
export class PatientsListFacade {
  loaded$ = this.store.pipe(
    select(PatientsListSelectors.getPatientsListLoaded)
  );

  allPatientsList$ = this.store.pipe(
    select(PatientsListSelectors.getAllPatientsList)
  );

  currentPatient$ = this.store.pipe(select(PatientsListSelectors.getPatient));

  selectedPatientsList$ = this.store.pipe(
    select(PatientsListSelectors.getSelected)
  );

  constructor(
    private store: Store<fromPatientsList.PatientsListPartialState>
  ) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  getAllPatients() {
    this.store.dispatch(PatientsListAction.loadPatientsList());
  }

  getAllMyPatients() {
    this.store.dispatch(PatientsListAction.loadMyPatientsList());
  }

  getCurrentPatient(Patient) {
    this.store.dispatch(PatientsListAction.getCurrentPatient(Patient));
  }
}
