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
import { MpOverlayModule } from '../core/overlay';
import { MpDropDownModule } from '../dropdown';
import { MpIconModule } from '../icon';

import { MpBreadCrumbItemComponent } from './breadcrumb-item.component';
import { MpBreadCrumbSeparatorComponent } from './breadcrumb-separator.component';
import { MpBreadCrumbComponent } from './breadcrumb.component';

@NgModule({
  imports: [
    CommonModule,
    MpOutletModule,
    OverlayModule,
    MpOverlayModule,
    MpDropDownModule,
    MpIconModule
  ],
  declarations: [
    MpBreadCrumbComponent,
    MpBreadCrumbItemComponent,
    MpBreadCrumbSeparatorComponent
  ],
  exports: [
    MpBreadCrumbComponent,
    MpBreadCrumbItemComponent,
    MpBreadCrumbSeparatorComponent
  ]
})
export class MpBreadCrumbModule {}
