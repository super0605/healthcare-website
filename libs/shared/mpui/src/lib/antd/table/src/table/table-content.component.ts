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
  selector: 'table[mp-table-content]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <col
      [style.width]="width"
      [style.minWidth]="width"
      *ngFor="let width of listOfColWidth"
    />
    <thead class="ant-table-thead" *ngIf="theadTemplate">
      <ng-template [ngTemplateOutlet]="theadTemplate"></ng-template>
    </thead>
    <ng-template [ngTemplateOutlet]="contentTemplate"></ng-template>
    <ng-content></ng-content>
  `,
  host: {
    '[style.table-layout]': 'tableLayout',
    '[class.ant-table-fixed]': 'scrollX',
    '[style.width]': 'scrollX',
    '[style.min-width]': `scrollX ? '100%': null`
  }
})
export class MpTableContentComponent {
  @Input() tableLayout: MpTableLayout = 'auto';
  @Input() theadTemplate: TemplateRef<MpSafeAny> | null = null;
  @Input() contentTemplate: TemplateRef<MpSafeAny> | null = null;
  @Input() listOfColWidth: Array<string | null> = [];
  @Input() scrollX: string | null = null;
}
