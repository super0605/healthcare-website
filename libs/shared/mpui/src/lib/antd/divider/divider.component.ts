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

import { InputBoolean } from '../core/util';

@Component({
  selector: 'mp-divider',
  exportAs: 'mpDivider',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span *ngIf="mpText" class="ant-divider-inner-text">
      <ng-container *mpStringTemplateOutlet="mpText">{{ mpText }}</ng-container>
    </span>
  `,
  host: {
    '[class.ant-divider]': 'true',
    '[class.ant-divider-horizontal]': `mpType === 'horizontal'`,
    '[class.ant-divider-vertical]': `mpType === 'vertical'`,
    '[class.ant-divider-with-text-left]': `mpText && mpOrientation === 'left'`,
    '[class.ant-divider-with-text-right]': `mpText && mpOrientation === 'right'`,
    '[class.ant-divider-with-text-center]': `mpText && mpOrientation === 'center'`,
    '[class.ant-divider-dashed]': `mpDashed`
  }
})
export class MpDividerComponent {
  @Input() mpText: string | TemplateRef<void>;
  @Input() mpType: 'horizontal' | 'vertical' = 'horizontal';
  @Input() mpOrientation: 'left' | 'right' | 'center' = 'center';
  @Input() @InputBoolean() mpDashed = false;
}
