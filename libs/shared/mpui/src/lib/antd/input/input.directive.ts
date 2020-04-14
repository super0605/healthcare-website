/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { MpSizeLDSType } from '../core/types';
import { InputBoolean } from '../core/util';

@Directive({
  selector: 'input[mp-input],textarea[mp-input]',
  exportAs: 'mpInput',
  host: {
    '[class.ant-input-disabled]': 'disabled',
    '[class.ant-input-lg]': `mpSize === 'large'`,
    '[class.ant-input-sm]': `mpSize === 'small'`
  }
})
export class MpInputDirective {
  @Input() mpSize: MpSizeLDSType = 'default';
  @Input() @InputBoolean() disabled = false;

  constructor(renderer: Renderer2, elementRef: ElementRef) {
    renderer.addClass(elementRef.nativeElement, 'ant-input');
  }
}
