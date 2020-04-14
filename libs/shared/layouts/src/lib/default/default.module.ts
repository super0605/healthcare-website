import { NgModule } from '@angular/core';
import { SharedUiModule } from '@medopad/shared/mpui';

import { HeaderComponent } from './header/header.component';

const COMPONENTS = [HeaderComponent];

const HeaderComponents = [];

@NgModule({
  imports: [SharedUiModule],
  declarations: [...COMPONENTS, ...HeaderComponents],
  exports: [...COMPONENTS, ...HeaderComponents]
})
export class DefaultLayoutModule {}
