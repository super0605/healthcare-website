/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MpNoAnimationModule } from '../core/no-animation';
import { MpOutletModule } from '../core/outlet';

import { MpIconModule } from '../icon';

import { MpDrawerComponent } from './drawer.component';
import { MpDrawerServiceModule } from './drawer.service.module';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
    MpIconModule,
    MpOutletModule,
    MpNoAnimationModule,
    MpDrawerServiceModule
  ],
  exports: [MpDrawerComponent],
  declarations: [MpDrawerComponent]
})
export class MpDrawerModule {}
