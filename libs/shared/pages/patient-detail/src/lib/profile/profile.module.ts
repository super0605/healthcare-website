import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromCliniciansList from './+state/profile.reducer';
import { SharedUiModule } from '@medopad/shared/mpui';
import { ProfileComponent } from './profile.component';
import { ProfileFacade } from './+state/profile.facade';
import { ProfileEffects } from './+state/profile.effects';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [
    CommonModule,
    NzTableModule,
    SharedUiModule,
    StoreModule.forFeature(
      fromCliniciansList.PROFILE_FEATURE_KEY,
      fromCliniciansList.reducer
    ),
    EffectsModule.forFeature([ProfileEffects]),
    ProfileRoutingModule
  ],
  declarations: [ProfileComponent],
  providers: [ProfileFacade]
})
export class ProfileModule {}
