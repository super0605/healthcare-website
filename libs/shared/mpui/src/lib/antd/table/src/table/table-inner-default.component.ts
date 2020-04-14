/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../../../core/types';
import { MpTableLayout } from '../table.types';

@Component({
  selector: 'mp-table-inner-default',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ant-table-content">
      <table
        mp-table-content
        [contentTemplate]="contentTemplate"
        [tableLayout]="tableLayout"
        [listOfColWidth]="listOfColWidth"
        [theadTemplate]="theadTemplate"
      ></table>
    </div>
  `,
  host: {
    '[class.ant-table-container]': 'true'
  }
})
export class MpTableInnerDefaultComponent {
  @Input() tableLayout: MpTableLayout = 'auto';
  @Input() listOfColWidth: Array<string | null> = [];
  @Input() theadTemplate: TemplateRef<MpSafeAny> | null = null;
  @Input() contentTemplate: TemplateRef<MpSafeAny> | null = null;
}
