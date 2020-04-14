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
import { MpIconModule } from '../icon';
import { MpContentComponent } from './content.component';
import { MpFooterComponent } from './footer.component';
import { MpHeaderComponent } from './header.component';
import { MpLayoutComponent } from './layout.component';
import { MpSiderTriggerComponent } from './sider-trigger.component';
import { MpSiderComponent } from './sider.component';

@NgModule({
  declarations: [
    MpLayoutComponent,
    MpHeaderComponent,
    MpContentComponent,
    MpFooterComponent,
    MpSiderComponent,
    MpSiderTriggerComponent
  ],
  exports: [
    MpLayoutComponent,
    MpHeaderComponent,
    MpContentComponent,
    MpFooterComponent,
    MpSiderComponent
  ],
  imports: [CommonModule, MpIconModule, LayoutModule, PlatformModule]
})
export class MpLayoutModule {}
