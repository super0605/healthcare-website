/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MpSafeAny, OnChangeType, OnTouchedType } from '../core/types';
import { InputBoolean } from '../core/util';
import { MpCheckboxWrapperComponent } from './checkbox-wrapper.component';

@Component({
  selector: '[mp-checkbox]',
  exportAs: 'mpCheckbox',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span
      class="ant-checkbox"
      [class.ant-checkbox-checked]="mpChecked && !mpIndeterminate"
      [class.ant-checkbox-disabled]="mpDisabled"
      [class.ant-checkbox-indeterminate]="mpIndeterminate"
    >
      <input
        #inputElement
        type="checkbox"
        class="ant-checkbox-input"
        [attr.autofocus]="mpAutoFocus ? 'autofocus' : null"
        [checked]="mpChecked"
        [ngModel]="mpChecked"
        [disabled]="mpDisabled"
        (ngModelChange)="innerCheckedChange($event)"
        (click)="$event.stopPropagation()"
      />
      <span class="ant-checkbox-inner"></span>
    </span>
    <span><ng-content></ng-content></span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MpCheckboxComponent),
      multi: true
    }
  ],
  host: {
    '[class.ant-checkbox-wrapper]': 'true',
    '[class.ant-checkbox-wrapper-checked]': 'mpChecked',
    '(click)': 'hostClick($event)'
  }
})
export class MpCheckboxComponent
  implements OnInit, ControlValueAccessor, OnDestroy, AfterViewInit {
  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  @ViewChild('inputElement', { static: true }) private inputElement: ElementRef;
  @Output() readonly mpCheckedChange = new EventEmitter<boolean>();
  @Input() mpValue: MpSafeAny | null = null;
  @Input() @InputBoolean() mpAutoFocus = false;
  @Input() @InputBoolean() mpDisabled = false;
  @Input() @InputBoolean() mpIndeterminate = false;
  @Input() @InputBoolean() mpChecked = false;

  hostClick(e: MouseEvent): void {
    e.preventDefault();
    this.focus();
    this.innerCheckedChange(!this.mpChecked);
  }

  innerCheckedChange(checked: boolean): void {
    if (!this.mpDisabled) {
      this.mpChecked = checked;
      this.onChange(this.mpChecked);
      this.mpCheckedChange.emit(this.mpChecked);
      if (this.mpCheckboxWrapperComponent) {
        this.mpCheckboxWrapperComponent.onChange();
      }
    }
  }

  writeValue(value: boolean): void {
    this.mpChecked = value;
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

  focus(): void {
    this.focusMonitor.focusVia(this.inputElement, 'keyboard');
  }

  blur(): void {
    this.inputElement.nativeElement.blur();
  }

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Optional() private mpCheckboxWrapperComponent: MpCheckboxWrapperComponent,
    private cdr: ChangeDetectorRef,
    private focusMonitor: FocusMonitor
  ) {}

  ngOnInit(): void {
    this.focusMonitor.monitor(this.elementRef, true).subscribe(focusOrigin => {
      if (!focusOrigin) {
        Promise.resolve().then(() => this.onTouched());
      }
    });
    if (this.mpCheckboxWrapperComponent) {
      this.mpCheckboxWrapperComponent.addCheckbox(this);
    }
  }
  ngAfterViewInit(): void {
    if (this.mpAutoFocus) {
      this.focus();
    }
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.elementRef);
    if (this.mpCheckboxWrapperComponent) {
      this.mpCheckboxWrapperComponent.removeCheckbox(this);
    }
  }
}
