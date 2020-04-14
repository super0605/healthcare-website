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
  DebugElement,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { reqAnimFrame } from '../core/polyfill';

import { InputBoolean, isNotNil } from '../core/util';
import { DateHelperService } from '../i18n';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TimeHolder } from './time-holder';
import { MpTimeValueAccessorDirective } from './time-value-accessor.directive';

function makeRange(
  length: number,
  step: number = 1,
  start: number = 0
): number[] {
  return new Array(Math.ceil(length / step))
    .fill(0)
    .map((_, i) => (i + start) * step);
}

export type MpTimePickerUnit = 'hour' | 'minute' | 'second' | '12-hour';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mp-time-picker-panel',
  exportAs: 'mpTimePickerPanel',
  template: `
    <div *ngIf="mpInDatePicker" class="ant-picker-header">
      <div class="ant-picker-header-view">
        {{ dateHelper.format(time?.value, format) || '&nbsp;' }}
      </div>
    </div>
    <div class="ant-picker-content">
      <ul
        *ngIf="hourEnabled"
        #hourListElement
        class="{{ prefixCls }}-column"
        style="position: relative;"
      >
        <ng-container *ngFor="let hour of hourRange">
          <li
            *ngIf="!(mpHideDisabledOptions && hour.disabled)"
            (click)="selectHour(hour)"
            class="
                {{ prefixCls }}-cell
                {{ isSelectedHour(hour) ? prefixCls + '-cell-selected' : '' }}
                {{ hour.disabled ? prefixCls + '-cell-disabled' : '' }}
              "
          >
            <div class="{{ prefixCls }}-cell-inner">
              {{ hour.index | number: '2.0-0' }}
            </div>
          </li>
        </ng-container>
      </ul>
      <ul
        *ngIf="minuteEnabled"
        #minuteListElement
        class="{{ prefixCls }}-column"
        style="position: relative;"
      >
        <ng-container *ngFor="let minute of minuteRange">
          <li
            *ngIf="!(mpHideDisabledOptions && minute.disabled)"
            (click)="selectMinute(minute)"
            class="
                {{ prefixCls }}-cell
                {{
              isSelectedMinute(minute) ? prefixCls + '-cell-selected' : ''
            }}
                {{ minute.disabled ? prefixCls + '-cell-disabled' : '' }}
              "
          >
            <div class="{{ prefixCls }}-cell-inner">
              {{ minute.index | number: '2.0-0' }}
            </div>
          </li>
        </ng-container>
      </ul>
      <ul
        *ngIf="secondEnabled"
        #secondListElement
        class="{{ prefixCls }}-column"
        style="position: relative;"
      >
        <ng-container *ngFor="let second of secondRange">
          <li
            *ngIf="!(mpHideDisabledOptions && second.disabled)"
            (click)="selectSecond(second)"
            class="
                {{ prefixCls }}-cell
                {{
              isSelectedSecond(second) ? prefixCls + '-cell-selected' : ''
            }}
                {{ second.disabled ? prefixCls + '-cell-disabled' : '' }}
              "
          >
            <div class="{{ prefixCls }}-cell-inner">
              {{ second.index | number: '2.0-0' }}
            </div>
          </li>
        </ng-container>
      </ul>
      <ul
        *ngIf="mpUse12Hours"
        #use12HoursListElement
        class="{{ prefixCls }}-column"
      >
        <ng-container *ngFor="let range of use12HoursRange">
          <li
            *ngIf="!mpHideDisabledOptions"
            (click)="select12Hours(range)"
            class="
                {{ prefixCls }}-cell
                {{
              isSelected12Hours(range) ? prefixCls + '-cell-selected' : ''
            }}
              "
          >
            <div class="{{ prefixCls }}-cell-inner">{{ range.value }}</div>
          </li>
        </ng-container>
      </ul>
    </div>
    <div *ngIf="!mpInDatePicker" class="ant-picker-footer">
      <div *ngIf="mpAddOn" class="ant-picker-footer-extra">
        <ng-template [ngTemplateOutlet]="mpAddOn"></ng-template>
      </div>
      <ul class="ant-picker-ranges">
        <li class="ant-picker-now">
          <a (click)="onClickNow()">
            {{ 'Calendar.now' | mpI18n }}
          </a>
        </li>
      </ul>
    </div>
  `,
  host: { '[class]': 'hostClassMap' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MpTimePickerPanelComponent,
      multi: true
    }
  ]
})
export class MpTimePickerPanelComponent
  implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  private _mpHourStep = 1;
  private _mpMinuteStep = 1;
  private _mpSecondStep = 1;
  private unsubscribe$ = new Subject<void>();
  private onChange: (value: Date) => void;
  private onTouch: () => void;
  private _format = 'HH:mm:ss';
  private _disabledHours: () => number[];
  private _disabledMinutes: (hour: number) => number[];
  private _disabledSeconds: (hour: number, minute: number) => number[];
  private _allowEmpty = true;
  prefixCls: string = 'ant-picker-time-panel';
  time = new TimeHolder();
  hourEnabled = true;
  minuteEnabled = true;
  secondEnabled = true;
  enabledColumns = 3;
  hostClassMap = {};
  hourRange: ReadonlyArray<{ index: number; disabled: boolean }>;
  minuteRange: ReadonlyArray<{ index: number; disabled: boolean }>;
  secondRange: ReadonlyArray<{ index: number; disabled: boolean }>;
  use12HoursRange: ReadonlyArray<{ index: number; value: string }>;

  @ViewChild(MpTimeValueAccessorDirective, { static: false })
  mpTimeValueAccessorDirective: MpTimeValueAccessorDirective;
  @ViewChild('hourListElement', { static: false })
  hourListElement: DebugElement;
  @ViewChild('minuteListElement', { static: false })
  minuteListElement: DebugElement;
  @ViewChild('secondListElement', { static: false })
  secondListElement: DebugElement;
  @ViewChild('use12HoursListElement', { static: false })
  use12HoursListElement: DebugElement;

  @Input() mpInDatePicker: boolean = false; // If inside a date-picker, more diff works need to be done
  @Input() mpAddOn: TemplateRef<void>;
  @Input() mpHideDisabledOptions = false;
  @Input() mpClearText: string;
  @Input() mpPlaceHolder: string;
  @Input() @InputBoolean() mpUse12Hours = false;
  @Input() mpDefaultOpenValue = new Date();
  @Input() opened = false;

  @Output() readonly closePanel = new EventEmitter<void>();

  @Input()
  set mpAllowEmpty(value: boolean) {
    if (isNotNil(value)) {
      this._allowEmpty = value;
    }
  }

  get mpAllowEmpty(): boolean {
    return this._allowEmpty;
  }

  @Input()
  set mpDisabledHours(value: () => number[]) {
    this._disabledHours = value;
    if (!!this._disabledHours) {
      this.buildHours();
    }
  }

  get mpDisabledHours(): () => number[] {
    return this._disabledHours;
  }

  @Input()
  set mpDisabledMinutes(value: (hour: number) => number[]) {
    if (isNotNil(value)) {
      this._disabledMinutes = value;
      this.buildMinutes();
    }
  }

  get mpDisabledMinutes(): (hour: number) => number[] {
    return this._disabledMinutes;
  }

  @Input()
  set mpDisabledSeconds(value: (hour: number, minute: number) => number[]) {
    if (isNotNil(value)) {
      this._disabledSeconds = value;
      this.buildSeconds();
    }
  }

  get mpDisabledSeconds(): (hour: number, minute: number) => number[] {
    return this._disabledSeconds;
  }

  @Input()
  set format(value: string) {
    if (isNotNil(value)) {
      this._format = value;
      this.enabledColumns = 0;
      const charSet = new Set(value);
      this.hourEnabled = charSet.has('H') || charSet.has('h');
      this.minuteEnabled = charSet.has('m');
      this.secondEnabled = charSet.has('s');
      if (this.hourEnabled) {
        this.enabledColumns++;
      }
      if (this.minuteEnabled) {
        this.enabledColumns++;
      }
      if (this.secondEnabled) {
        this.enabledColumns++;
      }
      if (this.mpUse12Hours) {
        this.build12Hours();
      }
    }
  }

  get format(): string {
    return this._format;
  }

  @Input()
  set mpHourStep(value: number) {
    if (isNotNil(value)) {
      this._mpHourStep = value;
      this.buildHours();
    }
  }

  get mpHourStep(): number {
    return this._mpHourStep;
  }

  @Input()
  set mpMinuteStep(value: number) {
    if (isNotNil(value)) {
      this._mpMinuteStep = value;
      this.buildMinutes();
    }
  }

  get mpMinuteStep(): number {
    return this._mpMinuteStep;
  }

  @Input()
  set mpSecondStep(value: number) {
    if (isNotNil(value)) {
      this._mpSecondStep = value;
      this.buildSeconds();
    }
  }

  get mpSecondStep(): number {
    return this._mpSecondStep;
  }

  selectInputRange(): void {
    setTimeout(() => {
      if (this.mpTimeValueAccessorDirective) {
        this.mpTimeValueAccessorDirective.setRange();
      }
    });
  }

  buildHours(): void {
    let hourRanges = 24;
    let disabledHours = this.mpDisabledHours && this.mpDisabledHours();
    let startIndex = 0;
    if (this.mpUse12Hours) {
      hourRanges = 12;
      if (disabledHours) {
        if (this.time.selected12Hours === 'PM') {
          /**
           * Filter and transform hours which greater or equal to 12
           * [0, 1, 2, ..., 12, 13, 14, 15, ..., 23] => [12, 1, 2, 3, ..., 11]
           */
          disabledHours = disabledHours
            .filter(i => i >= 12)
            .map(i => (i > 12 ? i - 12 : i));
        } else {
          /**
           * Filter and transform hours which less than 12
           * [0, 1, 2,..., 12, 13, 14, 15, ...23] => [12, 1, 2, 3, ..., 11]
           */
          disabledHours = disabledHours
            .filter(i => i < 12 || i === 24)
            .map(i => (i === 24 || i === 0 ? 12 : i));
        }
      }
      startIndex = 1;
    }
    this.hourRange = makeRange(hourRanges, this.mpHourStep, startIndex).map(
      r => {
        return {
          index: r,
          disabled: disabledHours && disabledHours.indexOf(r) !== -1
        };
      }
    );
    if (
      this.mpUse12Hours &&
      this.hourRange[this.hourRange.length - 1].index === 12
    ) {
      const temp = [...this.hourRange];
      temp.unshift(temp[temp.length - 1]);
      temp.splice(temp.length - 1, 1);
      this.hourRange = temp;
    }
  }

  buildMinutes(): void {
    this.minuteRange = makeRange(60, this.mpMinuteStep).map(r => {
      return {
        index: r,
        disabled:
          this.mpDisabledMinutes &&
          this.mpDisabledMinutes(this.time.hours!).indexOf(r) !== -1
      };
    });
  }

  buildSeconds(): void {
    this.secondRange = makeRange(60, this.mpSecondStep).map(r => {
      return {
        index: r,
        disabled:
          this.mpDisabledSeconds &&
          this.mpDisabledSeconds(this.time.hours!, this.time.minutes!).indexOf(
            r
          ) !== -1
      };
    });
  }

  build12Hours(): void {
    const isUpperForamt = this._format.includes('A');
    this.use12HoursRange = [
      {
        index: 0,
        value: isUpperForamt ? 'AM' : 'am'
      },
      {
        index: 1,
        value: isUpperForamt ? 'PM' : 'pm'
      }
    ];
  }

  buildTimes(): void {
    this.buildHours();
    this.buildMinutes();
    this.buildSeconds();
    this.build12Hours();
  }

  selectHour(hour: { index: number; disabled: boolean }): void {
    this.time.setHours(hour.index, hour.disabled);
    this.scrollToSelected(
      this.hourListElement.nativeElement,
      hour.index,
      120,
      'hour'
    );
    if (!!this._disabledMinutes) {
      this.buildMinutes();
    }
    if (this._disabledSeconds || this._disabledMinutes) {
      this.buildSeconds();
    }
  }

  selectMinute(minute: { index: number; disabled: boolean }): void {
    this.time.setMinutes(minute.index, minute.disabled);
    this.scrollToSelected(
      this.minuteListElement.nativeElement,
      minute.index,
      120,
      'minute'
    );
    if (!!this._disabledSeconds) {
      this.buildSeconds();
    }
  }

  selectSecond(second: { index: number; disabled: boolean }): void {
    this.time.setSeconds(second.index, second.disabled);
    this.scrollToSelected(
      this.secondListElement.nativeElement,
      second.index,
      120,
      'second'
    );
  }

  select12Hours(value: { index: number; value: string }): void {
    this.time.selected12Hours = value.value;
    if (!!this._disabledHours) {
      this.buildHours();
    }
    if (!!this._disabledMinutes) {
      this.buildMinutes();
    }
    if (!!this._disabledSeconds) {
      this.buildSeconds();
    }
    this.scrollToSelected(
      this.use12HoursListElement.nativeElement,
      value.index,
      120,
      '12-hour'
    );
  }

  scrollToSelected(
    instance: HTMLElement,
    index: number,
    duration: number = 0,
    unit: MpTimePickerUnit
  ): void {
    const transIndex = this.translateIndex(index, unit);
    const currentOption = (instance.children[transIndex] ||
      instance.children[0]) as HTMLElement;
    const parentPaddingTop = 4;
    this.scrollTo(
      instance,
      currentOption.offsetTop - parentPaddingTop,
      duration
    );
  }

  translateIndex(index: number, unit: MpTimePickerUnit): number {
    if (unit === 'hour') {
      return this.calcIndex(
        this.mpDisabledHours && this.mpDisabledHours(),
        this.hourRange.map(item => item.index).indexOf(index)
      );
    } else if (unit === 'minute') {
      return this.calcIndex(
        this.mpDisabledMinutes && this.mpDisabledMinutes(this.time.hours!),
        this.minuteRange.map(item => item.index).indexOf(index)
      );
    } else if (unit === 'second') {
      // second
      return this.calcIndex(
        this.mpDisabledSeconds &&
          this.mpDisabledSeconds(this.time.hours!, this.time.minutes!),
        this.secondRange.map(item => item.index).indexOf(index)
      );
    } else {
      // 12-hour
      return this.calcIndex(
        [],
        this.use12HoursRange.map(item => item.index).indexOf(index)
      );
    }
  }

  scrollTo(element: HTMLElement, to: number, duration: number): void {
    if (duration <= 0) {
      element.scrollTop = to;
      return;
    }
    const difference = to - element.scrollTop;
    const perTick = (difference / duration) * 10;

    reqAnimFrame(() => {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) {
        return;
      }
      this.scrollTo(element, to, duration - 10);
    });
  }

  calcIndex(array: number[] | undefined, index: number): number {
    if (array && array.length && this.mpHideDisabledOptions) {
      return (
        index -
        array.reduce((pre, value) => {
          return pre + (value < index ? 1 : 0);
        }, 0)
      );
    } else {
      return index;
    }
  }

  protected changed(): void {
    if (this.onChange) {
      this.onChange(this.time.value!);
    }
  }

  protected touched(): void {
    if (this.onTouch) {
      this.onTouch();
    }
  }

  private setClassMap(): void {
    this.hostClassMap = {
      [`${this.prefixCls}`]: true,
      [`${this.prefixCls}-column-${this.enabledColumns}`]: !this.mpInDatePicker,
      [`${this.prefixCls}-narrow`]: this.enabledColumns < 3,
      [`${this.prefixCls}-placement-bottomLeft`]: !this.mpInDatePicker
    };
  }

  timeDisabled(value: Date): boolean {
    const hour = value.getHours();
    const minute = value.getMinutes();
    const second = value.getSeconds();
    return (
      (this.mpDisabledHours && this.mpDisabledHours().indexOf(hour)) > -1 ||
      (this.mpDisabledMinutes && this.mpDisabledMinutes(hour).indexOf(minute)) >
        -1 ||
      (this.mpDisabledSeconds &&
        this.mpDisabledSeconds(hour, minute).indexOf(second)) > -1
    );
  }

  onClickNow(): void {
    const now = new Date();
    if (this.timeDisabled(now)) {
      return;
    }
    this.time.value = now;
    this.changed();
    this.closePanel.emit();
  }

  isSelectedHour(hour: { index: number; disabled: boolean }): boolean {
    return (
      hour.index === this.time.viewHours ||
      (!isNotNil(this.time.viewHours) &&
        hour.index === this.time.defaultViewHours)
    );
  }

  isSelectedMinute(minute: { index: number; disabled: boolean }): boolean {
    return (
      minute.index === this.time.minutes ||
      (!isNotNil(this.time.minutes) &&
        minute.index === this.time.defaultMinutes)
    );
  }

  isSelectedSecond(second: { index: number; disabled: boolean }): boolean {
    return (
      second.index === this.time.seconds ||
      (!isNotNil(this.time.seconds) &&
        second.index === this.time.defaultSeconds)
    );
  }

  isSelected12Hours(value: { index: number; value: string }): boolean {
    return (
      value.value.toUpperCase() === this.time.selected12Hours ||
      (!isNotNil(this.time.selected12Hours) &&
        value.value.toUpperCase() === this.time.default12Hours)
    );
  }

  initPosition(): void {
    setTimeout(() => {
      if (this.hourEnabled && this.hourListElement) {
        if (isNotNil(this.time.viewHours)) {
          this.scrollToSelected(
            this.hourListElement.nativeElement,
            this.time.viewHours!,
            0,
            'hour'
          );
        } else {
          this.scrollToSelected(
            this.hourListElement.nativeElement,
            this.time.defaultViewHours,
            0,
            'hour'
          );
        }
      }
      if (this.minuteEnabled && this.minuteListElement) {
        if (isNotNil(this.time.minutes)) {
          this.scrollToSelected(
            this.minuteListElement.nativeElement,
            this.time.minutes!,
            0,
            'minute'
          );
        } else {
          this.scrollToSelected(
            this.minuteListElement.nativeElement,
            this.time.defaultMinutes,
            0,
            'minute'
          );
        }
      }
      if (this.secondEnabled && this.secondListElement) {
        if (isNotNil(this.time.seconds)) {
          this.scrollToSelected(
            this.secondListElement.nativeElement,
            this.time.seconds!,
            0,
            'second'
          );
        } else {
          this.scrollToSelected(
            this.secondListElement.nativeElement,
            this.time.defaultSeconds,
            0,
            'second'
          );
        }
      }
      if (this.mpUse12Hours && this.use12HoursListElement) {
        const selectedHours = isNotNil(this.time.selected12Hours)
          ? this.time.selected12Hours
          : this.time.default12Hours;
        const index = selectedHours === 'AM' ? 0 : 1;
        this.scrollToSelected(
          this.use12HoursListElement.nativeElement,
          index,
          0,
          '12-hour'
        );
      }
    });
  }

  constructor(
    private cdr: ChangeDetectorRef,
    public dateHelper: DateHelperService
  ) {}

  ngOnInit(): void {
    this.time.changes.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.changed();
      this.touched();
    });
    this.buildTimes();
    this.setClassMap();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpUse12Hours, opened, mpDefaultOpenValue } = changes;
    if (
      !mpUse12Hours &&
      !mpUse12Hours.previousValue &&
      mpUse12Hours &&
      mpUse12Hours.currentValue
    ) {
      this.build12Hours();
      this.enabledColumns++;
    }
    if (opened && opened.currentValue) {
      this.initPosition();
      this.selectInputRange();
    }
    if (mpDefaultOpenValue) {
      const value: Date = mpDefaultOpenValue.currentValue;
      if (isNotNil(value)) {
        this.time.setDefaultOpenValue(this.mpDefaultOpenValue);
      }
    }
  }

  writeValue(value: Date): void {
    this.time.setValue(value, this.mpUse12Hours);
    this.buildTimes();

    // Mark this component to be checked manually with internal properties changing (see: https://github.com/angular/angular/issues/10816)
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: Date) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
}
