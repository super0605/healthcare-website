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
import { MpOutletModule } from '../core/outlet';
import { MpIconModule } from '../icon';
import { MpNotificationContainerComponent } from './notification-container.component';
import { MpNotificationComponent } from './notification.component';
import { MpNotificationServiceModule } from './notification.service.module';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    MpIconModule,
    MpOutletModule,
    MpNotificationServiceModule
  ],
  declarations: [MpNotificationComponent, MpNotificationContainerComponent]
})
export class MpNotificationModule {}
