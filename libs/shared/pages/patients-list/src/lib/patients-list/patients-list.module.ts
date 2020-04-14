import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PatientsListComponent } from './patients-list.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromCliniciansList from '../+state/patients-list.reducer';
import { PatientsListEffects } from '../+state/patients-list.effects';
import { PatientsListFacade } from '../+state/patients-list.facade';
import { KeyVitalsRendererComponent } from './renderers/key-vitals-renderer/key-vitals-renderer.component';
import { SharedUiModule } from '@medopad/shared/mpui';

@NgModule({
  imports: [
    CommonModule,
    SharedUiModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: PatientsListComponent
      }
    ]),
    StoreModule.forFeature(
      fromCliniciansList.PATIENTS_LIST_FEATURE_KEY,
      fromCliniciansList.reducer
    ),
    EffectsModule.forFeature([PatientsListEffects])
  ],
  exports: [PatientsListComponent],
  declarations: [PatientsListComponent, KeyVitalsRendererComponent],
  providers: [PatientsListFacade]
})
export class PatientsListModule {}
