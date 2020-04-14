/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { LayoutModule } from '@angular/cdk/layout';
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MpOutletModule } from '../core/outlet';
import { MpGridModule } from '../grid';
import { MpIconModule } from '../icon';

import { MpFormControlComponent } from './form-control.component';
import { MpFormItemComponent } from './form-item.component';
import { MpFormLabelComponent } from './form-label.component';
import { MpFormSplitComponent } from './form-split.component';
import { MpFormTextComponent } from './form-text.component';
import { MpFormDirective } from './form.directive';

@NgModule({
  declarations: [
    MpFormDirective,
    MpFormItemComponent,
    MpFormLabelComponent,
    MpFormControlComponent,
    MpFormTextComponent,
    MpFormSplitComponent
  ],
  exports: [
    MpGridModule,
    MpFormDirective,
    MpFormItemComponent,
    MpFormLabelComponent,
    MpFormControlComponent,
    MpFormTextComponent,
    MpFormSplitComponent
  ],
  imports: [
    CommonModule,
    MpGridModule,
    MpIconModule,
    LayoutModule,
    PlatformModule,
    MpOutletModule
  ]
})
export class MpFormModule {}
