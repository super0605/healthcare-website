/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MpNoAnimationModule } from '../core/no-animation';
import { MpOverlayModule } from '../core/overlay';

import { MpEmptyModule } from '../empty';
import { MpIconModule } from '../icon';
import { MpSelectModule } from '../select';
import { MpTreeModule } from '../tree';

import { MpTreeSelectComponent } from './tree-select.component';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    FormsModule,
    MpSelectModule,
    MpTreeModule,
    MpIconModule,
    MpEmptyModule,
    MpOverlayModule,
    MpNoAnimationModule
  ],
  declarations: [MpTreeSelectComponent],
  exports: [MpTreeSelectComponent]
})
export class MpTreeSelectModule {}
