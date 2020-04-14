import { Injectable } from '@angular/core';

import { select, Store, Action } from '@ngrx/store';

import * as fromCliniciansList from './clinicians-list.reducer';
import * as CliniciansListSelectors from './clinicians-list.selectors';
import * as CliniciansListAction from './clinicians-list.actions';

@Injectable()
export class CliniciansListFacade {
  loaded$ = this.store.pipe(
    select(CliniciansListSelectors.getCliniciansListLoaded)
  );
  allCliniciansList$ = this.store.pipe(
    select(CliniciansListSelectors.getAllCliniciansList)
  );
  selectedCliniciansList$ = this.store.pipe(
    select(CliniciansListSelectors.getSelected)
  );

  constructor(
    private store: Store<fromCliniciansList.CliniciansListPartialState>
  ) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  getAllClinicians() {
    this.store.dispatch(CliniciansListAction.loadCliniciansList());
  }
}
