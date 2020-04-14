import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedUiModule } from '@medopad/shared/mpui';
import { DefaultLayoutComponent, DefaultLayoutModule } from './default';
import {
  FullScreenLayoutModule,
  FullScreenLayoutComponent
} from './fullscreen';

const MODULES = [CommonModule, RouterModule, SharedUiModule];
const LAYOUTS_MODULES = [DefaultLayoutModule, FullScreenLayoutModule];
const COMPONENTS = [DefaultLayoutComponent, FullScreenLayoutComponent];

@NgModule({
  imports: [...MODULES, ...LAYOUTS_MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class LayoutsModule {}
