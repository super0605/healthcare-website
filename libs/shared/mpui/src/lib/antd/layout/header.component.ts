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
  ElementRef,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'mp-header',
  exportAs: 'mpHeader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  template: `
    <ng-content></ng-content>
  `
})
export class MpHeaderComponent {
  constructor(public elementRef: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(this.elementRef.nativeElement, 'ant-layout-header');
  }
}
