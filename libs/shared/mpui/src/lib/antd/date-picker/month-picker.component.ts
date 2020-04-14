/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, Host, Optional } from '@angular/core';
import { MpDatePickerComponent } from './date-picker.component';

@Directive({
  selector: 'mp-month-picker',
  exportAs: 'mpMonthPicker'
})
// tslint:disable-next-line:directive-class-suffix
export class MpMonthPickerComponent {
  constructor(@Optional() @Host() public datePicker: MpDatePickerComponent) {
    this.datePicker.mpMode = 'month';
    this.datePicker.mpFormat = 'yyyy-MM';
  }
}
