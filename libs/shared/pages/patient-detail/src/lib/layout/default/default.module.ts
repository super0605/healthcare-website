import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@medopad/shared/mpui';
import { PageHeaderComponent } from './page-header/page-header.component';
import { PageSidebarComponent } from './page-sidebar/page-sidebar.component';
import { ActionBarComponent } from './page-header/action-bar/action-bar.component';
import { DefaultPatientLayoutComponent } from './default.component';

@NgModule({
  imports: [CommonModule, RouterModule, SharedUiModule],
  declarations: [
    PageHeaderComponent,
    PageSidebarComponent,
    ActionBarComponent,
    DefaultPatientLayoutComponent
  ]
})
export class DefaultPatientLayoutModule {}
