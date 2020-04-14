/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive } from '@angular/core';

@Directive({
  selector: '[mpDateCell]',
  exportAs: 'mpDateCell'
})
export class MpDateCellDirective {}

@Directive({
  selector: '[mpMonthCell]',
  exportAs: 'mpMonthCell'
})
export class MpMonthCellDirective {}

@Directive({
  selector: '[mpDateFullCell]',
  exportAs: 'mpDateFullCell'
})
export class MpDateFullCellDirective {}

@Directive({
  selector: '[mpMonthFullCell]',
  exportAs: 'mpMonthFullCell'
})
export class MpMonthFullCellDirective {}
