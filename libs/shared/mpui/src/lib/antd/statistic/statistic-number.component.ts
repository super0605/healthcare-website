/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { getLocaleNumberSymbol, NumberSymbol } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  LOCALE_ID,
  OnChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MpStatisticValueType } from './typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  selector: 'mp-statistic-number',
  exportAs: 'mpStatisticNumber',
  template: `
    <span class="ant-statistic-content-value">
      <ng-container
        *ngIf="mpValueTemplate"
        [ngTemplateOutlet]="mpValueTemplate"
        [ngTemplateOutletContext]="{ $implicit: mpValue }"
      >
      </ng-container>
      <ng-container *ngIf="!mpValueTemplate">
        <span *ngIf="displayInt" class="ant-statistic-content-value-int">{{
          displayInt
        }}</span>
        <span
          *ngIf="displayDecimal"
          class="ant-statistic-content-value-decimal"
          >{{ displayDecimal }}</span
        >
      </ng-container>
    </span>
  `
})
export class MpStatisticNumberComponent implements OnChanges {
  @Input() mpValue: MpStatisticValueType;
  @Input() mpValueTemplate: TemplateRef<{ $implicit: MpStatisticValueType }>;

  displayInt = '';
  displayDecimal = '';

  constructor(@Inject(LOCALE_ID) private locale_id: string) {}

  ngOnChanges(): void {
    this.formatNumber();
  }

  private formatNumber(): void {
    const decimalSeparator: string =
      typeof this.mpValue === 'number'
        ? '.'
        : getLocaleNumberSymbol(this.locale_id, NumberSymbol.Decimal);
    const value = String(this.mpValue);
    const [int, decimal] = value.split(decimalSeparator);

    this.displayInt = int;
    this.displayDecimal = decimal ? `${decimalSeparator}${decimal}` : '';
  }
}
