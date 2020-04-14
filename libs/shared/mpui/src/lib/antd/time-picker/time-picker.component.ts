/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CdkOverlayOrigin, ConnectionPositionPair } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { slideMotion } from '../core/animation';

import { MpConfigService, WithConfig } from '../core/config';
import { warn } from '../core/logger';
import { InputBoolean, isNotNil } from '../core/util';

const NZ_CONFIG_COMPONENT_NAME = 'timePicker';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mp-time-picker',
  exportAs: 'mpTimePicker',
  template: `
    <div class="ant-picker-input">
      <input
        #inputElement
        type="text"
        [size]="inputSize"
        [mpTime]="mpFormat"
        [placeholder]="mpPlaceHolder || ('TimePicker.placeholder' | mpI18n)"
        [(ngModel)]="value"
        [disabled]="mpDisabled"
        (click)="open()"
        (focus)="onFocus(true)"
        (blur)="onFocus(false)"
      />
      <span class="ant-picker-suffix">
        <i mp-icon mpType="clock-circle"></i>
      </span>
      <span
        *ngIf="mpAllowEmpty && value"
        class="ant-picker-clear"
        (click)="onClickClearBtn()"
      >
        <i
          mp-icon
          mpType="close-circle"
          mpTheme="fill"
          [attr.aria-label]="mpClearText"
          [attr.title]="mpClearText"
        ></i>
      </span>
    </div>

    <ng-template
      cdkConnectedOverlay
      mpConnectedOverlay
      cdkConnectedOverlayHasBackdrop
      [cdkConnectedOverlayPositions]="overlayPositions"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="mpOpen"
      [cdkConnectedOverlayOffsetY]="-2"
      (detach)="close()"
      (backdropClick)="close()"
    >
      <div [@slideMotion]="'bottom'" class="ant-picker-dropdown">
        <div class="ant-picker-panel-container">
          <div tabindex="-1" class="ant-picker-panel">
            <mp-time-picker-panel
              [ngClass]="mpPopupClassName"
              [format]="mpFormat"
              [mpHourStep]="mpHourStep"
              [mpMinuteStep]="mpMinuteStep"
              [mpSecondStep]="mpSecondStep"
              [mpDisabledHours]="mpDisabledHours"
              [mpDisabledMinutes]="mpDisabledMinutes"
              [mpDisabledSeconds]="mpDisabledSeconds"
              [mpPlaceHolder]="
                mpPlaceHolder || ('TimePicker.placeholder' | mpI18n)
              "
              [mpHideDisabledOptions]="mpHideDisabledOptions"
              [mpUse12Hours]="mpUse12Hours"
              [mpDefaultOpenValue]="mpDefaultOpenValue"
              [mpAddOn]="mpAddOn"
              [opened]="mpOpen"
              [mpClearText]="mpClearText"
              [mpAllowEmpty]="mpAllowEmpty"
              [(ngModel)]="value"
              (ngModelChange)="setValue($event)"
              (closePanel)="close()"
            >
            </mp-time-picker-panel>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  host: { '[class]': 'hostClassMap' },
  animations: [slideMotion],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MpTimePickerComponent,
      multi: true
    }
  ]
})
export class MpTimePickerComponent
  implements ControlValueAccessor, OnInit, AfterViewInit, OnChanges {
  private _onChange: (value: Date | null) => void;
  private _onTouched: () => void;
  isInit = false;
  focused = false;
  value: Date | null = null;
  origin: CdkOverlayOrigin;
  hostClassMap = {};
  inputSize: number;
  overlayPositions: ConnectionPositionPair[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: 0,
      offsetY: 3
    }
  ];

  @ViewChild('inputElement', { static: true }) inputRef: ElementRef<
    HTMLInputElement
  >;
  @Input() mpSize: string | null = null;
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME, 1) mpHourStep: number;
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME, 1) mpMinuteStep: number;
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME, 1) mpSecondStep: number;
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'clear') mpClearText: string;
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME) mpPopupClassName: string;
  @Input() mpPlaceHolder = '';
  @Input() mpAddOn: TemplateRef<void>;
  @Input() mpDefaultOpenValue = new Date();
  @Input() mpDisabledHours: () => number[];
  @Input() mpDisabledMinutes: (hour: number) => number[];
  @Input() mpDisabledSeconds: (hour: number, minute: number) => number[];
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'HH:mm:ss') mpFormat: string;
  @Input() mpOpen = false;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  @InputBoolean()
  mpUse12Hours: boolean;
  @Output() readonly mpOpenChange = new EventEmitter<boolean>();

  @Input() @InputBoolean() mpHideDisabledOptions = false;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, true)
  @InputBoolean()
  mpAllowEmpty: boolean;
  @Input() @InputBoolean() mpDisabled = false;
  @Input() @InputBoolean() mpAutoFocus = false;

  setValue(value: Date | null): void {
    this.value = value;
    if (this._onChange) {
      this._onChange(this.value);
    }
    if (this._onTouched) {
      this._onTouched();
    }
  }

  open(): void {
    if (this.mpDisabled) {
      return;
    }
    this.focus();
    this.setClassMap();
    this.mpOpen = true;
    this.mpOpenChange.emit(this.mpOpen);
  }

  close(): void {
    this.mpOpen = false;
    this.cdr.markForCheck();
    this.mpOpenChange.emit(this.mpOpen);
  }

  updateAutoFocus(): void {
    if (this.isInit && !this.mpDisabled) {
      if (this.mpAutoFocus) {
        this.renderer.setAttribute(
          this.inputRef.nativeElement,
          'autofocus',
          'autofocus'
        );
      } else {
        this.renderer.removeAttribute(this.inputRef.nativeElement, 'autofocus');
      }
    }
  }

  onClickClearBtn(): void {
    this.setValue(null);
  }

  onFocus(value: boolean): void {
    this.focused = value;
    this.setClassMap();
  }

  private setClassMap(): void {
    this.hostClassMap = {
      [`ant-picker`]: true,
      [`ant-picker-${this.mpSize}`]: isNotNil(this.mpSize),
      [`ant-picker-disabled`]: this.mpDisabled,
      [`ant-picker-focused`]: this.focused
    };
  }

  focus(): void {
    if (this.inputRef.nativeElement) {
      this.inputRef.nativeElement.focus();
    }
  }

  blur(): void {
    if (this.inputRef.nativeElement) {
      this.inputRef.nativeElement.blur();
    }
  }

  constructor(
    public mpConfigService: MpConfigService,
    private element: ElementRef,
    private renderer: Renderer2,
    public cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.inputSize = Math.max(8, this.mpFormat.length) + 2;
    this.setClassMap();
    this.origin = new CdkOverlayOrigin(this.element);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpUse12Hours, mpFormat, mpDisabled, mpAutoFocus } = changes;
    if (
      mpUse12Hours &&
      !mpUse12Hours.previousValue &&
      mpUse12Hours.currentValue &&
      !mpFormat
    ) {
      this.mpFormat = 'h:mm:ss a';
    }
    if (mpDisabled) {
      const value = mpDisabled.currentValue;
      const input = this.inputRef.nativeElement as HTMLInputElement;
      if (value) {
        this.renderer.setAttribute(input, 'disabled', '');
      } else {
        this.renderer.removeAttribute(input, 'disabled');
      }
    }
    if (mpAutoFocus) {
      this.updateAutoFocus();
    }
  }

  ngAfterViewInit(): void {
    this.isInit = true;
    this.updateAutoFocus();
  }

  writeValue(time: Date): void {
    if (time instanceof Date) {
      this.value = time;
    } else {
      warn('Non-Date type is not recommended for time-picker, use "Date" type');
      this.value = time ? new Date(time) : null;
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (time: Date | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.mpDisabled = isDisabled;
    this.cdr.markForCheck();
  }
}
