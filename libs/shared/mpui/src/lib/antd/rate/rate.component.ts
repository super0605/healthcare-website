/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
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
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MpConfigService, WithConfig } from '../core/config';
import { NgClassType } from '../core/types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { InputBoolean, InputNumber } from '../core/util';

const NZ_CONFIG_COMPONENT_NAME = 'rate';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-rate',
  exportAs: 'mpRate',
  preserveWhitespaces: false,
  template: `
    <ul
      #ulElement
      class="ant-rate"
      [class.ant-rate-disabled]="mpDisabled"
      [ngClass]="classMap"
      (blur)="onBlur($event)"
      (focus)="onFocus($event)"
      (keydown)="onKeyDown($event); $event.preventDefault()"
      (mouseleave)="onRateLeave(); $event.stopPropagation()"
      [tabindex]="mpDisabled ? -1 : 1"
    >
      <li
        *ngFor="let star of starArray; let i = index"
        class="ant-rate-star"
        [ngClass]="starStyleArray[i]"
        mp-tooltip
        [mpTooltipTitle]="mpTooltips[i]"
      >
        <div
          mp-rate-item
          [allowHalf]="mpAllowHalf"
          [character]="mpCharacter"
          (itemHover)="onItemHover(i, $event)"
          (itemClick)="onItemClick(i, $event)"
        ></div>
      </li>
    </ul>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MpRateComponent),
      multi: true
    }
  ]
})
export class MpRateComponent
  implements OnInit, OnDestroy, ControlValueAccessor, OnChanges {
  @ViewChild('ulElement', { static: false }) private ulElement: ElementRef;

  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, true)
  @InputBoolean()
  mpAllowClear: boolean;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  @InputBoolean()
  mpAllowHalf: boolean;
  @Input() @InputBoolean() mpDisabled: boolean = false;
  @Input() @InputBoolean() mpAutoFocus: boolean = false;
  @Input() mpCharacter: TemplateRef<void>;
  @Input() @InputNumber() mpCount: number = 5;
  @Input() mpTooltips: string[] = [];
  @Output() readonly mpOnBlur = new EventEmitter<FocusEvent>();
  @Output() readonly mpOnFocus = new EventEmitter<FocusEvent>();
  @Output() readonly mpOnHoverChange = new EventEmitter<number>();
  @Output() readonly mpOnKeyDown = new EventEmitter<KeyboardEvent>();

  classMap: NgClassType = {};
  starArray: number[] = [];
  starStyleArray: NgClassType[] = [];

  private readonly destroy$ = new Subject<void>();
  private hasHalf = false;
  private hoverValue = 0;
  private isFocused = false;
  private _value = 0;

  get mpValue(): number {
    return this._value;
  }

  set mpValue(input: number) {
    if (this._value === input) {
      return;
    }

    this._value = input;
    this.hasHalf = !Number.isInteger(input);
    this.hoverValue = Math.ceil(input);
  }

  constructor(
    public mpConfigService: MpConfigService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { mpAutoFocus, mpCount, mpValue } = changes;

    if (mpAutoFocus && !mpAutoFocus.isFirstChange()) {
      const el = this.ulElement.nativeElement;
      if (this.mpAutoFocus && !this.mpDisabled) {
        this.renderer.setAttribute(el, 'autofocus', 'autofocus');
      } else {
        this.renderer.removeAttribute(el, 'autofocus');
      }
    }

    if (mpCount) {
      this.updateStarArray();
    }

    if (mpValue) {
      this.updateStarStyle();
    }
  }

  ngOnInit(): void {
    this.mpConfigService
      .getConfigChangeEventForComponent(NZ_CONFIG_COMPONENT_NAME)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.cdr.markForCheck());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onItemClick(index: number, isHalf: boolean): void {
    if (this.mpDisabled) {
      return;
    }

    this.hoverValue = index + 1;

    const actualValue = isHalf ? index + 0.5 : index + 1;

    if (this.mpValue === actualValue) {
      if (this.mpAllowClear) {
        this.mpValue = 0;
        this.onChange(this.mpValue);
      }
    } else {
      this.mpValue = actualValue;
      this.onChange(this.mpValue);
    }

    this.updateStarStyle();
  }

  onItemHover(index: number, isHalf: boolean): void {
    if (
      this.mpDisabled ||
      (this.hoverValue === index + 1 && isHalf === this.hasHalf)
    ) {
      return;
    }

    this.hoverValue = index + 1;
    this.hasHalf = isHalf;
    this.mpOnHoverChange.emit(this.hoverValue);

    this.updateStarStyle();
  }

  onRateLeave(): void {
    this.hasHalf = !Number.isInteger(this.mpValue);
    this.hoverValue = Math.ceil(this.mpValue);

    this.updateStarStyle();
  }

  onFocus(e: FocusEvent): void {
    this.isFocused = true;
    this.mpOnFocus.emit(e);
  }

  onBlur(e: FocusEvent): void {
    this.isFocused = false;
    this.mpOnBlur.emit(e);
  }

  focus(): void {
    this.ulElement.nativeElement.focus();
  }

  blur(): void {
    this.ulElement.nativeElement.blur();
  }

  onKeyDown(e: KeyboardEvent): void {
    const oldVal = this.mpValue;

    if (e.keyCode === RIGHT_ARROW && this.mpValue < this.mpCount) {
      this.mpValue += this.mpAllowHalf ? 0.5 : 1;
    } else if (e.keyCode === LEFT_ARROW && this.mpValue > 0) {
      this.mpValue -= this.mpAllowHalf ? 0.5 : 1;
    }

    if (oldVal !== this.mpValue) {
      this.onChange(this.mpValue);
      this.mpOnKeyDown.emit(e);
      this.updateStarStyle();
      this.cdr.markForCheck();
    }
  }

  private updateStarArray(): void {
    this.starArray = Array(this.mpCount)
      .fill(0)
      .map((_, i) => i);

    this.updateStarStyle();
  }

  private updateStarStyle(): void {
    this.starStyleArray = this.starArray.map(i => {
      const prefix = 'ant-rate-star';
      const value = i + 1;
      return {
        [`${prefix}-full`]:
          value < this.hoverValue ||
          (!this.hasHalf && value === this.hoverValue),
        [`${prefix}-half`]: this.hasHalf && value === this.hoverValue,
        [`${prefix}-active`]: this.hasHalf && value === this.hoverValue,
        [`${prefix}-zero`]: value > this.hoverValue,
        [`${prefix}-focused`]:
          this.hasHalf && value === this.hoverValue && this.isFocused
      };
    });
  }

  writeValue(value: number | null): void {
    this.mpValue = value || 0;
    this.updateStarArray();
    this.cdr.markForCheck();
  }

  setDisabledState(isDisabled: boolean): void {
    this.mpDisabled = isDisabled;
  }

  registerOnChange(fn: (_: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onChange: (value: number) => void = () => null;
  onTouched: () => void = () => null;
}
