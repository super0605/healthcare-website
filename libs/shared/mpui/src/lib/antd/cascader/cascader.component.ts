/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  BACKSPACE,
  DOWN_ARROW,
  ENTER,
  ESCAPE,
  LEFT_ARROW,
  RIGHT_ARROW,
  UP_ARROW
} from '@angular/cdk/keycodes';
import {
  CdkConnectedOverlay,
  ConnectedOverlayPositionChange,
  ConnectionPositionPair
} from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Host,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { slideMotion } from '../core/animation';
import { MpConfigService, WithConfig } from '../core/config';
import { MpNoAnimationDirective } from '../core/no-animation';
import { DEFAULT_CASCADER_POSITIONS } from '../core/overlay';
import { NgClassType, NgStyleInterface, MpSafeAny } from '../core/types';
import { InputBoolean, toArray } from '../core/util';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { MpCascaderI18nInterface, MpI18nService } from '../i18n';
import { MpCascaderOptionComponent } from './cascader-li.component';
import { MpCascaderService } from './cascader.service';
import {
  MpCascaderComponentAsSource,
  MpCascaderExpandTrigger,
  MpCascaderOption,
  MpCascaderSearchOption,
  MpCascaderSize,
  MpCascaderTriggerType,
  MpShowSearchOptions
} from './typings';

