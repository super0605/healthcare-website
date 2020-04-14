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
  selector: 'mp-range-picker',
  exportAs: 'mpRangePicker'
})
// tslint:disable-next-line:directive-class-suffix
export class MpRangePickerComponent {
  constructor(@Optional() @Host() public datePicker: MpDatePickerComponent) {
    this.datePicker.isRange = true;
    this.datePicker.mpMode = ['date', 'date'];
  }
}
