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
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  MpSafeAny,
  MpSizeLDSType,
  OnChangeType,
  OnTouchedType
} from '../core/types';
import { InputBoolean } from '../core/util';
import { Subject } from 'rxjs';
import { MpRadioService } from './radio.service';

export type MpRadioButtonStyle = 'outline' | 'solid';

@Component({
  selector: 'mp-radio-group',
  exportAs: 'mpRadioGroup',
  preserveWhitespaces: false,
  template: `
    <ng-content></ng-content>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MpRadioService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MpRadioGroupComponent),
      multi: true
    }
  ],
  host: {
    '[class.ant-radio-group]': `true`,
    '[class.ant-radio-group-large]': `mpSize === 'large'`,
    '[class.ant-radio-group-small]': `mpSize === 'small'`,
    '[class.ant-radio-group-solid]': `mpButtonStyle === 'solid'`
  }
})
export class MpRadioGroupComponent
  implements OnInit, ControlValueAccessor, OnDestroy, OnChanges {
  private value: MpSafeAny | null = null;
  private destroy$ = new Subject();
  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  @Input() @InputBoolean() mpDisabled = false;
  @Input() mpButtonStyle: MpRadioButtonStyle = 'outline';
  @Input() mpSize: MpSizeLDSType = 'default';
  @Input() mpName: string | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private mpRadioService: MpRadioService
  ) {}

  ngOnInit(): void {
    this.mpRadioService.selected$.subscribe(value => {
      if (this.value !== value) {
        this.value = value;
        this.onChange(this.value);
      }
    });
    this.mpRadioService.touched$.subscribe(() => {
      Promise.resolve().then(() => this.onTouched());
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpDisabled, mpName } = changes;
    if (mpDisabled) {
      this.mpRadioService.setDisabled(this.mpDisabled);
    }
    if (mpName) {
      this.mpRadioService.setName(this.mpName!);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: MpSafeAny): void {
    this.value = value;
    this.mpRadioService.select(value);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.mpDisabled = isDisabled;
    this.mpRadioService.setDisabled(isDisabled);
    this.cdr.markForCheck();
  }
}
