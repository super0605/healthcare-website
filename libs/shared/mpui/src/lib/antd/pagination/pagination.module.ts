/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MpI18nModule } from '../i18n';
import { MpIconModule } from '../icon';
import { MpSelectModule } from '../select';
import { MpPaginationDefaultComponent } from './pagination-default.component';
import { MpPaginationItemComponent } from './pagination-item.component';
import { MpPaginationOptionsComponent } from './pagination-options.component';
import { MpPaginationSimpleComponent } from './pagination-simple.component';
import { MpPaginationComponent } from './pagination.component';

@NgModule({
  declarations: [
    MpPaginationComponent,
    MpPaginationSimpleComponent,
    MpPaginationOptionsComponent,
    MpPaginationItemComponent,
    MpPaginationDefaultComponent
  ],
  exports: [MpPaginationComponent],
  imports: [
    CommonModule,
    FormsModule,
    MpSelectModule,
    MpI18nModule,
    MpIconModule
  ]
})
export class MpPaginationModule {}
