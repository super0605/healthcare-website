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
import { MpHighlightModule } from '../core/highlight';
import { MpNoAnimationModule } from '../core/no-animation';
import { MpOutletModule } from '../core/outlet';
import { MpOverlayModule } from '../core/overlay';

import { MpEmptyModule } from '../empty';
import { MpIconModule } from '../icon';
import { MpInputModule } from '../input';

import { MpCascaderOptionComponent } from './cascader-li.component';
import { MpCascaderComponent } from './cascader.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    MpOutletModule,
    MpEmptyModule,
    MpHighlightModule,
    MpIconModule,
    MpInputModule,
    MpNoAnimationModule,
    MpOverlayModule
  ],
  declarations: [MpCascaderComponent, MpCascaderOptionComponent],
  exports: [MpCascaderComponent]
})
export class MpCascaderModule {}
