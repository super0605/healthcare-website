/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterViewInit,
  Directive,
  ElementRef,
  Host,
  Optional,
  Renderer2
} from '@angular/core';
import { MpButtonGroupComponent } from '../button';

@Directive({
  selector: '[mp-button][mp-dropdown]'
})
export class MpDropdownButtonDirective implements AfterViewInit {
  constructor(
    private renderer: Renderer2,
    @Host() @Optional() private mpButtonGroupComponent: MpButtonGroupComponent,
    private elementRef: ElementRef
  ) {}
  ngAfterViewInit(): void {
    const parentElement = this.renderer.parentNode(
      this.elementRef.nativeElement
    );
    if (this.mpButtonGroupComponent && parentElement) {
      this.renderer.addClass(parentElement, 'ant-dropdown-button');
    }
  }
}
