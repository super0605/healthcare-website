import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MpLogoComponent } from './logo.component';

@NgModule({
  declarations: [MpLogoComponent],
  exports: [MpLogoComponent],
  imports: [CommonModule]
})
export class MpLogoModule {}
