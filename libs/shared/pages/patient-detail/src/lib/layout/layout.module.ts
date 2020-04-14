import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@medopad/shared/mpui';
import { DefaultPatientLayoutModule } from './default/default.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    SharedUiModule,
    DefaultPatientLayoutModule
  ]
})
export class LayoutModule {}
