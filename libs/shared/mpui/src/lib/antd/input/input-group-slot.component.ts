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

@Component({
  selector: '[mp-input-group-slot]',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <i mp-icon [mpType]="icon" *ngIf="icon"></i>
    <ng-container *mpStringTemplateOutlet="template">{{
      template
    }}</ng-container>
  `,
  host: {
    '[class.ant-input-group-addon]': `type === 'addon'`,
    '[class.ant-input-prefix]': `type === 'prefix'`,
    '[class.ant-input-suffix]': `type === 'suffix'`
  }
})
export class MpInputGroupSlotComponent {
  @Input() icon: string | null = null;
  @Input() type: 'addon' | 'prefix' | 'suffix' | null = null;
  @Input() template: string | TemplateRef<void> | null = null;
}
