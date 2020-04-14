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
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NgClassType } from '../core/types';
import { InputBoolean } from '../core/util';

import { Subject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-step',
  exportAs: 'mpStep',
  preserveWhitespaces: false,
  template: `
    <div
      class="ant-steps-item-container"
      [attr.role]="clickable && !mpDisabled ? 'button' : null"
      [tabindex]="clickable && !mpDisabled ? 0 : null"
      (click)="onClick()"
    >
      <div class="ant-steps-item-tail" *ngIf="last !== true"></div>
      <div class="ant-steps-item-icon">
        <ng-template [ngIf]="!showProcessDot">
          <span class="ant-steps-icon" *ngIf="mpStatus === 'finish' && !mpIcon"
            ><i mp-icon mpType="check"></i
          ></span>
          <span class="ant-steps-icon" *ngIf="mpStatus === 'error'"
            ><i mp-icon mpType="close"></i
          ></span>
          <span
            class="ant-steps-icon"
            *ngIf="(mpStatus === 'process' || mpStatus === 'wait') && !mpIcon"
            >{{ index + 1 }}</span
          >
          <span class="ant-steps-icon" *ngIf="mpIcon">
            <ng-container *ngIf="isIconString; else iconTemplate">
              <i
                mp-icon
                [mpType]="!oldAPIIcon && mpIcon"
                [ngClass]="oldAPIIcon && mpIcon"
              ></i>
            </ng-container>
            <ng-template #iconTemplate>
              <ng-template [ngTemplateOutlet]="mpIcon"></ng-template>
            </ng-template>
          </span>
        </ng-template>
        <ng-template [ngIf]="showProcessDot">
          <span class="ant-steps-icon">
            <ng-template #processDotTemplate>
              <span class="ant-steps-icon-dot"></span>
            </ng-template>
            <ng-template
              [ngTemplateOutlet]="customProcessTemplate || processDotTemplate"
              [ngTemplateOutletContext]="{
                $implicit: processDotTemplate,
                status: mpStatus,
                index: index
              }"
            >
            </ng-template>
          </span>
        </ng-template>
      </div>
      <div class="ant-steps-item-content">
        <div class="ant-steps-item-title">
          <ng-container *mpStringTemplateOutlet="mpTitle">{{
            mpTitle
          }}</ng-container>
          <div *ngIf="mpSubtitle" class="ant-steps-item-subtitle">
            <ng-container *mpStringTemplateOutlet="mpSubtitle">{{
              mpSubtitle
            }}</ng-container>
          </div>
        </div>
        <div class="ant-steps-item-description">
          <ng-container *mpStringTemplateOutlet="mpDescription">{{
            mpDescription
          }}</ng-container>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'ant-steps-item',
    '[class.ant-steps-item-wait]': 'mpStatus === "wait"',
    '[class.ant-steps-item-process]': 'mpStatus === "process"',
    '[class.ant-steps-item-finish]': 'mpStatus === "finish"',
    '[class.ant-steps-item-error]': 'mpStatus === "error"',
    '[class.ant-steps-item-active]': 'currentIndex === index',
    '[class.ant-steps-item-disabled]': 'mpDisabled',
    '[class.ant-steps-item-custom]': '!!mpIcon',
    '[class.ant-steps-next-error]':
      '(outStatus === "error") && (currentIndex === index + 1)'
  }
})
export class MpStepComponent implements OnDestroy {
  @ViewChild('processDotTemplate', { static: false })
  processDotTemplate: TemplateRef<void>;

  @Input() mpTitle: string | TemplateRef<void>;
  @Input() mpSubtitle: string | TemplateRef<void>;
  @Input() mpDescription: string | TemplateRef<void>;
  @Input() @InputBoolean() mpDisabled = false;

  @Input()
  get mpStatus(): string {
    return this._status;
  }

  set mpStatus(status: string) {
    this._status = status;
    this.isCustomStatus = true;
  }

  isCustomStatus = false;
  private _status = 'wait';

  @Input()
  get mpIcon(): NgClassType | TemplateRef<void> {
    return this._icon;
  }

  set mpIcon(value: NgClassType | TemplateRef<void>) {
    if (!(value instanceof TemplateRef)) {
      this.isIconString = true;
      this.oldAPIIcon =
        typeof value === 'string' && value.indexOf('anticon') > -1;
    } else {
      this.isIconString = false;
    }
    this._icon = value;
  }

  oldAPIIcon = true;
  isIconString = true;
  private _icon: NgClassType | TemplateRef<void>;

  customProcessTemplate: TemplateRef<{
    $implicit: TemplateRef<void>;
    status: string;
    index: number;
  }>; // Set by parent.
  direction = 'horizontal';
  index = 0;
  last = false;
  outStatus = 'process';
  showProcessDot = false;
  clickable = false;
  click$ = new Subject<number>();

  get currentIndex(): number {
    return this._currentIndex;
  }

  set currentIndex(current: number) {
    this._currentIndex = current;
    if (!this.isCustomStatus) {
      this._status =
        current > this.index
          ? 'finish'
          : current === this.index
          ? this.outStatus || ''
          : 'wait';
    }
  }

  private _currentIndex = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  onClick(): void {
    if (
      this.clickable &&
      this.currentIndex !== this.index &&
      !this.mpDisabled
    ) {
      this.click$.next(this.index);
    }
  }

  markForCheck(): void {
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.click$.complete();
  }
}
