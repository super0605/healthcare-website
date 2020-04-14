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
import { FormsModule } from '@angular/forms';
import { MpButtonModule } from '../button';

import { MpNoAnimationModule } from '../core/no-animation';
import { MpOverlayModule } from '../core/overlay';
import { MpIconModule } from '../icon';
import { MpTimePickerModule } from '../time-picker';
import { CalendarFooterComponent } from './calendar-footer.component';

import { MpDatePickerComponent } from './date-picker.component';
import { DateRangePopupComponent } from './date-range-popup.component';
import { InnerPopupComponent } from './inner-popup.component';

import { LibPackerModule } from './lib/lib-packer.module';
import { MpMonthPickerComponent } from './month-picker.component';
import { MpPickerComponent } from './picker.component';
import { MpRangePickerComponent } from './range-picker.component';
import { MpWeekPickerComponent } from './week-picker.component';
import { MpYearPickerComponent } from './year-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    LibPackerModule,
    MpIconModule,
    MpOverlayModule,
    MpNoAnimationModule,
    MpTimePickerModule,
    MpButtonModule,
    LibPackerModule
  ],
  exports: [
    MpDatePickerComponent,
    MpRangePickerComponent,
    MpMonthPickerComponent,
    MpYearPickerComponent,
    MpWeekPickerComponent
  ],
  declarations: [
    MpPickerComponent,
    MpDatePickerComponent,
    MpMonthPickerComponent,
    MpYearPickerComponent,
    MpWeekPickerComponent,
    MpRangePickerComponent,

    CalendarFooterComponent,
    InnerPopupComponent,
    DateRangePopupComponent
  ]
})
export class MpDatePickerModule {}
