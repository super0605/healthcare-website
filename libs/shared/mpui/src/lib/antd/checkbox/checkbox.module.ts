/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MpCheckboxGroupComponent } from './checkbox-group.component';
import { MpCheckboxWrapperComponent } from './checkbox-wrapper.component';
import { MpCheckboxComponent } from './checkbox.component';

@NgModule({
  imports: [CommonModule, FormsModule, A11yModule],
  declarations: [
    MpCheckboxComponent,
    MpCheckboxGroupComponent,
    MpCheckboxWrapperComponent
  ],
  exports: [
    MpCheckboxComponent,
    MpCheckboxGroupComponent,
    MpCheckboxWrapperComponent
  ]
})
export class MpCheckboxModule {}
