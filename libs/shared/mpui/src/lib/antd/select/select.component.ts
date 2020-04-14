/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { DOWN_ARROW, ENTER, SPACE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { slideMotion } from '../core/animation';
import { MpNoAnimationDirective } from '../core/no-animation';
import { MpSafeAny, OnChangeType, OnTouchedType } from '../core/types';
import { InputBoolean } from '../core/util';
import { BehaviorSubject, combineLatest, merge, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { MpOptionGroupComponent } from './option-group.component';
import { MpOptionComponent } from './option.component';
import { MpSelectTopControlComponent } from './select-top-control.component';
import {
  MpFilterOptionType,
  MpSelectItemInterface,
  MpSelectModeType
} from './select.types';

const defaultFilterOption: MpFilterOptionType = (
  searchValue: string,
  item: MpSelectItemInterface
): boolean => {
  if (item && item.mpLabel) {
    return item.mpLabel.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
  } else {
    return false;
  }
};

export type MpSelectSizeType = 'large' | 'default' | 'small';

@Component({
  selector: 'mp-select',
  exportAs: 'mpSelect',
  preserveWhitespaces: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MpSelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [slideMotion],
  template: `
    <mp-select-top-control
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      [open]="mpOpen"
      [disabled]="mpDisabled"
      [mode]="mpMode"
      [@.disabled]="noAnimation?.mpNoAnimation"
      [mpNoAnimation]="noAnimation?.mpNoAnimation"
      [maxTagPlaceholder]="mpMaxTagPlaceholder"
      [removeIcon]="mpRemoveIcon"
      [placeHolder]="mpPlaceHolder"
      [maxTagCount]="mpMaxTagCount"
      [customTemplate]="mpCustomTemplate"
      [tokenSeparators]="mpTokenSeparators"
      [showSearch]="mpShowSearch"
      [autofocus]="mpAutoFocus"
      [listOfTopItem]="listOfTopItem"
      (inputValueChange)="onInputValueChange($event)"
      (tokenize)="onTokenSeparate($event)"
      (animationEnd)="updateCdkConnectedOverlayPositions()"
      (deleteItem)="onItemDelete($event)"
      (keydown)="onKeyDown($event)"
      (openChange)="setOpenState($event)"
    ></mp-select-top-control>
    <mp-select-clear
      *ngIf="mpAllowClear && !mpDisabled && listOfValue.length"
      [clearIcon]="mpClearIcon"
      (clear)="onClearSelection()"
    ></mp-select-clear>
    <mp-select-arrow
      *ngIf="mpShowArrow && mpMode === 'default'"
      [loading]="mpLoading"
      [search]="mpOpen && mpShowSearch"
      [suffixIcon]="mpSuffixIcon"
    ></mp-select-arrow>
    <ng-template
      cdkConnectedOverlay
      mpConnectedOverlay
      [cdkConnectedOverlayHasBackdrop]="true"
      [cdkConnectedOverlayMinWidth]="
        mpDropdownMatchSelectWidth ? null : triggerWidth
      "
      [cdkConnectedOverlayWidth]="
        mpDropdownMatchSelectWidth ? triggerWidth : null
      "
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayPanelClass]="mpDropdownClassName"
      (backdropClick)="setOpenState(false)"
      (detach)="setOpenState(false)"
      (positionChange)="onPositionChange($event)"
      [cdkConnectedOverlayOpen]="mpOpen"
    >
      <mp-option-container
        [style]="mpDropdownStyle"
        [class.ant-select-dropdown-placement-bottomLeft]="
          dropDownPosition === 'bottom'
        "
        [class.ant-select-dropdown-placement-topLeft]="
          dropDownPosition === 'top'
        "
        [@slideMotion]="dropDownPosition"
        [@.disabled]="noAnimation?.mpNoAnimation"
        [mpNoAnimation]="noAnimation?.mpNoAnimation"
        [listOfContainerItem]="listOfContainerItem"
        [menuItemSelectedIcon]="mpMenuItemSelectedIcon"
        [notFoundContent]="mpNotFoundContent"
        [activatedValue]="activatedValue"
        [listOfSelectedValue]="listOfValue"
        [dropdownRender]="mpDropdownRender"
        [compareWith]="compareWith"
        [mode]="mpMode"
        (keydown)="onKeyDown($event)"
        (itemClick)="onItemClick($event)"
        (itemHover)="onItemHover($event)"
        (scrollToBottom)="mpScrollToBottom.emit()"
      ></mp-option-container>
    </ng-template>
  `,
  host: {
    '[class.ant-select]': 'true',
    '[class.ant-select-lg]': 'mpSize === "large"',
    '[class.ant-select-sm]': 'mpSize === "small"',
    '[class.ant-select-show-arrow]': `mpShowArrow && mpMode === 'default'`,
    '[class.ant-select-disabled]': 'mpDisabled',
    '[class.ant-select-show-search]': `mpShowSearch || mpMode !== 'default'`,
    '[class.ant-select-allow-clear]': 'mpAllowClear',
    '[class.ant-select-borderless]': 'mpBorderless',
    '[class.ant-select-open]': 'mpOpen',
    '[class.ant-select-focused]': 'mpOpen',
    '[class.ant-select-single]': `mpMode === 'default'`,
    '[class.ant-select-multiple]': `mpMode !== 'default'`
  }
})
export class MpSelectComponent
  implements
    ControlValueAccessor,
    OnInit,
    AfterViewInit,
    OnDestroy,
    AfterContentInit,
    OnChanges {
  @Input() mpSize: MpSelectSizeType = 'default';
  @Input() mpDropdownClassName: string | null = null;
  @Input() mpDropdownMatchSelectWidth = true;
  @Input() mpDropdownStyle: { [key: string]: string } | null = null;
  @Input() mpNotFoundContent: string | undefined = undefined;
  @Input() mpPlaceHolder: string | TemplateRef<MpSafeAny> | null = null;
  @Input() mpMaxTagCount = Infinity;
  @Input() mpDropdownRender: TemplateRef<MpSafeAny> | null = null;
  @Input() mpCustomTemplate: TemplateRef<{
    $implicit: MpSelectItemInterface;
  }> | null = null;
  @Input() mpSuffixIcon: TemplateRef<MpSafeAny> | null = null;
  @Input() mpClearIcon: TemplateRef<MpSafeAny> | null = null;
  @Input() mpRemoveIcon: TemplateRef<MpSafeAny> | null = null;
  @Input() mpMenuItemSelectedIcon: TemplateRef<MpSafeAny> | null = null;
  @Input() mpShowArrow = true;
  @Input() mpTokenSeparators: string[] = [];
  @Input() mpMaxTagPlaceholder: TemplateRef<{
    $implicit: MpSafeAny[];
  }> | null = null;
  @Input() mpMaxMultipleCount = Infinity;
  @Input() mpMode: MpSelectModeType = 'default';
  @Input() mpFilterOption: MpFilterOptionType = defaultFilterOption;
  @Input() compareWith: (o1: MpSafeAny, o2: MpSafeAny) => boolean = (
    o1: MpSafeAny,
    o2: MpSafeAny
  ) => o1 === o2;
  @Input() @InputBoolean() mpAllowClear = false;
  @Input() @InputBoolean() mpBorderless = false;
  @Input() @InputBoolean() mpShowSearch = false;
  @Input() @InputBoolean() mpLoading = false;
  @Input() @InputBoolean() mpAutoFocus = false;
  @Input() @InputBoolean() mpAutoClearSearchValue = true;
  @Input() @InputBoolean() mpServerSearch = false;
  @Input() @InputBoolean() mpDisabled = false;
  @Input() @InputBoolean() mpOpen = false;
  @Output() readonly mpOnSearch = new EventEmitter<string>();
  @Output() readonly mpScrollToBottom = new EventEmitter<void>();
  @Output() readonly mpOpenChange = new EventEmitter<boolean>();
  @Output() readonly mpBlur = new EventEmitter<void>();
  @Output() readonly mpFocus = new EventEmitter<void>();
  @ViewChild(CdkOverlayOrigin, { static: true, read: ElementRef })
  originElement: ElementRef;
  @ViewChild(CdkConnectedOverlay, { static: true })
  cdkConnectedOverlay: CdkConnectedOverlay;
  @ViewChild(MpSelectTopControlComponent, { static: true })
  mpSelectTopControlComponent: MpSelectTopControlComponent;
  @ContentChildren(MpOptionComponent, { descendants: true })
  listOfMpOptionComponent: QueryList<MpOptionComponent>;
  @ContentChildren(MpOptionGroupComponent, { descendants: true })
  listOfMpOptionGroupComponent: QueryList<MpOptionGroupComponent>;
  @ViewChild(MpOptionGroupComponent, { static: true, read: ElementRef })
  mpOptionGroupComponentElement: ElementRef;
  @ViewChild(MpSelectTopControlComponent, { static: true, read: ElementRef })
  mpSelectTopControlComponentElement: ElementRef;
  private listOfValue$ = new BehaviorSubject<MpSafeAny[]>([]);
  private listOfTemplateItem$ = new BehaviorSubject<MpSelectItemInterface[]>(
    []
  );
  private listOfTagAndTemplateItem: MpSelectItemInterface[] = [];
  private searchValue: string = '';
  private value: MpSafeAny | MpSafeAny[];
  private destroy$ = new Subject();
  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  dropDownPosition: 'top' | 'center' | 'bottom' = 'bottom';
  triggerWidth: number | null = null;
  listOfContainerItem: MpSelectItemInterface[] = [];
  listOfTopItem: MpSelectItemInterface[] = [];
  activatedValue: MpSafeAny | null = null;
  listOfValue: MpSafeAny[] = [];

  generateTagItem(value: string): MpSelectItemInterface {
    return {
      mpValue: value,
      mpLabel: value,
      type: 'item'
    };
  }

  onItemClick(value: MpSafeAny): void {
    this.activatedValue = value;
    if (this.mpMode === 'default') {
      if (
        this.listOfValue.length === 0 ||
        !this.compareWith(this.listOfValue[0], value)
      ) {
        this.updateListOfValue([value]);
      }
      this.setOpenState(false);
    } else {
      const targetIndex = this.listOfValue.findIndex(o =>
        this.compareWith(o, value)
      );
      if (targetIndex !== -1) {
        const listOfValueAfterRemoved = this.listOfValue.filter(
          (_, i) => i !== targetIndex
        );
        this.updateListOfValue(listOfValueAfterRemoved);
      } else if (this.listOfValue.length < this.mpMaxMultipleCount) {
        const listOfValueAfterAdded = [...this.listOfValue, value];
        this.updateListOfValue(listOfValueAfterAdded);
      }
      this.focus();
      if (this.mpAutoClearSearchValue) {
        this.clearInput();
      }
    }
  }

  onItemDelete(item: MpSelectItemInterface): void {
    const listOfSelectedValue = this.listOfValue.filter(
      v => !this.compareWith(v, item.mpValue)
    );
    this.updateListOfValue(listOfSelectedValue);
    this.clearInput();
  }

  onItemHover(value: MpSafeAny): void {
    this.activatedValue = value;
  }

  updateListOfContainerItem(): void {
    let listOfContainerItem = this.listOfTagAndTemplateItem
      .filter(item => !item.mpHide)
      .filter(item => {
        if (!this.mpServerSearch && this.searchValue) {
          return this.mpFilterOption(this.searchValue, item);
        } else {
          return true;
        }
      });
    if (
      this.mpMode === 'tags' &&
      this.searchValue &&
      this.listOfTagAndTemplateItem.findIndex(
        item => item.mpLabel === this.searchValue
      ) === -1
    ) {
      const tagItem = this.generateTagItem(this.searchValue);
      listOfContainerItem = [tagItem, ...listOfContainerItem];
      this.activatedValue = tagItem.mpValue;
    }
    if (
      this.listOfValue.length !== 0 &&
      listOfContainerItem.findIndex(item =>
        this.compareWith(item.mpValue, this.activatedValue)
      ) === -1
    ) {
      const activatedItem =
        listOfContainerItem.find(item =>
          this.compareWith(item.mpValue, this.listOfValue[0])
        ) || listOfContainerItem[0];
      this.activatedValue = (activatedItem && activatedItem.mpValue) || null;
    }
    /** insert group item **/
    if (this.listOfMpOptionGroupComponent) {
      this.listOfMpOptionGroupComponent.forEach(o => {
        const groupItem = {
          groupLabel: o.mpLabel,
          type: 'group',
          key: o.mpLabel
        } as MpSelectItemInterface;
        const index = this.listOfContainerItem.findIndex(
          item => groupItem.groupLabel === item.groupLabel
        );
        listOfContainerItem.splice(index, 0, groupItem);
      });
    }
    this.listOfContainerItem = [...listOfContainerItem];
    this.updateCdkConnectedOverlayPositions();
  }

  clearInput(): void {
    this.mpSelectTopControlComponent.clearInputValue();
  }

  updateListOfValue(listOfValue: MpSafeAny[]): void {
    const covertListToModel = (
      list: MpSafeAny[],
      mode: MpSelectModeType
    ): MpSafeAny[] | MpSafeAny => {
      if (mode === 'default') {
        if (list.length > 0) {
          return list[0];
        } else {
          return null;
        }
      } else {
        return list;
      }
    };
    const model = covertListToModel(listOfValue, this.mpMode);
    if (this.value !== model) {
      this.listOfValue = listOfValue;
      this.listOfValue$.next(listOfValue);
      this.value = model;
      this.onChange(this.value);
    }
  }

  onTokenSeparate(listOfLabel: string[]): void {
    const listOfMatchedValue = this.listOfTagAndTemplateItem
      .filter(
        item => listOfLabel.findIndex(label => label === item.mpLabel) !== -1
      )
      .map(item => item.mpValue)
      .filter(
        item =>
          this.listOfValue.findIndex(v => this.compareWith(v, item)) === -1
      );
    if (this.mpMode === 'multiple') {
      this.updateListOfValue([...this.listOfValue, ...listOfMatchedValue]);
    } else if (this.mpMode === 'tags') {
      const listOfUnMatchedLabel = listOfLabel.filter(
        label =>
          this.listOfTagAndTemplateItem.findIndex(
            item => item.mpLabel === label
          ) === -1
      );
      this.updateListOfValue([
        ...this.listOfValue,
        ...listOfMatchedValue,
        ...listOfUnMatchedLabel
      ]);
    }
    this.clearInput();
  }

  onKeyDown(e: KeyboardEvent): void {
    if (this.mpDisabled) {
      return;
    }
    const listOfFilteredOptionNotDisabled = this.listOfContainerItem
      .filter(item => item.type === 'item')
      .filter(item => !item.mpDisabled);
    const activatedIndex = listOfFilteredOptionNotDisabled.findIndex(item =>
      this.compareWith(item.mpValue, this.activatedValue)
    );
    switch (e.keyCode) {
      case UP_ARROW:
        e.preventDefault();
        if (this.mpOpen) {
          const preIndex =
            activatedIndex > 0
              ? activatedIndex - 1
              : listOfFilteredOptionNotDisabled.length - 1;
          this.activatedValue =
            listOfFilteredOptionNotDisabled[preIndex].mpValue;
        }
        break;
      case DOWN_ARROW:
        e.preventDefault();
        if (this.mpOpen) {
          const nextIndex =
            activatedIndex < listOfFilteredOptionNotDisabled.length - 1
              ? activatedIndex + 1
              : 0;
          this.activatedValue =
            listOfFilteredOptionNotDisabled[nextIndex].mpValue;
        } else {
          this.setOpenState(true);
        }
        break;
      case ENTER:
        e.preventDefault();
        if (this.mpOpen) {
          if (this.activatedValue) {
            this.onItemClick(this.activatedValue);
          }
        } else {
          this.setOpenState(true);
        }
        break;
      case SPACE:
        if (!this.mpOpen) {
          this.setOpenState(true);
          e.preventDefault();
        }
        break;
      case TAB:
        this.setOpenState(false);
        break;
    }
  }

  setOpenState(value: boolean): void {
    if (this.mpOpen !== value) {
      this.mpOpen = value;
      this.mpOpenChange.emit(value);
      this.onOpenChange();
      this.cdr.markForCheck();
    }
  }

  onOpenChange(): void {
    this.updateCdkConnectedOverlayStatus();
    this.clearInput();
  }

  onInputValueChange(value: string): void {
    this.searchValue = value;
    this.updateListOfContainerItem();
    this.mpOnSearch.emit(value);
    this.updateCdkConnectedOverlayPositions();
  }

  onClearSelection(): void {
    this.updateListOfValue([]);
  }

  focus(): void {
    this.mpSelectTopControlComponent.focus();
  }

  blur(): void {
    this.mpSelectTopControlComponent.blur();
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    this.dropDownPosition = position.connectionPair.originY;
  }

  updateCdkConnectedOverlayStatus(): void {
    if (this.platform.isBrowser && this.originElement.nativeElement) {
      this.triggerWidth = this.originElement.nativeElement.getBoundingClientRect().width;
    }
  }

  updateCdkConnectedOverlayPositions(): void {
    if (this.cdkConnectedOverlay.overlayRef) {
      this.cdkConnectedOverlay.overlayRef.updatePosition();
    }
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private platform: Platform,
    private focusMonitor: FocusMonitor,
    @Host() @Optional() public noAnimation?: MpNoAnimationDirective
  ) {}

  writeValue(modelValue: MpSafeAny | MpSafeAny[]): void {
    /** https://github.com/angular/angular/issues/14988 **/
    if (this.value !== modelValue) {
      this.value = modelValue;
      const covertModelToList = (
        model: MpSafeAny[] | MpSafeAny,
        mode: MpSelectModeType
      ): MpSafeAny[] => {
        if (model === null || model === undefined) {
          return [];
        } else if (mode === 'default') {
          return [model];
        } else {
          return model;
        }
      };
      const listOfValue = covertModelToList(modelValue, this.mpMode);
      this.listOfValue = listOfValue;
      this.listOfValue$.next(listOfValue);
      this.cdr.markForCheck();
    }
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.mpDisabled = disabled;
    if (disabled) {
      this.setOpenState(false);
    }
    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpOpen, mpDisabled } = changes;
    if (mpOpen) {
      this.onOpenChange();
    }
    if (mpDisabled && this.mpDisabled) {
      this.setOpenState(false);
    }
  }

  ngOnInit(): void {
    this.focusMonitor
      .monitor(this.elementRef, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe(focusOrigin => {
        if (!focusOrigin) {
          this.mpBlur.emit();
          Promise.resolve().then(() => {
            this.onTouched();
          });
        } else {
          this.mpFocus.emit();
        }
      });
    combineLatest([this.listOfValue$, this.listOfTemplateItem$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([listOfSelectedValue, listOfTemplateItem]) => {
        const listOfTagItem = listOfSelectedValue
          .filter(() => this.mpMode === 'tags')
          .filter(
            value =>
              listOfTemplateItem.findIndex(o =>
                this.compareWith(o.mpValue, value)
              ) === -1
          )
          .map(
            value =>
              this.listOfTopItem.find(o =>
                this.compareWith(o.mpValue, value)
              ) || this.generateTagItem(value)
          );
        this.listOfTagAndTemplateItem = [
          ...listOfTemplateItem,
          ...listOfTagItem
        ];
        this.listOfTopItem = this.listOfValue
          .map(
            v =>
              [...this.listOfTagAndTemplateItem, ...this.listOfTopItem].find(
                item => this.compareWith(v, item.mpValue)
              )!
          )
          .filter(item => !!item);
        this.updateListOfContainerItem();
      });
  }

  ngAfterViewInit(): void {
    this.updateCdkConnectedOverlayStatus();
  }

  ngAfterContentInit(): void {
    merge(
      this.listOfMpOptionGroupComponent.changes,
      this.listOfMpOptionComponent.changes
    )
      .pipe(
        startWith(true),
        switchMap(() =>
          merge(
            ...[
              this.listOfMpOptionComponent.changes,
              this.listOfMpOptionGroupComponent.changes,
              ...this.listOfMpOptionComponent.map(option => option.changes),
              ...this.listOfMpOptionGroupComponent.map(option => option.changes)
            ]
          ).pipe(startWith(true))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const listOfOptionInterface = this.listOfMpOptionComponent
          .toArray()
          .map(item => {
            const {
              template,
              mpLabel,
              mpValue,
              mpDisabled,
              mpHide,
              mpCustomContent,
              groupLabel
            } = item;
            return {
              template,
              mpLabel,
              mpValue,
              mpDisabled,
              mpHide,
              mpCustomContent,
              groupLabel,
              type: 'item',
              key: mpValue
            };
          });
        this.listOfTemplateItem$.next(listOfOptionInterface);
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
