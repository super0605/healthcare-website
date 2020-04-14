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
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MpSafeAny, OnChangeType, OnTouchedType } from '../core/types';
import { InputBoolean } from '../core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MpRadioButtonDirective } from './radio-button.directive';
import { MpRadioService } from './radio.service';

@Component({
  selector: '[mp-radio],[mp-radio-button]',
  exportAs: 'mpRadio',
  preserveWhitespaces: false,
  template: `
    <span
      [class.ant-radio]="!isRadioButton"
      [class.ant-radio-checked]="isChecked && !isRadioButton"
      [class.ant-radio-disabled]="mpDisabled && !isRadioButton"
      [class.ant-radio-button]="isRadioButton"
      [class.ant-radio-button-checked]="isChecked && isRadioButton"
      [class.ant-radio-button-disabled]="mpDisabled && isRadioButton"
    >
      <input
        #inputElement
        type="radio"
        [attr.autofocus]="mpAutoFocus ? 'autofocus' : null"
        [class.ant-radio-input]="!isRadioButton"
        [class.ant-radio-button-input]="isRadioButton"
        [disabled]="mpDisabled"
        [checked]="isChecked"
        [attr.name]="name"
      />
      <span
        [class.ant-radio-inner]="!isRadioButton"
        [class.ant-radio-button-inner]="isRadioButton"
      ></span>
    </span>
    <span><ng-content></ng-content></span>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MpRadioComponent),
      multi: true
    }
  ],
  host: {
    '[class.ant-radio-wrapper]': '!isRadioButton',
    '[class.ant-radio-button-wrapper]': 'isRadioButton',
    '[class.ant-radio-wrapper-checked]': 'isChecked && !isRadioButton',
    '[class.ant-radio-button-wrapper-checked]': 'isChecked && isRadioButton',
    '[class.ant-radio-wrapper-disabled]': 'mpDisabled && !isRadioButton',
    '[class.ant-radio-button-wrapper-disabled]': 'mpDisabled && isRadioButton',
    '(click)': 'onHostClick($event)'
  }
})
export class MpRadioComponent
  implements ControlValueAccessor, AfterViewInit, OnDestroy, OnInit {
  private isNgModel = false;
  private destroy$ = new Subject<void>();
  isChecked = false;
  name: string | null = null;
  isRadioButton = !!this.mpRadioButtonDirective;
  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  @ViewChild('inputElement', { static: false }) inputElement: ElementRef;
  @Input() mpValue: MpSafeAny | null = null;
  @Input() @InputBoolean() mpDisabled = false;
  @Input() @InputBoolean() mpAutoFocus = false;

  onHostClick(event: MouseEvent): void {
    /** prevent label click triggered twice. **/
    event.stopPropagation();
    event.preventDefault();
    this.focus();
    if (!this.mpDisabled && !this.isChecked) {
      if (this.mpRadioService) {
        this.mpRadioService.select(this.mpValue);
      }
      if (this.isNgModel) {
        this.isChecked = true;
        this.onChange(true);
      }
    }
  }

  focus(): void {
    this.focusMonitor.focusVia(this.inputElement, 'keyboard');
  }

  blur(): void {
    this.inputElement.nativeElement.blur();
  }

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private focusMonitor: FocusMonitor,
    @Optional() private mpRadioService: MpRadioService,
    @Optional() private mpRadioButtonDirective: MpRadioButtonDirective
  ) {}

  setDisabledState(disabled: boolean): void {
    this.mpDisabled = disabled;
    this.cdr.markForCheck();
  }

  writeValue(value: boolean): void {
    this.isChecked = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.isNgModel = true;
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    if (this.mpRadioService) {
      this.mpRadioService.name$
        .pipe(takeUntil(this.destroy$))
        .subscribe(name => {
          this.name = name;
          this.cdr.markForCheck();
        });
      this.mpRadioService.disabled$
        .pipe(takeUntil(this.destroy$))
        .subscribe(disabled => {
          this.mpDisabled = disabled;
          this.cdr.markForCheck();
        });
      this.mpRadioService.selected$
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
          this.isChecked = this.mpValue === value;
          this.cdr.markForCheck();
        });
    }
    this.focusMonitor.monitor(this.elementRef, true).subscribe(focusOrigin => {
      if (!focusOrigin) {
        Promise.resolve().then(() => this.onTouched());
        if (this.mpRadioService) {
          this.mpRadioService.touch();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.mpAutoFocus) {
      this.focus();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.focusMonitor.stopMonitoring(this.elementRef);
  }
}
