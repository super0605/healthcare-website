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
  ViewEncapsulation
} from '@angular/core';

export type MpButtonGroupSize = 'large' | 'default' | 'small';

@Component({
  selector: 'mp-button-group',
  exportAs: 'mpButtonGroup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ant-btn-group]': `true`,
    '[class.ant-btn-group-lg]': `mpSize === 'large'`,
    '[class.ant-btn-group-sm]': `mpSize === 'small'`
  },
  preserveWhitespaces: false,
  template: `
    <ng-content></ng-content>
  `
})
export class MpButtonGroupComponent {
  @Input() mpSize: MpButtonGroupSize = 'default';
}
