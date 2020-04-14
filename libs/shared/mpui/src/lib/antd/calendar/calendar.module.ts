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
import { LibPackerModule } from '../date-picker';

import { MpI18nModule } from '../i18n';
import { MpRadioModule } from '../radio';
import { MpSelectModule } from '../select';

import {
  MpDateCellDirective,
  MpDateFullCellDirective,
  MpMonthCellDirective,
  MpMonthFullCellDirective
} from './calendar-cells';
import { MpCalendarHeaderComponent } from './calendar-header.component';
import { MpCalendarComponent } from './calendar.component';

@NgModule({
  declarations: [
    MpCalendarHeaderComponent,
    MpCalendarComponent,
    MpDateCellDirective,
    MpDateFullCellDirective,
    MpMonthCellDirective,
    MpMonthFullCellDirective
  ],
  exports: [
    MpCalendarComponent,
    MpDateCellDirective,
    MpDateFullCellDirective,
    MpMonthCellDirective,
    MpMonthFullCellDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    MpI18nModule,
    MpRadioModule,
    MpSelectModule,
    LibPackerModule
  ]
})
export class MpCalendarModule {}
