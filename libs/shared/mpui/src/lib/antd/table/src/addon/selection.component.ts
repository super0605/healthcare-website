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
  Output,
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../../../core/types';

@Component({
  selector: 'mp-table-selection',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <label
      *ngIf="showCheckbox"
      mp-checkbox
      [class.ant-table-selection-select-all-custom]="showRowSelection"
      [ngModel]="checked"
      [mpDisabled]="disabled"
      [mpIndeterminate]="indeterminate"
      (ngModelChange)="onCheckedChange($event)"
    >
    </label>
    <div class="ant-table-selection-extra" *ngIf="showRowSelection">
      <span
        mp-dropdown
        class="ant-table-selection-down"
        mpPlacement="bottomLeft"
        [mpDropdownMenu]="selectionMenu"
      >
        <i mp-icon mpType="down"></i>
      </span>
      <mp-dropdown-menu #selectionMenu="mpDropdownMenu">
        <ul mp-menu class="ant-table-selection-menu">
          <li
            mp-menu-item
            *ngFor="let selection of listOfSelections"
            (click)="selection.onSelect()"
          >
            {{ selection.text }}
          </li>
        </ul>
      </mp-dropdown-menu>
    </div>
  `,
  host: {
    '[class.ant-table-selection]': 'true'
  }
})
export class MpTableSelectionComponent {
  @Input() listOfSelections: Array<{
    text: string;
    onSelect(...args: MpSafeAny[]): MpSafeAny;
  }> = [];
  @Input() checked = false;
  @Input() disabled = false;
  @Input() indeterminate = false;
  @Input() showCheckbox = false;
  @Input() showRowSelection = false;
  @Output() readonly checkedChange = new EventEmitter<boolean>();
  onCheckedChange(checked: boolean): void {
    this.checked = checked;
    this.checkedChange.emit(checked);
  }
}
