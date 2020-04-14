/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ModalOptions } from './modal-types';

@Component({
  selector: 'button[mp-modal-close]',
  exportAs: 'MpModalCloseBuiltin',
  template: `
    <span class="ant-modal-close-x">
      <ng-container *mpStringTemplateOutlet="config?.mpCloseIcon">
        <i
          mp-icon
          [mpType]="config?.mpCloseIcon"
          class="ant-modal-close-icon"
        ></i>
      </ng-container>
    </span>
  `,
  host: {
    class: 'ant-modal-close',
    'aria-label': 'Close'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MpModalCloseComponent {
  constructor(public config: ModalOptions) {}
}
