/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'tr[mpExpand]',
  host: {
    '[class.ant-table-expanded-row]': 'true',
    '[hidden]': `!mpExpand`
  }
})
export class MpTrExpandDirective {
  @Input() mpExpand = true;
}
