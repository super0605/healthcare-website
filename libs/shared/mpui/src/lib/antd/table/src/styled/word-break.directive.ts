/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, Input } from '@angular/core';
import { InputBoolean } from '../../../core/util';

@Directive({
  selector: 'th[mpBreakWord],td[mpBreakWord]',
  host: {
    '[style.word-break]': `mpBreakWord ? 'break-all' : ''`
  }
})
export class MpCellBreakWordDirective {
  @Input() @InputBoolean() mpBreakWord = true;
}
