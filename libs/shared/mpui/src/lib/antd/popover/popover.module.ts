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
import { MpNoAnimationModule } from '../core/no-animation';
import { MpOutletModule } from '../core/outlet';
import { MpOverlayModule } from '../core/overlay';

import { MpToolTipModule } from '../tooltip';

import { MpPopoverComponent, MpPopoverDirective } from './popover';

@NgModule({
  exports: [MpPopoverDirective, MpPopoverComponent],
  declarations: [MpPopoverDirective, MpPopoverComponent],
  imports: [
    CommonModule,
    OverlayModule,
    MpOutletModule,
    MpOverlayModule,
    MpNoAnimationModule,
    MpToolTipModule
  ]
})
export class MpPopoverModule {}