const NZ_CONFIG_COMPONENT_NAME = 'cascader';
const defaultDisplayRender = (labels: string[]) => labels.join(' / ');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-cascader, [mp-cascader]',
  exportAs: 'mpCascader',
  preserveWhitespaces: false,
  template: `
    <div cdkOverlayOrigin #origin="cdkOverlayOrigin" #trigger>
      <div *ngIf="mpShowInput">
        <input
          #input
          mp-input
          class="ant-cascader-input"
          [class.ant-cascader-input-disabled]="mpDisabled"
          [class.ant-cascader-input-lg]="mpSize === 'large'"
          [class.ant-cascader-input-sm]="mpSize === 'small'"
          [attr.autoComplete]="'off'"
          [attr.placeholder]="
            showPlaceholder ? mpPlaceHolder || locale?.placeholder : null
          "
          [attr.autofocus]="mpAutoFocus ? 'autofocus' : null"
          [readonly]="!mpShowSearch"
          [disabled]="mpDisabled"
          [mpSize]="mpSize"
          [(ngModel)]="inputValue"
          (blur)="handleInputBlur()"
          (focus)="handleInputFocus()"
          (change)="$event.stopPropagation()"
        />
        <i
          *ngIf="clearIconVisible"
          mp-icon
          mpType="close-circle"
          mpTheme="fill"
          class="ant-cascader-picker-clear"
          (click)="clearSelection($event)"
        ></i>
        <i
          *ngIf="mpShowArrow && !isLoading"
          mp-icon
          mpType="down"
          class="ant-cascader-picker-arrow"
          [class.ant-cascader-picker-arrow-expand]="menuVisible"
        >
        </i>
        <i
          *ngIf="isLoading"
          mp-icon
          mpType="loading"
          class="ant-cascader-picker-arrow"
        ></i>
        <span
          class="ant-cascader-picker-label"
          [class.ant-cascader-show-search]="!!mpShowSearch"
          [class.ant-focusd]="!!mpShowSearch && isFocused && !inputValue"
        >
          <ng-container *ngIf="!isLabelRenderTemplate; else labelTemplate">{{
            labelRenderText
          }}</ng-container>
          <ng-template #labelTemplate>
            <ng-template
              [ngTemplateOutlet]="mpLabelRender"
              [ngTemplateOutletContext]="labelRenderContext"
            ></ng-template>
          </ng-template>
        </span>
      </div>
      <ng-content></ng-content>
    </div>
    <ng-template
      cdkConnectedOverlay
      mpConnectedOverlay
      cdkConnectedOverlayHasBackdrop
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayPositions]="positions"
      (backdropClick)="closeMenu()"
      (detach)="closeMenu()"
      (positionChange)="onPositionChange($event)"
      [cdkConnectedOverlayOpen]="menuVisible"
    >
      <div
        #menu
        class="ant-cascader-menus"
        [class.ant-cascader-menus-hidden]="!menuVisible"
        [ngClass]="menuCls"
        [ngStyle]="mpMenuStyle"
        [@.disabled]="noAnimation?.mpNoAnimation"
        [mpNoAnimation]="noAnimation?.mpNoAnimation"
        [@slideMotion]="dropDownPosition"
        (mouseleave)="onTriggerMouseLeave($event)"
      >
        <ul
          *ngIf="shouldShowEmpty; else hasOptionsTemplate"
          class="ant-cascader-menu"
          [style.width]="dropdownWidthStyle"
          [style.height]="dropdownHeightStyle"
        >
          <li
            class="ant-cascader-menu-item ant-cascader-menu-item-expanded ant-cascader-menu-item-disabled"
          >
            <mp-embed-empty
              [mpComponentName]="'cascader'"
              [specificContent]="mpNotFoundContent"
            ></mp-embed-empty>
          </li>
        </ul>
        <ng-template #hasOptionsTemplate>
          <ul
            *ngFor="let options of cascaderService.columns; let i = index"
            class="ant-cascader-menu"
            [ngClass]="menuColumnCls"
            [style.height]="dropdownHeightStyle"
            [style.width]="dropdownWidthStyle"
          >
            <li
              mp-cascader-option
              *ngFor="let option of options"
              [columnIndex]="i"
              [mpLabelProperty]="mpLabelProperty"
              [optionTemplate]="mpOptionRender"
              [activated]="isOptionActivated(option, i)"
              [highlightText]="inSearchingMode ? inputValue : ''"
              [option]="option"
              (mouseenter)="onOptionMouseEnter(option, i, $event)"
              (mouseleave)="onOptionMouseLeave(option, i, $event)"
              (click)="onOptionClick(option, i, $event)"
            ></li>
          </ul>
        </ng-template>
      </div>
    </ng-template>
  `,
  animations: [slideMotion],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MpCascaderComponent),
      multi: true
    },
    MpCascaderService
  ],
  host: {
    '[attr.tabIndex]': '"0"',
    '[class.ant-cascader-lg]': 'mpSize === "large"',
    '[class.ant-cascader-sm]': 'mpSize === "small"',
    '[class.ant-cascader-picker-disabled]': 'mpDisabled',
    '[class.ant-cascader-picker-open]': 'menuVisible',
    '[class.ant-cascader-picker-with-value]': '!!inputValue',
    '[class.ant-cascader-focused]': 'isFocused'
  }
})
export class MpCascaderComponent
  implements
    MpCascaderComponentAsSource,
    OnInit,
    OnDestroy,
    ControlValueAccessor {
  @ViewChild('input', { static: false }) input: ElementRef;
  @ViewChild('menu', { static: false }) menu: ElementRef;
  @ViewChild(CdkConnectedOverlay, { static: false })
  overlay: CdkConnectedOverlay;
  @ViewChildren(MpCascaderOptionComponent) cascaderItems: QueryList<
    MpCascaderOptionComponent
  >;

  @Input() mpOptionRender: TemplateRef<{
    $implicit: MpCascaderOption;
    index: number;
  }> | null = null;
  @Input() @InputBoolean() mpShowInput = true;
  @Input() @InputBoolean() mpShowArrow = true;
  @Input() @InputBoolean() mpAllowClear = true;
  @Input() @InputBoolean() mpAutoFocus = false;
  @Input() @InputBoolean() mpChangeOnSelect = false;
  @Input() @InputBoolean() mpDisabled = false;
  @Input() mpColumnClassName: string;
  @Input() mpExpandTrigger: MpCascaderExpandTrigger = 'click';
  @Input() mpValueProperty = 'value';
  @Input() mpLabelRender: TemplateRef<void>;
  @Input() mpLabelProperty = 'label';
  @Input() mpNotFoundContent: string | TemplateRef<void>;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'default')
  mpSize: MpCascaderSize;
  @Input() mpShowSearch: boolean | MpShowSearchOptions;
  @Input() mpPlaceHolder: string;
  @Input() mpMenuClassName: string;
  @Input() mpMenuStyle: NgStyleInterface;
  @Input() mpMouseEnterDelay: number = 150; // ms
  @Input() mpMouseLeaveDelay: number = 150; // ms
  @Input() mpTriggerAction: MpCascaderTriggerType | MpCascaderTriggerType[] = [
    'click'
  ] as MpCascaderTriggerType[];
  @Input() mpChangeOn: (option: MpCascaderOption, level: number) => boolean;
  @Input() mpLoadData: (
    node: MpCascaderOption,
    index?: number
  ) => PromiseLike<MpSafeAny>;

  @Input()
  get mpOptions(): MpCascaderOption[] | null {
    return this.cascaderService.mpOptions;
  }

  set mpOptions(options: MpCascaderOption[] | null) {
    this.cascaderService.withOptions(options);
  }

  @Output() readonly mpVisibleChange = new EventEmitter<boolean>();
  @Output() readonly mpSelectionChange = new EventEmitter<MpCascaderOption[]>();
  @Output() readonly mpSelect = new EventEmitter<{
    option: MpCascaderOption;
    index: number;
  } | null>();
  @Output() readonly mpClear = new EventEmitter<void>();

  /**
   * If the dropdown should show the empty content.
   * `true` if there's no options.
   */
  shouldShowEmpty: boolean = false;

  el: HTMLElement;
  dropDownPosition = 'bottom';
  menuVisible = false;
  isLoading = false;
  labelRenderText: string;
  labelRenderContext = {};
  onChange = Function.prototype;
  onTouched = Function.prototype;
  positions: ConnectionPositionPair[] = [...DEFAULT_CASCADER_POSITIONS];

  /**
   * Dropdown's with in pixel.
   */
  dropdownWidthStyle: string;
  dropdownHeightStyle: 'auto' | '' = '';
  isFocused = false;

  locale: MpCascaderI18nInterface;

  private destroy$ = new Subject<void>();
  private inputString = '';
  private isOpening = false;
  private delayMenuTimer: number | null;
  private delaySelectTimer: number | null;

  get inSearchingMode(): boolean {
    return this.cascaderService.inSearchingMode;
  }

  set inputValue(inputValue: string) {
    this.inputString = inputValue;
    this.toggleSearchingMode(!!inputValue);
  }

  get inputValue(): string {
    return this.inputString;
  }

  get menuCls(): NgClassType {
    return { [`${this.mpMenuClassName}`]: !!this.mpMenuClassName };
  }

  get menuColumnCls(): NgClassType {
    return { [`${this.mpColumnClassName}`]: !!this.mpColumnClassName };
  }

  private get hasInput(): boolean {
    return !!this.inputValue;
  }

  private get hasValue(): boolean {
    return (
      this.cascaderService.values && this.cascaderService.values.length > 0
    );
  }

  get showPlaceholder(): boolean {
    return !(this.hasInput || this.hasValue);
  }

  get clearIconVisible(): boolean {
    return (
      this.mpAllowClear && !this.mpDisabled && (this.hasValue || this.hasInput)
    );
  }

  get isLabelRenderTemplate(): boolean {
    return !!this.mpLabelRender;
  }

  constructor(
    public cascaderService: MpCascaderService,
    private i18nService: MpI18nService,
    public mpConfigService: MpConfigService,
    private cdr: ChangeDetectorRef,
    elementRef: ElementRef,
    renderer: Renderer2,
    @Host() @Optional() public noAnimation?: MpNoAnimationDirective
  ) {
    this.el = elementRef.nativeElement;
    this.cascaderService.withComponent(this);
    renderer.addClass(elementRef.nativeElement, 'ant-cascader');
    renderer.addClass(elementRef.nativeElement, 'ant-cascader-picker');
  }

  ngOnInit(): void {
    const srv = this.cascaderService;

    srv.$redraw.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // These operations would not mutate data.
      this.checkChildren();
      this.setDisplayLabel();
      this.reposition();
      this.setDropdownStyles();

      this.cdr.markForCheck();
    });

    srv.$loading.pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.isLoading = loading;
    });

    srv.$optionSelected.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (!data) {
        this.onChange([]);
        this.mpSelect.emit(null);
        this.mpSelectionChange.emit([]);
      } else {
        const { option, index } = data;
        const shouldClose = option.isLeaf;
        if (shouldClose) {
          this.delaySetMenuVisible(false);
        }
        this.onChange(this.cascaderService.values);
        this.mpSelectionChange.emit(this.cascaderService.selectedOptions);
        this.mpSelect.emit({ option, index });
        this.cdr.markForCheck();
      }
    });

    srv.$quitSearching.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.inputString = '';
      this.dropdownWidthStyle = '';
    });

    this.i18nService.localeChange
      .pipe(
        startWith(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.setLocale();
      });

    this.mpConfigService
      .getConfigChangeEventForComponent(NZ_CONFIG_COMPONENT_NAME)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearDelayMenuTimer();
    this.clearDelaySelectTimer();
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  writeValue(value: MpSafeAny): void {
    this.cascaderService.values = toArray(value);
    this.cascaderService.syncOptions(true);
  }

  delaySetMenuVisible(
    visible: boolean,
    delay: number = 100,
    setOpening: boolean = false
  ): void {
    this.clearDelayMenuTimer();
    if (delay) {
      if (visible && setOpening) {
        this.isOpening = true;
      }
      this.delayMenuTimer = setTimeout(() => {
        this.setMenuVisible(visible);
        this.cdr.detectChanges();
        this.clearDelayMenuTimer();
        if (visible) {
          setTimeout(() => {
            this.isOpening = false;
          }, 100);
        }
      }, delay);
    } else {
      this.setMenuVisible(visible);
    }
  }

  setMenuVisible(visible: boolean): void {
    if (this.mpDisabled || this.menuVisible === visible) {
      return;
    }
    if (visible) {
      this.cascaderService.syncOptions();
    }

    this.menuVisible = visible;
    this.mpVisibleChange.emit(visible);
    this.cdr.detectChanges();
  }

  private clearDelayMenuTimer(): void {
    if (this.delayMenuTimer) {
      clearTimeout(this.delayMenuTimer);
      this.delayMenuTimer = null;
    }
  }

  clearSelection(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.labelRenderText = '';
    this.labelRenderContext = {};
    this.inputValue = '';
    this.setMenuVisible(false);
    this.cascaderService.clear();
  }

  getSubmitValue(): MpSafeAny[] {
    return this.cascaderService.selectedOptions.map(o =>
      this.cascaderService.getOptionValue(o)
    );
  }

  focus(): void {
    if (!this.isFocused) {
      (this.input ? this.input.nativeElement : this.el).focus();
      this.isFocused = true;
    }
  }

  blur(): void {
    if (this.isFocused) {
      (this.input ? this.input.nativeElement : this.el).blur();
      this.isFocused = false;
    }
  }

  handleInputBlur(): void {
    this.menuVisible ? this.focus() : this.blur();
  }

  handleInputFocus(): void {
    this.focus();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;

    if (
      keyCode !== DOWN_ARROW &&
      keyCode !== UP_ARROW &&
      keyCode !== LEFT_ARROW &&
      keyCode !== RIGHT_ARROW &&
      keyCode !== ENTER &&
      keyCode !== BACKSPACE &&
      keyCode !== ESCAPE
    ) {
      return;
    }

    // Press any keys above to reopen menu.
    if (!this.menuVisible && keyCode !== BACKSPACE && keyCode !== ESCAPE) {
      return this.setMenuVisible(true);
    }

    // Make these keys work as default in searching mode.
    if (
      this.inSearchingMode &&
      (keyCode === BACKSPACE ||
        keyCode === LEFT_ARROW ||
        keyCode === RIGHT_ARROW)
    ) {
      return;
    }

    // Interact with the component.
    if (this.menuVisible) {
      event.preventDefault();
      if (keyCode === DOWN_ARROW) {
        this.moveUpOrDown(false);
      } else if (keyCode === UP_ARROW) {
        this.moveUpOrDown(true);
      } else if (keyCode === LEFT_ARROW) {
        this.moveLeft();
      } else if (keyCode === RIGHT_ARROW) {
        this.moveRight();
      } else if (keyCode === ENTER) {
        this.onEnter();
      }
    }
  }

  @HostListener('click')
  onTriggerClick(): void {
    if (this.mpDisabled) {
      return;
    }
    if (this.mpShowSearch) {
      this.focus();
    }
    if (this.isActionTrigger('click')) {
      this.delaySetMenuVisible(!this.menuVisible, 100);
    }
    this.onTouched();
  }

  @HostListener('mouseenter')
  onTriggerMouseEnter(): void {
    if (this.mpDisabled || !this.isActionTrigger('hover')) {
      return;
    }

    this.delaySetMenuVisible(true, this.mpMouseEnterDelay, true);
  }

  @HostListener('mouseleave', ['$event'])
  onTriggerMouseLeave(event: MouseEvent): void {
    if (
      this.mpDisabled ||
      !this.menuVisible ||
      this.isOpening ||
      !this.isActionTrigger('hover')
    ) {
      event.preventDefault();
      return;
    }
    const mouseTarget = event.relatedTarget as HTMLElement;
    const hostEl = this.el;
    const menuEl = this.menu && (this.menu.nativeElement as HTMLElement);
    if (
      hostEl.contains(mouseTarget) ||
      (menuEl && menuEl.contains(mouseTarget))
    ) {
      return;
    }
    this.delaySetMenuVisible(false, this.mpMouseLeaveDelay);
  }

  onOptionMouseEnter(
    option: MpCascaderOption,
    columnIndex: number,
    event: Event
  ): void {
    event.preventDefault();
    if (this.mpExpandTrigger === 'hover') {
      if (!option.isLeaf) {
        this.delaySetOptionActivated(option, columnIndex, false);
      } else {
        this.cascaderService.setOptionDeactivatedSinceColumn(columnIndex);
      }
    }
  }

  onOptionMouseLeave(
    option: MpCascaderOption,
    _columnIndex: number,
    event: Event
  ): void {
    event.preventDefault();
    if (this.mpExpandTrigger === 'hover' && !option.isLeaf) {
      this.clearDelaySelectTimer();
    }
  }

  onOptionClick(
    option: MpCascaderOption,
    columnIndex: number,
    event: Event
  ): void {
    if (event) {
      event.preventDefault();
    }
    if (option && option.disabled) {
      return;
    }
    this.el.focus();
    this.inSearchingMode
      ? this.cascaderService.setSearchOptionSelected(
          option as MpCascaderSearchOption
        )
      : this.cascaderService.setOptionActivated(option, columnIndex, true);
  }

  private isActionTrigger(action: 'click' | 'hover'): boolean {
    return typeof this.mpTriggerAction === 'string'
      ? this.mpTriggerAction === action
      : this.mpTriggerAction.indexOf(action) !== -1;
  }

  private onEnter(): void {
    const columnIndex = Math.max(
      this.cascaderService.activatedOptions.length - 1,
      0
    );
    const option = this.cascaderService.activatedOptions[columnIndex];
    if (option && !option.disabled) {
      this.inSearchingMode
        ? this.cascaderService.setSearchOptionSelected(
            option as MpCascaderSearchOption
          )
        : this.cascaderService.setOptionActivated(option, columnIndex, true);
    }
  }

  private moveUpOrDown(isUp: boolean): void {
    const columnIndex = Math.max(
      this.cascaderService.activatedOptions.length - 1,
      0
    );
    const activeOption = this.cascaderService.activatedOptions[columnIndex];
    const options = this.cascaderService.columns[columnIndex] || [];
    const length = options.length;
    let nextIndex = -1;
    if (!activeOption) {
      // Not selected options in this column
      nextIndex = isUp ? length : -1;
    } else {
      nextIndex = options.indexOf(activeOption);
    }

    while (true) {
      nextIndex = isUp ? nextIndex - 1 : nextIndex + 1;
      if (nextIndex < 0 || nextIndex >= length) {
        break;
      }
      const nextOption = options[nextIndex];
      if (!nextOption || nextOption.disabled) {
        continue;
      }
      this.cascaderService.setOptionActivated(nextOption, columnIndex);
      break;
    }
  }

  private moveLeft(): void {
    const options = this.cascaderService.activatedOptions;
    if (options.length) {
      options.pop(); // Remove the last one
    }
  }

  private moveRight(): void {
    const length = this.cascaderService.activatedOptions.length;
    const options = this.cascaderService.columns[length];
    if (options && options.length) {
      const nextOpt = options.find(o => !o.disabled);
      if (nextOpt) {
        this.cascaderService.setOptionActivated(nextOpt, length);
      }
    }
  }

  private clearDelaySelectTimer(): void {
    if (this.delaySelectTimer) {
      clearTimeout(this.delaySelectTimer);
      this.delaySelectTimer = null;
    }
  }

  private delaySetOptionActivated(
    option: MpCascaderOption,
    columnIndex: number,
    performSelect: boolean
  ): void {
    this.clearDelaySelectTimer();
    this.delaySelectTimer = setTimeout(() => {
      this.cascaderService.setOptionActivated(
        option,
        columnIndex,
        performSelect
      );
      this.delaySelectTimer = null;
    }, 150);
  }

  private toggleSearchingMode(toSearching: boolean): void {
    if (this.inSearchingMode !== toSearching) {
      this.cascaderService.toggleSearchingMode(toSearching);
    }

    if (this.inSearchingMode) {
      this.cascaderService.prepareSearchOptions(this.inputValue);
    }
  }

  isOptionActivated(option: MpCascaderOption, index: number): boolean {
    const activeOpt = this.cascaderService.activatedOptions[index];
    return activeOpt === option;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.closeMenu();
    }
    this.mpDisabled = isDisabled;
  }

  closeMenu(): void {
    this.blur();
    this.clearDelayMenuTimer();
    this.setMenuVisible(false);
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    const newValue =
      position.connectionPair.originY === 'bottom' ? 'bottom' : 'top';
    if (this.dropDownPosition !== newValue) {
      this.dropDownPosition = newValue;
      this.cdr.detectChanges();
    }
  }

  /**
   * Reposition the cascader panel. When a menu opens, the cascader expands
   * and may exceed the boundary of browser's window.
   */
  private reposition(): void {
    if (this.overlay && this.overlay.overlayRef && this.menuVisible) {
      Promise.resolve().then(() => {
        this.overlay.overlayRef.updatePosition();
      });
    }
  }

  /**
   * When a cascader options is changed, a child needs to know that it should re-render.
   */
  private checkChildren(): void {
    if (this.cascaderItems) {
      this.cascaderItems.forEach(item => item.markForCheck());
    }
  }

  private setDisplayLabel(): void {
    const selectedOptions = this.cascaderService.selectedOptions;
    const labels: string[] = selectedOptions.map(o =>
      this.cascaderService.getOptionLabel(o)
    );

    if (this.isLabelRenderTemplate) {
      this.labelRenderContext = { labels, selectedOptions };
    } else {
      this.labelRenderText = defaultDisplayRender.call(
        this,
        labels,
        selectedOptions
      );
    }
  }

  private setDropdownStyles(): void {
    const firstColumn = this.cascaderService.columns[0];

    this.shouldShowEmpty =
      (this.inSearchingMode && (!firstColumn || !firstColumn.length)) || // Should show empty when there's no searching result
      (!(this.mpOptions && this.mpOptions.length) && !this.mpLoadData); // Should show when there's no options and developer does not use mpLoadData
    this.dropdownHeightStyle = this.shouldShowEmpty ? 'auto' : '';

    if (this.input) {
      this.dropdownWidthStyle =
        this.inSearchingMode || this.shouldShowEmpty
          ? `${this.input.nativeElement.offsetWidth}px`
          : '';
    }
  }

  private setLocale(): void {
    this.locale = this.i18nService.getLocaleData('global');
    this.cdr.markForCheck();
  }
}
