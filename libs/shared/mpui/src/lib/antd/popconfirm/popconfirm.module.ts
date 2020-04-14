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

import { MpButtonModule } from '../button';
import { MpNoAnimationModule } from '../core/no-animation';
import { MpOutletModule } from '../core/outlet';
import { MpOverlayModule } from '../core/overlay';
import { MpI18nModule } from '../i18n';
import { MpIconModule } from '../icon';
import { MpToolTipModule } from '../tooltip';

import { MpPopconfirmComponent, MpPopconfirmDirective } from './popconfirm';

@NgModule({
  declarations: [MpPopconfirmComponent, MpPopconfirmDirective],
  exports: [MpPopconfirmComponent, MpPopconfirmDirective],
  imports: [
    CommonModule,
    MpButtonModule,
    OverlayModule,
    MpI18nModule,
    MpIconModule,
    MpOutletModule,
    MpOverlayModule,
    MpNoAnimationModule,
    MpToolTipModule
  ]
})
export class MpPopconfirmModule {}
