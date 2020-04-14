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
  ContentChild,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CandyDate } from '../core/time';
import { InputBoolean } from '../core/util';
import {
  MpDateCellDirective as DateCell,
  MpDateFullCellDirective as DateFullCell,
  MpMonthCellDirective as MonthCell,
  MpMonthFullCellDirective as MonthFullCell
} from './calendar-cells';

type MpCalendarMode = 'month' | 'year';
type MpCalendarDateTemplate = TemplateRef<{ $implicit: Date }>;

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mp-calendar',
  exportAs: 'mpCalendar',
  template: `
    <mp-calendar-header
      [fullscreen]="mpFullscreen"
      [activeDate]="activeDate"
      [(mode)]="mpMode"
      (modeChange)="onModeChange($event)"
      (yearChange)="onYearSelect($event)"
      (monthChange)="onMonthSelect($event)"
    >
    </mp-calendar-header>

    <div class="ant-picker-panel">
      <div class="ant-picker-{{ mpMode === 'month' ? 'date' : 'month' }}-panel">
        <div class="ant-picker-body">
          <ng-container
            *ngIf="mpMode === 'month'; then monthModeTable; else yearModeTable"
          ></ng-container>
        </div>
      </div>
    </div>
    <ng-template #monthModeTable>
      <date-table
        [prefixCls]="prefixCls"
        [value]="activeDate"
        [activeDate]="activeDate"
        [cellRender]="dateCell"
        [fullCellRender]="dateFullCell"
        (valueChange)="onDateSelect($event)"
      ></date-table>
    </ng-template>

    <ng-template #yearModeTable>
      <month-table
        [prefixCls]="prefixCls"
        [value]="activeDate"
        [activeDate]="activeDate"
        [cellRender]="monthCell"
        [fullCellRender]="monthFullCell"
        (valueChange)="onDateSelect($event)"
      ></month-table>
    </ng-template>
  `,
  host: {
    '[class.ant-picker-calendar]': 'true',
    '[class.ant-picker-calendar-full]': 'mpFullscreen',
    '[class.ant-picker-calendar-mini]': '!mpFullscreen'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MpCalendarComponent),
      multi: true
    }
  ]
})
export class MpCalendarComponent implements ControlValueAccessor, OnChanges {
  activeDate: CandyDate = new CandyDate();
  prefixCls: string = 'ant-picker-calendar';

  private onChangeFn: (date: Date) => void = () => {};
  private onTouchFn: () => void = () => {};

  @Input() mpMode: MpCalendarMode = 'month';
  @Input() mpValue: Date;

  @Output() readonly mpModeChange: EventEmitter<
    MpCalendarMode
  > = new EventEmitter();
  @Output() readonly mpPanelChange: EventEmitter<{
    date: Date;
    mode: MpCalendarMode;
  }> = new EventEmitter();
  @Output() readonly mpSelectChange: EventEmitter<Date> = new EventEmitter();
  @Output() readonly mpValueChange: EventEmitter<Date> = new EventEmitter();

  /**
   * Cannot use @Input and @ContentChild on one variable
   * because { static: false } will make @Input property get delayed
   **/
  @Input() mpDateCell: MpCalendarDateTemplate;
  @ContentChild(DateCell, { static: false, read: TemplateRef })
  mpDateCellChild: MpCalendarDateTemplate;
  get dateCell(): MpCalendarDateTemplate {
    return this.mpDateCell || this.mpDateCellChild;
  }

  @Input() mpDateFullCell: MpCalendarDateTemplate;
  @ContentChild(DateFullCell, { static: false, read: TemplateRef })
  mpDateFullCellChild: MpCalendarDateTemplate;
  get dateFullCell(): MpCalendarDateTemplate {
    return this.mpDateFullCell || this.mpDateFullCellChild;
  }

  @Input() mpMonthCell: MpCalendarDateTemplate;
  @ContentChild(MonthCell, { static: false, read: TemplateRef })
  mpMonthCellChild: MpCalendarDateTemplate;
  get monthCell(): MpCalendarDateTemplate {
    return this.mpMonthCell || this.mpMonthCellChild;
  }

  @Input() mpMonthFullCell: MpCalendarDateTemplate;
  @ContentChild(MonthFullCell, { static: false, read: TemplateRef })
  mpMonthFullCellChild: MpCalendarDateTemplate;
  get monthFullCell(): MpCalendarDateTemplate {
    return this.mpMonthFullCell || this.mpMonthFullCellChild;
  }

  @Input() @InputBoolean() mpFullscreen: boolean = true;

  constructor(private cdr: ChangeDetectorRef) {}

  onModeChange(mode: MpCalendarMode): void {
    this.mpModeChange.emit(mode);
    this.mpPanelChange.emit({ date: this.activeDate.nativeDate, mode });
  }

  onYearSelect(year: number): void {
    const date = this.activeDate.setYear(year);
    this.updateDate(date);
  }

  onMonthSelect(month: number): void {
    const date = this.activeDate.setMonth(month);
    this.updateDate(date);
  }

  onDateSelect(date: CandyDate): void {
    // Only activeDate is enough in calendar
    // this.value = date;
    this.updateDate(date);
  }

  writeValue(value: Date | null): void {
    this.updateDate(new CandyDate(value as Date), false);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (date: Date) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchFn = fn;
  }

  private updateDate(date: CandyDate, touched: boolean = true): void {
    this.activeDate = date;

    if (touched) {
      this.onChangeFn(date.nativeDate);
      this.onTouchFn();
      this.mpSelectChange.emit(date.nativeDate);
      this.mpValueChange.emit(date.nativeDate);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mpValue) {
      this.updateDate(new CandyDate(this.mpValue), false);
    }
  }
}
