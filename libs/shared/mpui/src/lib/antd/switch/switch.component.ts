/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { ENTER, LEFT_ARROW, RIGHT_ARROW, SPACE } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MpConfigService, WithConfig } from '../core/config';
import { MpSizeDSType, OnChangeType, OnTouchedType } from '../core/types';
import { InputBoolean } from '../core/util';

const NZ_CONFIG_COMPONENT_NAME = 'switch';

@Component({
  selector: 'mp-switch',
  exportAs: 'mpSwitch',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MpSwitchComponent),
      multi: true
    }
  ],
  template: `
    <button
      mp-wave
      type="button"
      class="ant-switch"
      #switchElement
      [disabled]="mpDisabled"
      [class.ant-switch-checked]="isChecked"
      [class.ant-switch-loading]="mpLoading"
      [class.ant-switch-disabled]="mpDisabled"
      [class.ant-switch-small]="mpSize === 'small'"
      [mpWaveExtraNode]="true"
      (keydown)="onKeyDown($event)"
    >
      <i
        *ngIf="mpLoading"
        mp-icon
        mpType="loading"
        class="ant-switch-loading-icon"
      ></i>
      <span class="ant-switch-inner">
        <ng-container *ngIf="isChecked; else uncheckTemplate">
          <ng-container *mpStringTemplateOutlet="mpCheckedChildren">{{
            mpCheckedChildren
          }}</ng-container>
        </ng-container>
        <ng-template #uncheckTemplate>
          <ng-container *mpStringTemplateOutlet="mpUnCheckedChildren">{{
            mpUnCheckedChildren
          }}</ng-container>
        </ng-template>
      </span>
      <div class="ant-click-animating-node"></div>
    </button>
  `,
  host: {
    '(click)': 'onHostClick($event)'
  }
})
export class MpSwitchComponent
  implements ControlValueAccessor, AfterViewInit, OnDestroy {
  isChecked = false;
  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  @ViewChild('switchElement', { static: true })
  private switchElement: ElementRef;
  @Input() @InputBoolean() mpLoading = false;
  @Input() @InputBoolean() mpDisabled = false;
  @Input() @InputBoolean() mpControl = false;
  @Input() mpCheckedChildren: string | TemplateRef<void> | null = null;
  @Input() mpUnCheckedChildren: string | TemplateRef<void> | null = null;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'default')
  mpSize: MpSizeDSType;

  onHostClick(e: MouseEvent): void {
    e.preventDefault();
    if (!this.mpDisabled && !this.mpLoading && !this.mpControl) {
      this.updateValue(!this.isChecked);
    }
  }

  updateValue(value: boolean): void {
    if (this.isChecked !== value) {
      this.isChecked = value;
      this.onChange(this.isChecked);
    }
  }

  onKeyDown(e: KeyboardEvent): void {
    if (!this.mpControl && !this.mpDisabled && !this.mpLoading) {
      if (e.keyCode === LEFT_ARROW) {
        this.updateValue(false);
        e.preventDefault();
      } else if (e.keyCode === RIGHT_ARROW) {
        this.updateValue(true);
        e.preventDefault();
      } else if (e.keyCode === SPACE || e.keyCode === ENTER) {
        this.updateValue(!this.isChecked);
        e.preventDefault();
      }
    }
  }

  focus(): void {
    this.focusMonitor.focusVia(this.switchElement.nativeElement, 'keyboard');
  }

  blur(): void {
    this.switchElement.nativeElement.blur();
  }

  constructor(
    public mpConfigService: MpConfigService,
    private cdr: ChangeDetectorRef,
    private focusMonitor: FocusMonitor
  ) {}

  ngAfterViewInit(): void {
    this.focusMonitor
      .monitor(this.switchElement.nativeElement, true)
      .subscribe(focusOrigin => {
        if (!focusOrigin) {
          /** https://github.com/angular/angular/issues/17793 **/
          Promise.resolve().then(() => this.onTouched());
        }
      });
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.switchElement.nativeElement);
  }

  writeValue(value: boolean): void {
    this.isChecked = value;
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
