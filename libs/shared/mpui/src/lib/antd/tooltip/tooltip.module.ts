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

// NOTE: the `t` is not uppercase in directives. Change this would however introduce breaking change.
import { MpToolTipComponent, MpTooltipDirective } from './tooltip';

@NgModule({
  declarations: [MpToolTipComponent, MpTooltipDirective],
  exports: [MpToolTipComponent, MpTooltipDirective],
  imports: [
    CommonModule,
    OverlayModule,
    MpOutletModule,
    MpOverlayModule,
    MpNoAnimationModule
  ]
})
export class MpToolTipModule {}
