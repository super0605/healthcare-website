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
  selector: 'th[mpEllipsis],td[mpEllipsis]',
  host: {
    '[class.ant-table-cell-ellipsis]': 'mpEllipsis'
  }
})
export class MpCellEllipsisDirective {
  @Input() @InputBoolean() mpEllipsis = true;
}
