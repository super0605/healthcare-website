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
  selector: 'div[mp-modal-title]',
  exportAs: 'MpModalTitleBuiltin',
  template: `
    <div class="ant-modal-title">
      <ng-container *mpStringTemplateOutlet="config.mpTitle">
        <div [innerHTML]="config.mpTitle"></div>
      </ng-container>
    </div>
  `,
  host: {
    class: 'ant-modal-header'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MpModalTitleComponent {
  constructor(public config: ModalOptions) {}
}
