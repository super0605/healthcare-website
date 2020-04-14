import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@medopad/shared/mpui';
import { QuestionnaireRoutingModule } from './questionnaire-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [OverviewComponent, DetailComponent],
  imports: [CommonModule, SharedUiModule, QuestionnaireRoutingModule]
})
export class QuestionnaireModule {}
