/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../core/types';

@Component({
  selector: 'mp-option-item',
  template: `
    <div class="ant-select-item-option-content">
      <ng-container *ngIf="!customContent; else template">{{
        label
      }}</ng-container>
    </div>
    <div
      *ngIf="showState && selected"
      class="ant-select-item-option-state"
      style="user-select: none"
      unselectable="on"
    >
      <i
        mp-icon
        mpType="check"
        class="ant-select-selected-icon"
        *ngIf="!icon; else icon"
      ></i>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ant-select-item]': 'true',
    '[class.ant-select-item-option]': 'true',
    '[class.ant-select-item-option-grouped]': 'grouped',
    '[class.ant-select-item-option-selected]': 'selected && !disabled',
    '[class.ant-select-item-option-disabled]': 'disabled',
    '[class.ant-select-item-option-active]': 'activated && !disabled',
    '(mouseenter)': 'onHostMouseEnter()',
    '(click)': 'onHostClick()'
  }
})
export class MpOptionItemComponent implements OnChanges {
  selected = false;
  activated = false;
  @Input() grouped = false;
  @Input() customContent = false;
  @Input() template: TemplateRef<MpSafeAny> | null = null;
  @Input() disabled = false;
  @Input() showState = false;
  @Input() label: string | null = null;
  @Input() value: MpSafeAny | null = null;
  @Input() activatedValue: MpSafeAny | null = null;
  @Input() listOfSelectedValue: MpSafeAny[] = [];
  @Input() icon: TemplateRef<MpSafeAny> | null = null;
  @Input() compareWith: (o1: MpSafeAny, o2: MpSafeAny) => boolean;
  @Output() readonly itemClick = new EventEmitter<MpSafeAny>();
  @Output() readonly itemHover = new EventEmitter<MpSafeAny>();
  onHostMouseEnter(): void {
    if (!this.disabled) {
      this.itemHover.next(this.value);
    }
  }
  onHostClick(): void {
    if (!this.disabled) {
      this.itemClick.next(this.value);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    const { value, activatedValue, listOfSelectedValue } = changes;
    if (value || listOfSelectedValue) {
      this.selected = this.listOfSelectedValue.find(v =>
        this.compareWith(v, this.value)
      );
    }
    if (value || activatedValue) {
      this.activated = this.compareWith(this.activatedValue, this.value);
    }
  }
}
