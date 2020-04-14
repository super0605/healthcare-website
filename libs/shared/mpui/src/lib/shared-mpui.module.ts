import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';

import { SharedAntdModule } from './antd/antd.module';
import { CustomComponentsModule } from './components/custom-components.module';

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  TranslateModule,
  InlineSVGModule,
  SharedAntdModule,
  CustomComponentsModule
];

@NgModule({
  exports: [...MODULES]
})
export class SharedUiModule {}
