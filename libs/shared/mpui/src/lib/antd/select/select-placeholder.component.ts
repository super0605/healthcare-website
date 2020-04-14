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
  selector: 'mp-select-placeholder',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *mpStringTemplateOutlet="placeholder">
      {{ placeholder }}
    </ng-container>
  `,
  host: {
    '[class.ant-select-selection-placeholder]': 'true'
  }
})
export class MpSelectPlaceholderComponent {
  @Input() placeholder: TemplateRef<MpSafeAny> | string | null = null;
}
