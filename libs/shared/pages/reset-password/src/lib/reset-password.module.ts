import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@medopad/shared/mpui';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: ResetPasswordComponent
      }
    ])
  ],
  declarations: [ResetPasswordComponent]
})
export class ResetPasswordModule {}
