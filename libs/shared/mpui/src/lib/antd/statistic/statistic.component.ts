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
  Input,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MpStatisticValueType } from './typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-statistic',
  exportAs: 'mpStatistic',
  template: `
    <div class="ant-statistic">
      <div class="ant-statistic-title">
        <ng-container *mpStringTemplateOutlet="mpTitle">{{
          mpTitle
        }}</ng-container>
      </div>
      <div class="ant-statistic-content" [ngStyle]="mpValueStyle">
        <span *ngIf="mpPrefix" class="ant-statistic-content-prefix">
          <ng-container *mpStringTemplateOutlet="mpPrefix">{{
            mpPrefix
          }}</ng-container>
        </span>
        <mp-statistic-number
          [mpValue]="mpValue"
          [mpValueTemplate]="mpValueTemplate"
        >
        </mp-statistic-number>
        <span *ngIf="mpSuffix" class="ant-statistic-content-suffix">
          <ng-container *mpStringTemplateOutlet="mpSuffix">{{
            mpSuffix
          }}</ng-container>
        </span>
      </div>
    </div>
  `
})
export class MpStatisticComponent {
  @Input() mpPrefix: string | TemplateRef<void>;
  @Input() mpSuffix: string | TemplateRef<void>;
  @Input() mpTitle: string | TemplateRef<void>;
  @Input() mpValue: MpStatisticValueType;
  @Input() mpValueStyle = {};
  @Input() mpValueTemplate: TemplateRef<{ $implicit: MpStatisticValueType }>;
}
