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
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../core/types';
import { toNumber } from '../core/util';

@Component({
  selector: 'div[mp-pagination-options]',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mp-select
      class="ant-pagination-options-size-changer"
      *ngIf="showSizeChanger"
      [mpDisabled]="disabled"
      [mpSize]="mpSize"
      [ngModel]="pageSize"
      (ngModelChange)="onPageSizeChange($event)"
    >
      <mp-option
        *ngFor="let option of listOfPageSizeOption; trackBy: trackByOption"
        [mpLabel]="option.label"
        [mpValue]="option.value"
      ></mp-option>
    </mp-select>
    <div class="ant-pagination-options-quick-jumper" *ngIf="showQuickJumper">
      {{ locale.jump_to }}
      <input
        [disabled]="disabled"
        (keydown.enter)="jumpToPageViaInput($event)"
      />
      {{ locale.page }}
    </div>
  `,
  host: {
    '[class.ant-pagination-options]': 'true'
  }
})
export class MpPaginationOptionsComponent implements OnChanges {
  @Input() mpSize: 'default' | 'small' = 'default';
  @Input() disabled = false;
  @Input() showSizeChanger = false;
  @Input() showQuickJumper = false;
  @Input() locale: MpSafeAny = {};
  @Input() total = 0;
  @Input() pageIndex = 1;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [];
  @Output() readonly pageIndexChange = new EventEmitter<number>();
  @Output() readonly pageSizeChange = new EventEmitter<number>();
  listOfPageSizeOption: Array<{ value: number; label: string }> = [];

  onPageSizeChange(size: number): void {
    if (this.pageSize !== size) {
      this.pageSizeChange.next(size);
    }
  }

  jumpToPageViaInput($event: Event): void {
    const target = $event.target as HTMLInputElement;
    const index = toNumber(target.value, this.pageIndex);
    this.pageIndexChange.next(index);
    target.value = '';
  }

  trackByOption(_: number, option: { value: number; label: string }): number {
    return option.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { pageSize, pageSizeOptions, locale } = changes;
    if (pageSize || pageSizeOptions || locale) {
      this.listOfPageSizeOption = [
        ...new Set([...this.pageSizeOptions, this.pageSize])
      ].map(item => {
        return {
          value: item,
          label: `${item} ${this.locale.items_per_page}`
        };
      });
    }
  }
}
