import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CliniciansListComponent } from './clinicians-list.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromCliniciansList from '../+state/clinicians-list.reducer';
import { CliniciansListEffects } from '../+state/clinicians-list.effects';
import { CliniciansListFacade } from '../+state/clinicians-list.facade';
import { SharedUiModule } from '@medopad/shared/mpui';

@NgModule({
  imports: [
    CommonModule,
    SharedUiModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: CliniciansListComponent
      }
    ]),
    StoreModule.forFeature(
      fromCliniciansList.CLINICIANSLIST_FEATURE_KEY,
      fromCliniciansList.reducer
    ),
    EffectsModule.forFeature([CliniciansListEffects])
  ],
  declarations: [CliniciansListComponent],
  providers: [CliniciansListFacade]
})
export class CliniciansListModule {}
