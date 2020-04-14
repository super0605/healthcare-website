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
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../../../core/types';
import { MpTableSortOrder } from '../table.types';

@Component({
  selector: 'mp-table-sorters',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span
      ><ng-template [ngTemplateOutlet]="contentTemplate"></ng-template
    ></span>
    <span
      class="ant-table-column-sorter"
      [class.ant-table-column-sorter-full]="isDown && isUp"
    >
      <span class="ant-table-column-sorter-inner">
        <i
          mp-icon
          mpType="caret-up"
          *ngIf="isUp"
          class="ant-table-column-sorter-up"
          [class.active]="sortOrder == 'ascend'"
        ></i>
        <i
          mp-icon
          mpType="caret-down"
          *ngIf="isDown"
          class="ant-table-column-sorter-down"
          [class.active]="sortOrder == 'descend'"
        ></i>
      </span>
    </span>
  `,
  host: {
    '[class.ant-table-column-sorters]': 'true'
  }
})
export class MpTableSortersComponent implements OnChanges {
  @Input() sortDirections: MpTableSortOrder[] = ['ascend', 'descend', null];
  @Input() sortOrder: MpTableSortOrder = null;
  @Input() contentTemplate: TemplateRef<MpSafeAny> | null = null;
  isUp = false;
  isDown = false;
  ngOnChanges(changes: SimpleChanges): void {
    const { sortDirections } = changes;
    if (sortDirections) {
      this.isUp = this.sortDirections.indexOf('ascend') !== -1;
      this.isDown = this.sortDirections.indexOf('descend') !== -1;
    }
  }
}
