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
  EventEmitter,
  Output,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../core/types';
import { MpCheckboxComponent } from './checkbox.component';

@Component({
  selector: 'mp-checkbox-wrapper',
  exportAs: 'mpCheckboxWrapper',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `
})
export class MpCheckboxWrapperComponent {
  @Output() readonly mpOnChange = new EventEmitter<MpSafeAny[]>();
  private checkboxList: MpCheckboxComponent[] = [];

  addCheckbox(value: MpCheckboxComponent): void {
    this.checkboxList.push(value);
  }

  removeCheckbox(value: MpCheckboxComponent): void {
    this.checkboxList.splice(this.checkboxList.indexOf(value), 1);
  }

  onChange(): void {
    const listOfCheckedValue = this.checkboxList
      .filter(item => item.mpChecked)
      .map(item => item.mpValue);
    this.mpOnChange.emit(listOfCheckedValue);
  }

  constructor(renderer: Renderer2, elementRef: ElementRef) {
    renderer.addClass(elementRef.nativeElement, 'ant-checkbox-group');
  }
}
