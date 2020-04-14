/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';

import { InputBoolean, toBoolean } from '../core/util';

@Component({
  selector: 'mp-form-label',
  exportAs: 'mpFormLabel',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label
      [attr.for]="mpFor"
      [class.ant-form-item-no-colon]="
        noColon === 'default' ? defaultNoColon : mpNoColon
      "
      [class.ant-form-item-required]="mpRequired"
    >
      <ng-content></ng-content>
    </label>
  `
})
export class MpFormLabelComponent {
  @Input() mpFor: string;
  @Input() @InputBoolean() mpRequired = false;
  @Input()
  set mpNoColon(value: boolean) {
    this.noColon = toBoolean(value);
  }
  get mpNoColon(): boolean {
    return !!this.noColon;
  }

  defaultNoColon: boolean = false;
  noColon: boolean | string = 'default';

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    renderer.addClass(elementRef.nativeElement, 'ant-form-item-label');
  }

  setDefaultNoColon(value: boolean): void {
    this.defaultNoColon = toBoolean(value);
    this.cdr.markForCheck();
  }
}
