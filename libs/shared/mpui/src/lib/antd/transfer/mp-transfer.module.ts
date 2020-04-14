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

import { MpButtonModule } from '../button';
import { MpCheckboxModule } from '../checkbox';
import { MpEmptyModule } from '../empty';
import { MpI18nModule } from '../i18n';
import { MpIconModule } from '../icon';
import { MpInputModule } from '../input';

import { MpTransferListComponent } from './mp-transfer-list.component';
import { MpTransferSearchComponent } from './mp-transfer-search.component';
import { MpTransferComponent } from './mp-transfer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MpCheckboxModule,
    MpButtonModule,
    MpInputModule,
    MpI18nModule,
    MpIconModule,
    MpEmptyModule
  ],
  declarations: [
    MpTransferComponent,
    MpTransferListComponent,
    MpTransferSearchComponent
  ],
  exports: [MpTransferComponent]
})
export class MpTransferModule {}
