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
  ElementRef,
  EventEmitter,
  Input,
  Optional,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../core/types';
import { InputBoolean, scrollIntoView } from '../core/util';

import { MpAutocompleteOptgroupComponent } from './autocomplete-optgroup.component';

export class MpOptionSelectionChange {
  constructor(
    public source: MpAutocompleteOptionComponent,
    public isUserInput: boolean = false
  ) {}
}

@Component({
  selector: 'mp-auto-option',
  exportAs: 'mpAutoOption',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ant-select-item-option-content">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    role: 'menuitem',
    class: 'ant-select-item ant-select-item-option',
    '[class.ant-select-item-option-grouped]': 'mpAutocompleteOptgroupComponent',
    '[class.ant-select-item-option-selected]': 'selected',
    '[class.ant-select-item-option-active]': 'active',
    '[class.ant-select-item-option-disabled]': 'mpDisabled',
    '[attr.aria-selected]': 'selected.toString()',
    '[attr.aria-disabled]': 'mpDisabled.toString()',
    '(click)': 'selectViaInteraction()',
    '(mouseenter)': 'onMouseEnter()',
    '(mousedown)': '$event.preventDefault()'
  }
})
export class MpAutocompleteOptionComponent {
  @Input() mpValue: MpSafeAny;
  @Input() mpLabel: string;
  @Input() @InputBoolean() mpDisabled = false;
  @Output() readonly selectionChange = new EventEmitter<
    MpOptionSelectionChange
  >();
  @Output() readonly mouseEntered = new EventEmitter<
    MpAutocompleteOptionComponent
  >();

  active = false;
  selected = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private element: ElementRef,
    @Optional()
    public mpAutocompleteOptgroupComponent: MpAutocompleteOptgroupComponent
  ) {}

  select(emit: boolean = true): void {
    this.selected = true;
    this.changeDetectorRef.markForCheck();
    if (emit) {
      this.emitSelectionChangeEvent();
    }
  }

  onMouseEnter(): void {
    this.mouseEntered.emit(this);
  }

  deselect(): void {
    this.selected = false;
    this.changeDetectorRef.markForCheck();
    this.emitSelectionChangeEvent();
  }

  /** Git display label */
  getLabel(): string {
    return this.mpLabel || this.mpValue.toString();
  }

  /** Set active (only styles) */
  setActiveStyles(): void {
    if (!this.active) {
      this.active = true;
      this.changeDetectorRef.markForCheck();
    }
  }

  /** Unset active (only styles) */
  setInactiveStyles(): void {
    if (this.active) {
      this.active = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  scrollIntoViewIfNeeded(): void {
    scrollIntoView(this.element.nativeElement);
  }

  selectViaInteraction(): void {
    if (!this.mpDisabled) {
      this.selected = !this.selected;
      if (this.selected) {
        this.setActiveStyles();
      } else {
        this.setInactiveStyles();
      }
      this.emitSelectionChangeEvent(true);
      this.changeDetectorRef.markForCheck();
    }
  }

  private emitSelectionChangeEvent(isUserInput: boolean = false): void {
    this.selectionChange.emit(new MpOptionSelectionChange(this, isUserInput));
  }
}
