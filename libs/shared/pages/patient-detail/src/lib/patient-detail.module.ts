import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@medopad/shared/mpui';
import { PatientDetailRoutingModule } from './patient-detail-routing.module';
import { LayoutModule } from './layout/layout.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { ProfileModule } from './profile/profile.module';

@NgModule({
  imports: [
    CommonModule,
    SharedUiModule,
    PatientDetailRoutingModule,
    LayoutModule,
    QuestionnaireModule,
    ProfileModule
  ]
})
export class PatientDetailModule {}
