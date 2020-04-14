/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, ElementRef } from '@angular/core';

/**
 * A patch directive to select the element of a component.
 */
@Directive({
  selector: '[mp-element]',
  exportAs: 'mpElement'
})
export class MpElementPatchDirective {
  constructor(public elementRef: ElementRef) {}
}
