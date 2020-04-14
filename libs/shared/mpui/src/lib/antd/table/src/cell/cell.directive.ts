/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { Directive, Optional } from '@angular/core';
import { MpTableStyleService } from '../table-style.service';

@Directive({
  selector:
    'th:not(.mp-disable-th):not([mat-cell]), td:not(.mp-disable-td):not([mat-cell])',
  host: {
    '[class.ant-table-cell]': 'isInsideTable'
  }
})
export class MpTableCellDirective {
  isInsideTable = false;
  constructor(@Optional() mpTableStyleService: MpTableStyleService) {
    this.isInsideTable = !!mpTableStyleService;
  }
}
