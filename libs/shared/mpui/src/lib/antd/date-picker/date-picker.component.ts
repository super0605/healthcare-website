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
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { warnDeprecation } from '../core/logger';
import { MpNoAnimationDirective } from '../core/no-animation';
import { CandyDate, cloneDate, CompatibleValue } from '../core/time';
import { FunctionProp, OnChangeType, OnTouchedType } from '../core/types';
import { InputBoolean, toBoolean, valueFunctionProp } from '../core/util';
import {
  DateHelperService,
  MpDatePickerI18nInterface,
  MpI18nService
} from '../i18n';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatePickerService } from './date-picker.service';

import { MpPickerComponent } from './picker.component';
import {
  CompatibleDate,
  DisabledTimeFn,
  PanelMode,
  PresetRanges,
  SupportTimeOptions
} from './standard-types';

const POPUP_STYLE_PATCH = { position: 'relative' }; // Aim to override antd's style to support overlay's position strategy (position:absolute will cause it not working beacuse the overlay can't get the height/width of it's content)

/**
 * The base picker for all common APIs
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector:
    'mp-date-picker,mp-week-picker,mp-month-picker,mp-year-picker,mp-range-picker',
  exportAs: 'mpDatePicker',
  templateUrl: './date-picker.component.html',
  host: {
    '[class]': 'hostClassMap'
  },
  providers: [
    DatePickerService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MpDatePickerComponent)
    }
  ]
})
export class MpDatePickerComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  isRange: boolean = false; // Indicate whether the value is a range value
  showWeek: boolean = false; // Should show as week picker
  focused: boolean = false;
  extraFooter: TemplateRef<void> | string;
  hostClassMap = {};

  protected destroyed$: Subject<void> = new Subject();
  protected isCustomPlaceHolder: boolean = false;
  private showTime: SupportTimeOptions | boolean;

  // --- Common API
  @Input() @InputBoolean() mpAllowClear: boolean = true;
  @Input() @InputBoolean() mpAutoFocus: boolean = false;
  @Input() @InputBoolean() mpDisabled: boolean = false;
  @Input() @InputBoolean() mpOpen: boolean;
  /**
   * @deprecated 10.0.0. This is deprecated and going to be removed in 10.0.0.
   */
  @Input() mpClassName: string;
  @Input() mpDisabledDate: (d: Date) => boolean;
  @Input() mpLocale: MpDatePickerI18nInterface;
  @Input() mpPlaceHolder: string | string[];
  @Input() mpPopupStyle: object = POPUP_STYLE_PATCH;
  @Input() mpDropdownClassName: string;
  @Input() mpSize: 'large' | 'small';
  /**
   * @deprecated 10.0.0. This is deprecated and going to be removed in 10.0.0.
   */
  @Input() mpStyle: object;
  @Input() mpFormat: string;
  @Input() mpDateRender: FunctionProp<TemplateRef<Date> | string>;
  @Input() mpDisabledTime: DisabledTimeFn;
  @Input() mpRenderExtraFooter: FunctionProp<TemplateRef<void> | string>;
  @Input() @InputBoolean() mpShowToday: boolean = true;
  @Input() mpMode: PanelMode | PanelMode[] = 'date';
  @Input() mpRanges: PresetRanges;
  @Input() mpDefaultPickerValue: CompatibleDate | null = null;
  @Input() mpSeparator: string = '~';

  @Output() readonly mpOnPanelChange = new EventEmitter<
    PanelMode | PanelMode[]
  >();
  @Output() readonly mpOnCalendarChange = new EventEmitter<
    Array<Date | null>
  >();
  @Output() readonly mpOnOk = new EventEmitter<CompatibleDate | null>();
  @Output() readonly mpOnOpenChange = new EventEmitter<boolean>();

  @ViewChild(MpPickerComponent, { static: true })
  protected picker: MpPickerComponent;

  @Input() get mpShowTime(): SupportTimeOptions | boolean {
    return this.showTime;
  }

  set mpShowTime(value: SupportTimeOptions | boolean) {
    this.showTime = typeof value === 'object' ? value : toBoolean(value);
  }

  get realOpenState(): boolean {
    return this.picker.animationOpenState;
  } // Use picker's real open state to let re-render the picker's content when shown up

  updateHostClass(): void {
    this.hostClassMap = {
      [`ant-picker`]: true,
      [`ant-picker-range`]: this.isRange,
      [`ant-picker-large`]: this.mpSize === 'large',
      [`ant-picker-small`]: this.mpSize === 'small',
      [`ant-picker-focused`]: this.focused,
      [`ant-picker-disabled`]: this.mpDisabled
    };
  }

  constructor(
    public datePickerService: DatePickerService,
    protected i18n: MpI18nService,
    protected cdr: ChangeDetectorRef,
    protected dateHelper: DateHelperService,
    @Host() @Optional() public noAnimation?: MpNoAnimationDirective
  ) {}

  ngOnInit(): void {
    // Subscribe the every locale change if the mpLocale is not handled by user
    if (!this.mpLocale) {
      this.i18n.localeChange
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => this.setLocale());
    }

    // Default value
    this.datePickerService.isRange = this.isRange;
    this.datePickerService.initValue();
    this.datePickerService.emitValue$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(_ => {
        const value = this.datePickerService.value;
        this.datePickerService.initialValue = cloneDate(value);
        if (this.isRange) {
          const vAsRange = value as CandyDate[];
          if (vAsRange.length) {
            this.onChangeFn([vAsRange[0].nativeDate, vAsRange[1].nativeDate]);
          } else {
            this.onChangeFn([]);
          }
        } else {
          if (value) {
            this.onChangeFn((value as CandyDate).nativeDate);
          } else {
            this.onChangeFn(null);
          }
        }
        this.onTouchedFn();
        // When value emitted, overlay will be closed
        this.picker.hideOverlay();
      });

    this.updateHostClass();
    this.updatePickerStyle();
    // Default format when it's empty
    if (!this.mpFormat) {
      if (this.showWeek) {
        this.mpFormat = 'yyyy-ww'; // Format for week
      } else {
        this.mpFormat = this.mpShowTime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd';
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mpSize || changes.mpDisabled) {
      this.updateHostClass();
    }

    if (changes.mpPopupStyle) {
      // Always assign the popup style patch
      this.mpPopupStyle = this.mpPopupStyle
        ? { ...this.mpPopupStyle, ...POPUP_STYLE_PATCH }
        : POPUP_STYLE_PATCH;
    }

    // Mark as customized placeholder by user once mpPlaceHolder assigned at the first time
    if (
      changes.mpPlaceHolder &&
      changes.mpPlaceHolder.firstChange &&
      typeof this.mpPlaceHolder !== 'undefined'
    ) {
      this.isCustomPlaceHolder = true;
    }

    if (changes.mpLocale) {
      // The mpLocale is currently handled by user
      this.setDefaultPlaceHolder();
    }

    if (changes.mpRenderExtraFooter) {
      this.extraFooter = valueFunctionProp(this.mpRenderExtraFooter);
    }

    if (changes.mpStyle) {
      warnDeprecation(
        `'mpStyle' in DatePicker is going to be removed in 10.0.0. Please use CSS style attribute like <mp-date-picker style="..."></mp-date-picker> instead.`
      );
      this.updatePickerStyle();
    }

    if (changes.mpClassName) {
      warnDeprecation(
        `'mpClassName' in DatePicker is going to be removed in 10.0.0. Please use CSS class attribute like <mp-date-picker class="..."></mp-date-picker> instead.`
      );
    }

    if (changes.mpMode) {
      this.setPanelMode();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  setPanelMode(): void {
    if (!this.mpMode) {
      this.mpMode = this.isRange ? ['date', 'date'] : 'date';
    }
  }

  updatePickerStyle(): void {
    this.mpStyle = { display: 'inherit', width: '100%', ...this.mpStyle };
  }

  /**
   * Triggered when overlayOpen changes (different with realOpenState)
   * @param open The overlayOpen in picker component
   */
  onOpenChange(open: boolean): void {
    this.mpOnOpenChange.emit(open);
  }

  // ------------------------------------------------------------------------
  // | Control value accessor implements
  // ------------------------------------------------------------------------

  // NOTE: onChangeFn/onTouchedFn will not be assigned if user not use as ngModel
  onChangeFn: OnChangeType = () => void 0;
  onTouchedFn: OnTouchedType = () => void 0;

  writeValue(value: CompatibleDate): void {
    this.setValue(value);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouchedFn = fn;
  }

  // ------------------------------------------------------------------------
  // | Internal methods
  // ------------------------------------------------------------------------

  // Reload locale from i18n with side effects
  private setLocale(): void {
    this.mpLocale = this.i18n.getLocaleData('DatePicker', {});
    this.setDefaultPlaceHolder();
    this.cdr.markForCheck();
  }

  private setDefaultPlaceHolder(): void {
    if (!this.isCustomPlaceHolder && this.mpLocale) {
      this.mpPlaceHolder = this.isRange
        ? this.mpLocale.lang.rangePlaceholder
        : this.mpLocale.lang.placeholder;
    }
  }

  // Safe way of setting value with default
  private setValue(value: CompatibleDate): void {
    const newValue: CompatibleValue = this.datePickerService.makeValue(value);
    this.datePickerService.setValue(newValue);
    this.datePickerService.initialValue = newValue;
  }

  get realShowToday(): boolean {
    // Range not support mpShowToday currently
    return !this.isRange && this.mpShowToday;
  }

  onFocusChange(value: boolean): void {
    this.focused = value;
    this.updateHostClass();
  }

  onPanelModeChange(panelMode: PanelMode | PanelMode[]): void {
    // this.mpMode = panelMode;
    this.mpOnPanelChange.emit(panelMode);
  }

  // Emit mpOnCalendarChange when select date by mp-range-picker
  onCalendarChange(value: CandyDate[]): void {
    if (this.isRange) {
      const rangeValue = value
        .filter(x => x instanceof CandyDate)
        .map(x => x.nativeDate);
      this.mpOnCalendarChange.emit(rangeValue);
    }
  }

  // Emitted when done with date selecting
  onResultOk(): void {
    if (this.isRange) {
      const value = this.datePickerService.value as CandyDate[];
      if (value.length) {
        this.mpOnOk.emit([value[0].nativeDate, value[1].nativeDate]);
      } else {
        this.mpOnOk.emit([]);
      }
    } else {
      if (this.datePickerService.value) {
        this.mpOnOk.emit(
          (this.datePickerService.value as CandyDate).nativeDate
        );
      } else {
        this.mpOnOk.emit(null);
      }
    }
    this.datePickerService.emitValue$.next();
  }
}
