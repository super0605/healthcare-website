/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, TemplateRef } from '@angular/core';
import { MpSafeAny } from '../../../core/types';

@Directive({
  selector: '[mp-virtual-scroll]',
  exportAs: 'mpVirtualScroll'
})
export class MpTableVirtualScrollDirective {
  constructor(
    public templateRef: TemplateRef<{ $implicit: MpSafeAny; index: number }>
  ) {}
}
