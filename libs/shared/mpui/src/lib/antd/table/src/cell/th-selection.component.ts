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
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../../../core/types';
import { InputBoolean } from '../../../core/util';

@Component({
  selector:
    'th[mpSelections],th[mpChecked],th[mpShowCheckbox],th[mpShowRowSelection]',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mp-table-selection
      [checked]="mpChecked"
      [disabled]="mpDisabled"
      [indeterminate]="mpIndeterminate"
      [listOfSelections]="mpSelections"
      [showCheckbox]="mpShowCheckbox"
      [showRowSelection]="mpShowRowSelection"
      (checkedChange)="onCheckedChange($event)"
    ></mp-table-selection>
    <ng-content></ng-content>
  `,
  host: {
    '[class.ant-table-selection-column]': 'true'
  }
})
export class MpThSelectionComponent implements OnChanges {
  @Input() mpSelections: Array<{
    text: string;
    onSelect(...args: MpSafeAny[]): MpSafeAny;
  }> = [];
  @Input() mpChecked = false;
  @Input() mpDisabled = false;
  @Input() mpIndeterminate = false;
  @Input() @InputBoolean() mpShowCheckbox = false;
  @Input() @InputBoolean() mpShowRowSelection = false;
  @Output() readonly mpCheckedChange = new EventEmitter<boolean>();
  @Output() readonly mpSortChangeWithKey = new EventEmitter<{
    key: string;
    value: string | null;
  }>();

  onCheckedChange(checked: boolean): void {
    this.mpChecked = checked;
    this.mpCheckedChange.emit(checked);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpChecked, mpSelections } = changes;
    const isShowCheckbox = mpChecked && mpChecked.firstChange;
    if (isShowCheckbox) {
      this.mpShowCheckbox = true;
    }
    const isShowSelections = mpSelections && mpSelections.firstChange;
    if (isShowSelections) {
      this.mpShowRowSelection = true;
    }
  }
}
