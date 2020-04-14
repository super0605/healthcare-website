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

@Component({
  selector: 'mp-table-title-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-container *mpStringTemplateOutlet="title">{{ title }}</ng-container>
    <ng-container *mpStringTemplateOutlet="footer">{{ footer }}</ng-container>
  `,
  host: {
    '[class.ant-table-title]': `title !== null`,
    '[class.ant-table-footer]': `footer !== null`
  }
})
export class MpTableTitleFooterComponent {
  @Input() title: string | TemplateRef<MpSafeAny> | null = null;
  @Input() footer: string | TemplateRef<MpSafeAny> | null = null;
}
