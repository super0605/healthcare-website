import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@medopad/shared/mpui';
import { ClinicianProfileComponent } from './clinician-profile/clinician-profile.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromClinicianProfile from './+state/clinician-profile.reducer';
import { ClinicianProfileEffects } from './+state/clinician-profile.effects';
import { ClinicianProfileFacade } from './+state/clinician-profile.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUiModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: ClinicianProfileComponent
      }
    ]),
    StoreModule.forFeature(
      fromClinicianProfile.CLINICIANPROFILE_FEATURE_KEY,
      fromClinicianProfile.reducer
    ),
    EffectsModule.forFeature([ClinicianProfileEffects])
  ],
  declarations: [ClinicianProfileComponent],
  providers: [ClinicianProfileFacade]
})
export class ClinicianProfileModule {}
