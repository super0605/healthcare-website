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
  OnChanges,
  OnInit,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MpBreakpointKey } from '../core/services';

@Component({
  selector: '[mp-sider-trigger]',
  exportAs: 'mpSiderTrigger',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="isZeroTrigger">
      <ng-template
        [ngTemplateOutlet]="mpZeroTrigger || defaultZeroTrigger"
      ></ng-template>
    </ng-container>
    <ng-container *ngIf="isNormalTrigger">
      <ng-template
        [ngTemplateOutlet]="mpTrigger || defaultTrigger"
      ></ng-template>
    </ng-container>
    <ng-template #defaultTrigger>
      <i
        mp-icon
        [mpType]="mpCollapsed ? 'right' : 'left'"
        *ngIf="!mpReverseArrow"
      ></i>
      <i
        mp-icon
        [mpType]="mpCollapsed ? 'left' : 'right'"
        *ngIf="mpReverseArrow"
      ></i>
    </ng-template>
    <ng-template #defaultZeroTrigger>
      <i mp-icon mpType="bars"></i>
    </ng-template>
  `,
  host: {
    '[class.ant-layout-sider-trigger]': 'isNormalTrigger',
    '[style.width]': 'isNormalTrigger ? siderWidth : null',
    '[class.ant-layout-sider-zero-width-trigger]': 'isZeroTrigger',
    '[class.ant-layout-sider-zero-width-trigger-right]':
      'isZeroTrigger && mpReverseArrow',
    '[class.ant-layout-sider-zero-width-trigger-left]':
      'isZeroTrigger && !mpReverseArrow'
  }
})
export class MpSiderTriggerComponent implements OnChanges, OnInit {
  @Input() mpCollapsed = false;
  @Input() mpReverseArrow = false;
  @Input() mpZeroTrigger: TemplateRef<void> | null = null;
  @Input() mpTrigger: TemplateRef<void> | undefined | null = undefined;
  @Input() matchBreakPoint = false;
  @Input() mpCollapsedWidth: number | null = null;
  @Input() siderWidth: string | null = null;
  @Input() mpBreakpoint: MpBreakpointKey | null = null;
  isZeroTrigger = false;
  isNormalTrigger = false;
  updateTriggerType(): void {
    this.isZeroTrigger =
      this.mpCollapsedWidth === 0 &&
      ((this.mpBreakpoint && this.matchBreakPoint) || !this.mpBreakpoint);
    this.isNormalTrigger = this.mpCollapsedWidth !== 0;
  }
  ngOnInit(): void {
    this.updateTriggerType();
  }
  ngOnChanges(): void {
    this.updateTriggerType();
  }
}
