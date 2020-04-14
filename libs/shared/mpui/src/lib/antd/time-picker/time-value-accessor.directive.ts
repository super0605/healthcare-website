/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateHelperService } from '../i18n';

@Directive({
  selector: 'input[mpTime]',
  exportAs: 'mpTime',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MpTimeValueAccessorDirective,
      multi: true
    }
  ]
})
export class MpTimeValueAccessorDirective implements ControlValueAccessor {
  private _onChange: (value: Date) => void;
  private _onTouch: () => void;
  @Input() mpTime: string;

  @HostListener('keyup')
  keyup(): void {
    this.changed();
  }

  @HostListener('blur')
  blur(): void {
    this.touched();
  }

  changed(): void {
    if (this._onChange) {
      const value = this.dateHelper.parseTime(
        this.elementRef.nativeElement.value,
        this.mpTime
      );
      this._onChange(value!);
    }
  }

  touched(): void {
    if (this._onTouch) {
      this._onTouch();
    }
  }

  setRange(): void {
    this.elementRef.nativeElement.focus();
    this.elementRef.nativeElement.setSelectionRange(
      0,
      this.elementRef.nativeElement.value.length
    );
  }

  constructor(
    private dateHelper: DateHelperService,
    private elementRef: ElementRef
  ) {}

  writeValue(value: Date): void {
    this.elementRef.nativeElement.value = this.dateHelper.format(
      value,
      this.mpTime
    );
  }

  registerOnChange(fn: (value: Date) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouch = fn;
  }
}
