import { NgModule } from '@angular/core';
import { SharedUiModule } from '@medopad/shared/mpui';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmailConfirmComponent } from './email-confirm/email-confirm.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: EmailConfirmComponent
      }
    ])
  ],
  declarations: [EmailConfirmComponent]
})
export class EmailConfirmModule {}
