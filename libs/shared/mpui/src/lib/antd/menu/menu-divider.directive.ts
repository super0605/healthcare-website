/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[mp-menu-divider]',
  exportAs: 'mpMenuDivider'
})
export class MpMenuDividerDirective {
  constructor(public elementRef: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(
      elementRef.nativeElement,
      'ant-dropdown-menu-item-divider'
    );
  }
}
