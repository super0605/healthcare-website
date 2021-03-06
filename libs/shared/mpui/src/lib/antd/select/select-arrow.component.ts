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
import { MpSafeAny } from '../core/types';

@Component({
  selector: 'mp-select-arrow',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <i mp-icon mpType="loading" *ngIf="loading; else defaultArrow"></i>
    <ng-template #defaultArrow>
      <ng-container *ngIf="!suffixIcon; else suffixIcon">
        <i mp-icon mpType="down" *ngIf="!search"></i>
        <i mp-icon mpType="search" *ngIf="search"></i>
      </ng-container>
    </ng-template>
  `,
  host: {
    '[class.ant-select-arrow]': 'true',
    '[class.ant-select-arrow-loading]': 'loading'
  }
})
export class MpSelectArrowComponent {
  @Input() loading = false;
  @Input() search = false;
  @Input() suffixIcon: TemplateRef<MpSafeAny> | null = null;
}
