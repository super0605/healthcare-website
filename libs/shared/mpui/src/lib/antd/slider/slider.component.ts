/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  DOWN_ARROW,
  LEFT_ARROW,
  RIGHT_ARROW,
  UP_ARROW
} from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  arraysEqual,
  ensureNumberInRange,
  getElementOffset,
  getPercent,
  getPrecision,
  InputBoolean,
  InputNumber,
  MouseTouchObserverConfig,
  silentEvent
} from '../core/util';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pluck,
  takeUntil,
  tap
} from 'rxjs/operators';

import { MpSliderHandleComponent } from './handle.component';
import { MpSliderService } from './slider.service';

import {
  MpExtendedMark,
  MpMarks,
  MpSliderHandler,
  MpSliderShowTooltip,
  MpSliderValue
} from './typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-slider',
  exportAs: 'mpSlider',
  preserveWhitespaces: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MpSliderComponent),
      multi: true
    },
    MpSliderService
  ],
  host: {
    '(keydown)': 'onKeyDown($event)'
  },
  template: `
    <div
      #slider
      class="ant-slider"
      [class.ant-slider-disabled]="mpDisabled"
      [class.ant-slider-vertical]="mpVertical"
      [class.ant-slider-with-marks]="marksArray"
    >
      <div class="ant-slider-rail"></div>
      <mp-slider-track
        [vertical]="mpVertical"
        [included]="mpIncluded"
        [offset]="track.offset"
        [length]="track.length"
      ></mp-slider-track>
      <mp-slider-step
        *ngIf="marksArray"
        [vertical]="mpVertical"
        [lowerBound]="bounds.lower"
        [upperBound]="bounds.upper"
        [marksArray]="marksArray"
        [included]="mpIncluded"
      ></mp-slider-step>
      <mp-slider-handle
        *ngFor="let handle of handles"
        [vertical]="mpVertical"
        [offset]="handle.offset"
        [value]="handle.value"
        [active]="handle.active"
        [tooltipFormatter]="mpTipFormatter"
        [tooltipVisible]="mpTooltipVisible"
        [tooltipPlacement]="mpTooltipPlacement"
      ></mp-slider-handle>
      <mp-slider-marks
        *ngIf="marksArray"
        [vertical]="mpVertical"
        [min]="mpMin"
        [max]="mpMax"
        [lowerBound]="bounds.lower"
        [upperBound]="bounds.upper"
        [marksArray]="marksArray"
        [included]="mpIncluded"
      ></mp-slider-marks>
    </div>
  `
})
export class MpSliderComponent
  implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  @ViewChild('slider', { static: true }) slider: ElementRef<HTMLDivElement>;
  @ViewChildren(MpSliderHandleComponent) handlerComponents: QueryList<
    MpSliderHandleComponent
  >;

  @Input() @InputBoolean() mpDisabled = false;
  @Input() @InputBoolean() mpDots: boolean = false;
  @Input() @InputBoolean() mpIncluded: boolean = true;
  @Input() @InputBoolean() mpRange: boolean = false;
  @Input() @InputBoolean() mpVertical: boolean = false;
  @Input() mpDefaultValue?: MpSliderValue;
  @Input() mpMarks: MpMarks | null = null;
  @Input() @InputNumber() mpMax = 100;
  @Input() @InputNumber() mpMin = 0;
  @Input() @InputNumber() mpStep = 1;
  @Input() mpTooltipVisible: MpSliderShowTooltip = 'default';
  @Input() mpTooltipPlacement: string = 'top';
  @Input() mpTipFormatter: (value: number) => string;

  @Output() readonly mpOnAfterChange = new EventEmitter<MpSliderValue>();

  value: MpSliderValue | null = null;
  cacheSliderStart: number | null = null;
  cacheSliderLength: number | null = null;
  activeValueIndex: number | undefined = undefined; // Current activated handle's index ONLY for range=true
  track: { offset: null | number; length: null | number } = {
    offset: null,
    length: null
  }; // Track's offset and length
  handles: MpSliderHandler[]; // Handles' offset
  marksArray: MpExtendedMark[] | null; // "steps" in array type with more data & FILTER out the invalid mark
  bounds: { lower: MpSliderValue | null; upper: MpSliderValue | null } = {
    lower: null,
    upper: null
  }; // now for mp-slider-step

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;
  private dragStart_: Subscription | null;
  private dragMove_: Subscription | null;
  private dragEnd_: Subscription | null;

  constructor(
    private sliderService: MpSliderService,
    private cdr: ChangeDetectorRef,
    private platform: Platform
  ) {}

  ngOnInit(): void {
    this.handles = generateHandlers(this.mpRange ? 2 : 1);
    this.marksArray = this.mpMarks
      ? this.generateMarkItems(this.mpMarks)
      : null;
    this.bindDraggingHandlers();
    this.toggleDragDisabled(this.mpDisabled);

    if (this.getValue() === null) {
      this.setValue(this.formatValue(null));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpDisabled, mpMarks, mpRange } = changes;

    if (mpDisabled && !mpDisabled.firstChange) {
      this.toggleDragDisabled(mpDisabled.currentValue);
    } else if (mpMarks && !mpMarks.firstChange) {
      this.marksArray = this.mpMarks
        ? this.generateMarkItems(this.mpMarks)
        : null;
    } else if (mpRange && !mpRange.firstChange) {
      this.setValue(this.formatValue(null));
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeDrag();
  }

  writeValue(val: MpSliderValue | null): void {
    this.setValue(val, true);
  }

  onValueChange(_value: MpSliderValue): void {}

  onTouched(): void {}

  registerOnChange(fn: (value: MpSliderValue) => void): void {
    this.onValueChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.mpDisabled = isDisabled;
    this.toggleDragDisabled(isDisabled);
  }

  /**
   * Event handler is only triggered when a slider handler is focused.
   */
  onKeyDown(e: KeyboardEvent): void {
    const code = e.keyCode;
    const isIncrease = code === RIGHT_ARROW || code === UP_ARROW;
    const isDecrease = code === LEFT_ARROW || code === DOWN_ARROW;

    if (!(isIncrease || isDecrease)) {
      return;
    }

    e.preventDefault();

    const step = isDecrease ? -this.mpStep : this.mpStep;
    const newVal = this.mpRange
      ? (this.value as number[])[this.activeValueIndex!] + step
      : (this.value as number) + step;
    this.setActiveValue(ensureNumberInRange(newVal, this.mpMin, this.mpMax));
  }

  private setValue(
    value: MpSliderValue | null,
    isWriteValue: boolean = false
  ): void {
    if (isWriteValue) {
      this.value = this.formatValue(value);
      this.updateTrackAndHandles();
    } else if (!valuesEqual(this.value!, value!)) {
      this.value = value;
      this.updateTrackAndHandles();
      this.onValueChange(this.getValue(true));
    }
  }

  private getValue(cloneAndSort: boolean = false): MpSliderValue {
    if (cloneAndSort && this.value && isValueRange(this.value)) {
      return [...this.value].sort((a, b) => a - b);
    }
    return this.value!;
  }

  /**
   * Clone & sort current value and convert them to offsets, then return the new one.
   */
  private getValueToOffset(value?: MpSliderValue): MpSliderValue {
    let normalizedValue = value;

    if (typeof normalizedValue === 'undefined') {
      normalizedValue = this.getValue(true);
    }

    return isValueRange(normalizedValue)
      ? normalizedValue.map(val => this.valueToOffset(val))
      : this.valueToOffset(normalizedValue);
  }

  /**
   * Find the closest value to be activated.
   */
  private setActiveValueIndex(pointerValue: number): void {
    const value = this.getValue();
    if (isValueRange(value)) {
      let minimal: number | null = null;
      let gap: number;
      let activeIndex = -1;
      value.forEach((val, index) => {
        gap = Math.abs(pointerValue - val);
        if (minimal === null || gap < minimal!) {
          minimal = gap;
          activeIndex = index;
        }
      });
      this.activeValueIndex = activeIndex;
      this.handlerComponents.toArray()[activeIndex].focus();
    } else {
      this.handlerComponents.toArray()[0].focus();
    }
  }

  private setActiveValue(pointerValue: number): void {
    if (isValueRange(this.value!)) {
      const newValue = [...(this.value as number[])];
      newValue[this.activeValueIndex!] = pointerValue;
      this.setValue(newValue);
    } else {
      this.setValue(pointerValue);
    }
  }

  /**
   * Update track and handles' position and length.
   */
  private updateTrackAndHandles(): void {
    const value = this.getValue();
    const offset = this.getValueToOffset(value);
    const valueSorted = this.getValue(true);
    const offsetSorted = this.getValueToOffset(valueSorted);
    const boundParts = isValueRange(valueSorted)
      ? valueSorted
      : [0, valueSorted];
    const trackParts = isValueRange(offsetSorted)
      ? [offsetSorted[0], offsetSorted[1] - offsetSorted[0]]
      : [0, offsetSorted];

    this.handles.forEach((handle, index) => {
      handle.offset = isValueRange(offset) ? offset[index] : offset;
      handle.value = isValueRange(value) ? value[index] : value || 0;
    });

    [this.bounds.lower, this.bounds.upper] = boundParts;
    [this.track.offset, this.track.length] = trackParts;

    this.cdr.markForCheck();
  }

  private onDragStart(value: number): void {
    this.toggleDragMoving(true);
    this.cacheSliderProperty();
    this.setActiveValueIndex(value);
    this.setActiveValue(value);
    this.showHandleTooltip(this.mpRange ? this.activeValueIndex : 0);
  }

  private onDragMove(value: number): void {
    this.setActiveValue(value);
    this.cdr.markForCheck();
  }

  private onDragEnd(): void {
    this.mpOnAfterChange.emit(this.getValue(true));
    this.toggleDragMoving(false);
    this.cacheSliderProperty(true);
    this.hideAllHandleTooltip();
    this.cdr.markForCheck();
  }

  /**
   * Create user interactions handles.
   */
  private bindDraggingHandlers(): void {
    if (!this.platform.isBrowser) {
      return;
    }

    const sliderDOM = this.slider.nativeElement;
    const orientField = this.mpVertical ? 'pageY' : 'pageX';
    const mouse: MouseTouchObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      pluckKey: [orientField]
    };
    const touch: MouseTouchObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      pluckKey: ['touches', '0', orientField],
      filter: (e: MouseEvent | TouchEvent) => e instanceof TouchEvent
    };

    [mouse, touch].forEach(source => {
      const {
        start,
        move,
        end,
        pluckKey,
        filter: filterFunc = () => true
      } = source;

      source.startPlucked$ = fromEvent(sliderDOM, start).pipe(
        filter(filterFunc),
        tap(silentEvent),
        pluck<Event, number>(...pluckKey),
        map((position: number) => this.findClosestValue(position))
      );
      source.end$ = fromEvent(document, end);
      source.moveResolved$ = fromEvent(document, move).pipe(
        filter(filterFunc),
        tap(silentEvent),
        pluck<Event, number>(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findClosestValue(position)),
        distinctUntilChanged(),
        takeUntil(source.end$)
      );
    });

    this.dragStart$ = merge(mouse.startPlucked$!, touch.startPlucked$!);
    this.dragMove$ = merge(mouse.moveResolved$!, touch.moveResolved$!);
    this.dragEnd$ = merge(mouse.end$!, touch.end$!);
  }

  private subscribeDrag(periods: string[] = ['start', 'move', 'end']): void {
    if (
      periods.indexOf('start') !== -1 &&
      this.dragStart$ &&
      !this.dragStart_
    ) {
      this.dragStart_ = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }

    if (periods.indexOf('move') !== -1 && this.dragMove$ && !this.dragMove_) {
      this.dragMove_ = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }

    if (periods.indexOf('end') !== -1 && this.dragEnd$ && !this.dragEnd_) {
      this.dragEnd_ = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private unsubscribeDrag(periods: string[] = ['start', 'move', 'end']): void {
    if (periods.indexOf('start') !== -1 && this.dragStart_) {
      this.dragStart_.unsubscribe();
      this.dragStart_ = null;
    }

    if (periods.indexOf('move') !== -1 && this.dragMove_) {
      this.dragMove_.unsubscribe();
      this.dragMove_ = null;
    }

    if (periods.indexOf('end') !== -1 && this.dragEnd_) {
      this.dragEnd_.unsubscribe();
      this.dragEnd_ = null;
    }
  }

  private toggleDragMoving(movable: boolean): void {
    const periods = ['move', 'end'];
    if (movable) {
      this.sliderService.isDragging = true;
      this.subscribeDrag(periods);
    } else {
      this.sliderService.isDragging = false;
      this.unsubscribeDrag(periods);
    }
  }

  private toggleDragDisabled(disabled: boolean): void {
    if (disabled) {
      this.unsubscribeDrag();
    } else {
      this.subscribeDrag(['start']);
    }
  }

  private findClosestValue(position: number): number {
    const sliderStart = this.getSliderStartPosition();
    const sliderLength = this.getSliderLength();
    const ratio = ensureNumberInRange(
      (position - sliderStart) / sliderLength,
      0,
      1
    );
    const val =
      (this.mpMax - this.mpMin) * (this.mpVertical ? 1 - ratio : ratio) +
      this.mpMin;
    const points =
      this.mpMarks === null ? [] : Object.keys(this.mpMarks).map(parseFloat);
    if (this.mpStep !== 0 && !this.mpDots) {
      const closestOne = Math.round(val / this.mpStep) * this.mpStep;
      points.push(closestOne);
    }
    const gaps = points.map(point => Math.abs(val - point));
    const closest = points[gaps.indexOf(Math.min(...gaps))];

    return this.mpStep === null
      ? closest
      : parseFloat(closest.toFixed(getPrecision(this.mpStep)));
  }

  private valueToOffset(value: number): number {
    return getPercent(this.mpMin, this.mpMax, value);
  }

  private getSliderStartPosition(): number {
    if (this.cacheSliderStart !== null) {
      return this.cacheSliderStart;
    }
    const offset = getElementOffset(this.slider.nativeElement);
    return this.mpVertical ? offset.top : offset.left;
  }

  private getSliderLength(): number {
    if (this.cacheSliderLength !== null) {
      return this.cacheSliderLength;
    }
    const sliderDOM = this.slider.nativeElement;
    return this.mpVertical ? sliderDOM.clientHeight : sliderDOM.clientWidth;
  }

  /**
   * Cache DOM layout/reflow operations for performance (may not necessary?)
   */
  private cacheSliderProperty(remove: boolean = false): void {
    this.cacheSliderStart = remove ? null : this.getSliderStartPosition();
    this.cacheSliderLength = remove ? null : this.getSliderLength();
  }

  private formatValue(value: MpSliderValue | null): MpSliderValue {
    if (!value) {
      return this.mpRange ? [this.mpMin, this.mpMax] : this.mpMin;
    } else if (assertValueValid(value, this.mpRange)) {
      return isValueRange(value)
        ? value.map(val => ensureNumberInRange(val, this.mpMin, this.mpMax))
        : ensureNumberInRange(value, this.mpMin, this.mpMax);
    } else {
      return this.mpDefaultValue
        ? this.mpDefaultValue
        : this.mpRange
        ? [this.mpMin, this.mpMax]
        : this.mpMin;
    }
  }

  /**
   * Show one handle's tooltip and hide others'.
   */
  private showHandleTooltip(handleIndex: number = 0): void {
    this.handles.forEach((handle, index) => {
      handle.active = index === handleIndex;
    });
  }

  private hideAllHandleTooltip(): void {
    this.handles.forEach(handle => (handle.active = false));
  }

  private generateMarkItems(marks: MpMarks): MpExtendedMark[] | null {
    const marksArray: MpExtendedMark[] = [];
    for (const key in marks) {
      const mark = marks[key];
      const val = typeof key === 'number' ? key : parseFloat(key);
      if (val >= this.mpMin && val <= this.mpMax) {
        marksArray.push({
          value: val,
          offset: this.valueToOffset(val),
          config: mark
        });
      }
    }
    return marksArray.length ? marksArray : null;
  }
}

function getValueTypeNotMatchError(): Error {
  return new Error(
    `The "mpRange" can't match the "ngModel"'s type, please check these properties: "mpRange", "ngModel", "mpDefaultValue".`
  );
}

function isValueRange(value: MpSliderValue): value is number[] {
  if (value instanceof Array) {
    return value.length === 2;
  } else {
    return false;
  }
}

function generateHandlers(amount: number): MpSliderHandler[] {
  return Array(amount)
    .fill(0)
    .map(() => ({ offset: null, value: null, active: false }));
}

/**
 * Check if value is valid and throw error if value-type/range not match.
 */
function assertValueValid(value: MpSliderValue, isRange?: boolean): boolean {
  if (
    (!isValueRange(value) && isNaN(value)) ||
    (isValueRange(value) && value.some(v => isNaN(v)))
  ) {
    return false;
  }
  return assertValueTypeMatch(value, isRange);
}

/**
 * Assert that if `this.mpRange` is `true`, value is also a range, vice versa.
 */
function assertValueTypeMatch(
  value: MpSliderValue,
  isRange: boolean = false
): boolean {
  if (isValueRange(value) !== isRange) {
    throw getValueTypeNotMatchError();
  }
  return true;
}

function valuesEqual(valA: MpSliderValue, valB: MpSliderValue): boolean {
  if (typeof valA !== typeof valB) {
    return false;
  }
  return isValueRange(valA) && isValueRange(valB)
    ? arraysEqual<number>(valA, valB)
    : valA === valB;
}
