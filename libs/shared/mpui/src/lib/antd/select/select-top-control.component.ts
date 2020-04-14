/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BACKSPACE } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Host,
  Input,
  OnChanges,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { zoomMotion } from '../core/animation';
import { MpNoAnimationDirective } from '../core/no-animation';
import { MpSafeAny } from '../core/types';
import { MpSelectSearchComponent } from './select-search.component';
import {
  MpSelectItemInterface,
  MpSelectModeType,
  MpSelectTopControlItemType
} from './select.types';

@Component({
  selector: 'mp-select-top-control',
  exportAs: 'mpSelectTopControl',
  preserveWhitespaces: false,
  animations: [zoomMotion],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <!--single mode-->
    <ng-container [ngSwitch]="mode">
      <ng-container *ngSwitchCase="'default'">
        <mp-select-item
          *ngIf="isShowSingleLabel"
          [deletable]="false"
          [disabled]="false"
          [removeIcon]="removeIcon"
          [label]="listOfTopItem[0].mpLabel"
          [contentTemplateOutlet]="customTemplate"
          [contentTemplateOutletContext]="listOfTopItem[0]"
        ></mp-select-item>
        <mp-select-search
          [disabled]="disabled"
          [value]="inputValue"
          [showInput]="open && showSearch"
          [mirrorSync]="false"
          [autofocus]="autofocus"
          [focusTrigger]="open"
          (isComposingChange)="isComposingChange($event)"
          (valueChange)="onInputValueChange($event)"
        ></mp-select-search>
      </ng-container>
      <ng-container *ngSwitchDefault>
        <!--multiple or tags mode-->
        <mp-select-item
          *ngFor="let item of listOfSlicedItem; trackBy: trackValue"
          [@zoomMotion]
          [@.disabled]="noAnimation?.mpNoAnimation"
          [mpNoAnimation]="noAnimation?.mpNoAnimation"
          [removeIcon]="removeIcon"
          [label]="item.mpLabel"
          [disabled]="item.mpDisabled || disabled"
          [contentTemplateOutlet]="item.contentTemplateOutlet"
          [deletable]="true"
          [contentTemplateOutletContext]="item.contentTemplateOutletContext"
          (@zoomMotion.done)="onAnimationEnd()"
          (delete)="onDeleteItem(item.contentTemplateOutletContext)"
        >
        </mp-select-item>
        <mp-select-search
          [disabled]="disabled"
          [value]="inputValue"
          [autofocus]="autofocus"
          [showInput]="true"
          [mirrorSync]="true"
          [focusTrigger]="open"
          (isComposingChange)="isComposingChange($event)"
          (valueChange)="onInputValueChange($event)"
        ></mp-select-search>
      </ng-container>
    </ng-container>
    <mp-select-placeholder
      *ngIf="isShowPlaceholder"
      [placeholder]="placeHolder"
    ></mp-select-placeholder>
  `,
  host: {
    '[class.ant-select-selector]': 'true',
    '(click)': 'onHostClick()',
    '(keydown)': 'onHostKeydown($event)'
  }
})
export class MpSelectTopControlComponent implements OnChanges {
  @Input() showSearch = false;
  @Input() placeHolder: string | TemplateRef<MpSafeAny> | null = null;
  @Input() open = false;
  @Input() maxTagCount: number = Infinity;
  @Input() autofocus = false;
  @Input() disabled = false;
  @Input() mode: MpSelectModeType = 'default';
  @Input() customTemplate: TemplateRef<{
    $implicit: MpSelectItemInterface;
  }> | null = null;
  @Input() maxTagPlaceholder: TemplateRef<{
    $implicit: MpSafeAny[];
  }> | null = null;
  @Input() removeIcon: TemplateRef<MpSafeAny> | null = null;
  @Input() listOfTopItem: MpSelectItemInterface[] = [];
  @Input() tokenSeparators: string[] = [];
  @Output() readonly tokenize = new EventEmitter<string[]>();
  @Output() readonly inputValueChange = new EventEmitter<string | null>();
  @Output() readonly animationEnd = new EventEmitter<void>();
  @Output() readonly deleteItem = new EventEmitter<MpSelectItemInterface>();
  @Output() readonly openChange = new EventEmitter<boolean>();
  @ViewChild(MpSelectSearchComponent)
  mpSelectSearchComponent: MpSelectSearchComponent;
  listOfSlicedItem: MpSelectTopControlItemType[] = [];
  isShowPlaceholder = true;
  isShowSingleLabel = false;
  isComposing = false;
  inputValue: string | null = null;

  onHostClick(): void {
    if (!this.disabled) {
      this.openChange.next(!this.open);
    }
  }

  onHostKeydown(e: KeyboardEvent): void {
    const inputValue = (e.target as HTMLInputElement).value;
    if (
      e.keyCode === BACKSPACE &&
      this.mode !== 'default' &&
      !inputValue &&
      this.listOfTopItem.length > 0
    ) {
      e.preventDefault();
      this.onDeleteItem(this.listOfTopItem[this.listOfTopItem.length - 1]);
    }
  }

  updateTemplateVariable(): void {
    const isSelectedValueEmpty = this.listOfTopItem.length === 0;
    this.isShowPlaceholder =
      isSelectedValueEmpty && !this.isComposing && !this.inputValue;
    this.isShowSingleLabel =
      !isSelectedValueEmpty && !this.isComposing && !this.inputValue;
  }

  isComposingChange(isComposing: boolean): void {
    this.isComposing = isComposing;
    this.updateTemplateVariable();
  }

  onInputValueChange(value: string): void {
    if (value !== this.inputValue) {
      this.inputValue = value;
      this.updateTemplateVariable();
      this.inputValueChange.emit(value);
      this.tokenSeparate(value, this.tokenSeparators);
    }
  }

  tokenSeparate(inputValue: string, tokenSeparators: string[]): void {
    const includesSeparators = (
      str: string | string[],
      separators: string[]
    ): boolean => {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < separators.length; ++i) {
        if (str.lastIndexOf(separators[i]) > 0) {
          return true;
        }
      }
      return false;
    };
    const splitBySeparators = (
      str: string | string[],
      separators: string[]
    ): string[] => {
      const reg = new RegExp(`[${separators.join()}]`);
      const array = (str as string).split(reg).filter(token => token);
      return [...new Set(array)];
    };
    if (
      inputValue &&
      inputValue.length &&
      tokenSeparators.length &&
      this.mode !== 'default' &&
      includesSeparators(inputValue, tokenSeparators)
    ) {
      const listOfLabel = splitBySeparators(inputValue, tokenSeparators);
      this.tokenize.next(listOfLabel);
    }
  }

  clearInputValue(): void {
    if (this.mpSelectSearchComponent) {
      this.mpSelectSearchComponent.clearInputValue();
    }
  }

  focus(): void {
    if (this.mpSelectSearchComponent) {
      this.mpSelectSearchComponent.focus();
    }
  }

  blur(): void {
    if (this.mpSelectSearchComponent) {
      this.mpSelectSearchComponent.blur();
    }
  }

  trackValue(_index: number, option: MpSelectTopControlItemType): MpSafeAny {
    return option.mpValue;
  }

  onDeleteItem(item: MpSelectItemInterface): void {
    if (!this.disabled && !item.mpDisabled) {
      this.deleteItem.next(item);
    }
  }

  onAnimationEnd(): void {
    this.animationEnd.next();
  }

  constructor(
    @Host() @Optional() public noAnimation?: MpNoAnimationDirective
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const {
      listOfTopItem,
      maxTagCount,
      customTemplate,
      maxTagPlaceholder
    } = changes;
    if (listOfTopItem) {
      this.updateTemplateVariable();
    }
    if (listOfTopItem || maxTagCount || customTemplate || maxTagPlaceholder) {
      const listOfSlicedItem: MpSelectTopControlItemType[] = this.listOfTopItem
        .slice(0, this.maxTagCount)
        .map(o => {
          return {
            mpLabel: o.mpLabel,
            mpValue: o.mpValue,
            mpDisabled: o.mpDisabled,
            contentTemplateOutlet: this.customTemplate,
            contentTemplateOutletContext: o
          };
        });
      if (this.listOfTopItem.length > this.maxTagCount) {
        const exceededLabel = `+ ${this.listOfTopItem.length -
          this.maxTagCount} ...`;
        const listOfSelectedValue = this.listOfTopItem.map(
          item => item.mpValue
        );
        const exceededItem = {
          mpLabel: exceededLabel,
          mpValue: '$$__mp_exceeded_item',
          mpDisabled: true,
          contentTemplateOutlet: this.maxTagPlaceholder,
          contentTemplateOutletContext: listOfSelectedValue.slice(
            this.maxTagCount
          )
        };
        listOfSlicedItem.push(exceededItem);
      }
      this.listOfSlicedItem = listOfSlicedItem;
    }
  }
}
