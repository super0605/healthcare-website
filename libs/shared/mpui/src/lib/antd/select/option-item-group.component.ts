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
  selector: 'mp-option-item-group',
  template: `
    <ng-container *mpStringTemplateOutlet="mpLabel">{{ mpLabel }}</ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ant-select-item]': 'true',
    '[class.ant-select-item-group]': 'true'
  }
})
export class MpOptionItemGroupComponent {
  @Input() mpLabel: string | TemplateRef<MpSafeAny> | null = null;
}
