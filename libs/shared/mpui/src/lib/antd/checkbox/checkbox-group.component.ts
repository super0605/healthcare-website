/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OnChangeType, OnTouchedType } from '../core/types';
import { InputBoolean } from '../core/util';

export interface MpCheckBoxOptionInterface {
  label: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'mp-checkbox-group',
  exportAs: 'mpCheckboxGroup',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  template: `
    <label
      mp-checkbox
      class="ant-checkbox-group-item"
      *ngFor="let o of options; trackBy: trackByOption"
      [mpDisabled]="o.disabled || mpDisabled"
      [(mpChecked)]="o.checked"
      (mpCheckedChange)="onChange(options)"
    >
      <span>{{ o.label }}</span>
    </label>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MpCheckboxGroupComponent),
      multi: true
    }
  ],
  host: {
    '[class.ant-checkbox-group]': 'true'
  }
})
export class MpCheckboxGroupComponent
  implements ControlValueAccessor, OnInit, OnDestroy {
  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  options: MpCheckBoxOptionInterface[] = [];
  @Input() @InputBoolean() mpDisabled = false;

  trackByOption(_: number, option: MpCheckBoxOptionInterface): string {
    return option.value;
  }

  constructor(
    private elementRef: ElementRef,
    private focusMonitor: FocusMonitor,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.focusMonitor.monitor(this.elementRef, true).subscribe(focusOrigin => {
      if (!focusOrigin) {
        Promise.resolve().then(() => this.onTouched());
      }
    });
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.elementRef);
  }

  writeValue(value: MpCheckBoxOptionInterface[]): void {
    this.options = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.mpDisabled = disabled;
    this.cdr.markForCheck();
  }
}
