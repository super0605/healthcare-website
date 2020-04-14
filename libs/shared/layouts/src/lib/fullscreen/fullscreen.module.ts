import { NgModule } from '@angular/core';
import { SharedUiModule } from '@medopad/shared/mpui';

const COMPONENTS = [];

@NgModule({
  imports: [SharedUiModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class FullScreenLayoutModule {}
