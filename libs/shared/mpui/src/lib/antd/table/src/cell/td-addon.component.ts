/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
/* tslint:disable:component-selector */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { InputBoolean } from '../../../core/util';

@Component({
  selector:
    'td[mpChecked], td[mpDisabled], td[mpIndeterminate], td[mpIndentSize], td[mpExpand], td[mpShowExpand], td[mpShowCheckbox]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-container *ngIf="mpShowExpand || mpIndentSize > 0">
      <mp-row-indent [indentSize]="mpIndentSize"></mp-row-indent>
      <button
        mp-row-expand-button
        [expand]="mpExpand"
        (expandChange)="onExpandChange($event)"
        [spaceMode]="!mpShowExpand"
      ></button>
    </ng-container>
    <label
      mp-checkbox
      *ngIf="mpShowCheckbox"
      [mpDisabled]="mpDisabled"
      [ngModel]="mpChecked"
      [mpIndeterminate]="mpIndeterminate"
      (ngModelChange)="onCheckedChange($event)"
    >
    </label>
    <ng-content></ng-content>
  `,
  host: {
    '[class.ant-table-cell-with-append]': `mpShowExpand || mpIndentSize > 0`,
    '[class.ant-table-selection-column]': `mpShowCheckbox`
  }
})
export class MpTdAddOnComponent implements OnChanges {
  @Input() mpChecked = false;
  @Input() mpDisabled = false;
  @Input() mpIndeterminate = false;
  @Input() mpIndentSize = 0;
  @Input() @InputBoolean() mpShowExpand = false;
  @Input() @InputBoolean() mpShowCheckbox = false;
  @Input() @InputBoolean() mpExpand = false;
  @Output() readonly mpCheckedChange = new EventEmitter<boolean>();
  @Output() readonly mpExpandChange = new EventEmitter<boolean>();
  private isMpShowExpandChanged = false;
  private isMpShowCheckboxChanged = false;

  onCheckedChange(checked: boolean): void {
    this.mpChecked = checked;
    this.mpCheckedChange.emit(checked);
  }

  onExpandChange(expand: boolean): void {
    this.mpExpand = expand;
    this.mpExpandChange.emit(expand);
  }
  ngOnChanges(changes: SimpleChanges): void {
    const isFirstChange = (value: SimpleChange) =>
      value && value.firstChange && value.currentValue !== undefined;
    const { mpExpand, mpChecked, mpShowExpand, mpShowCheckbox } = changes;
    if (mpShowExpand) {
      this.isMpShowExpandChanged = true;
    }
    if (mpShowCheckbox) {
      this.isMpShowCheckboxChanged = true;
    }
    if (isFirstChange(mpExpand) && !this.isMpShowExpandChanged) {
      this.mpShowExpand = true;
    }
    if (isFirstChange(mpChecked) && !this.isMpShowCheckboxChanged) {
      this.mpShowCheckbox = true;
    }
  }
}
