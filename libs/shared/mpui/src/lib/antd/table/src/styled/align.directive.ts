/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'th[mpAlign],td[mpAlign]',
  host: {
    '[style.text-align]': 'mpAlign'
  }
})
export class MpCellAlignDirective {
  @Input() mpAlign: 'left' | 'right' | 'center' | null = null;
}
