/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { toBoolean } from '../core/util';
import { merge, Subject, Subscription } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { NgClassType, MpSizeDSType } from '../core/types';

import { MpStepComponent } from './step.component';

export type MpDirectionType = 'horizontal' | 'vertical';
export type MpStatusType = 'wait' | 'process' | 'finish' | 'error';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  selector: 'mp-steps',
  exportAs: 'mpSteps',
  template: `
    <div class="ant-steps" [ngClass]="classMap">
      <ng-content></ng-content>
    </div>
  `
})
export class MpStepsComponent
  implements OnChanges, OnInit, OnDestroy, AfterContentInit {
  @ContentChildren(MpStepComponent) steps: QueryList<MpStepComponent>;

  @Input() mpCurrent = 0;
  @Input() mpDirection: MpDirectionType = 'horizontal';
  @Input() mpLabelPlacement: 'horizontal' | 'vertical' = 'horizontal';
  @Input() mpType: 'default' | 'navigation' = 'default';
  @Input() mpSize: MpSizeDSType = 'default';
  @Input() mpStartIndex = 0;
  @Input() mpStatus: MpStatusType = 'process';

  @Input()
  set mpProgressDot(
    value:
      | boolean
      | TemplateRef<{
          $implicit: TemplateRef<void>;
          status: string;
          index: number;
        }>
  ) {
    if (value instanceof TemplateRef) {
      this.showProcessDot = true;
      this.customProcessDotTemplate = value;
    } else {
      this.showProcessDot = toBoolean(value);
    }
    this.updateChildrenSteps();
  }

  @Output() readonly mpIndexChange = new EventEmitter<number>();

  private destroy$ = new Subject<void>();
  private indexChangeSubscription: Subscription;

  showProcessDot = false;
  customProcessDotTemplate: TemplateRef<{
    $implicit: TemplateRef<void>;
    status: string;
    index: number;
  }>;
  classMap: NgClassType;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.mpStartIndex ||
      changes.mpDirection ||
      changes.mpStatus ||
      changes.mpCurrent
    ) {
      this.updateChildrenSteps();
    }
    if (
      changes.mpDirection ||
      changes.mpProgressDot ||
      changes.mpLabelPlacement ||
      changes.mpSize
    ) {
      this.setClassMap();
    }
  }

  ngOnInit(): void {
    this.setClassMap();
    this.updateChildrenSteps();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.indexChangeSubscription) {
      this.indexChangeSubscription.unsubscribe();
    }
  }

  ngAfterContentInit(): void {
    if (this.steps) {
      this.steps.changes
        .pipe(
          startWith(null),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.updateChildrenSteps();
        });
    }
  }

  private updateChildrenSteps(): void {
    if (this.steps) {
      const length = this.steps.length;
      this.steps.toArray().forEach((step, index) => {
        Promise.resolve().then(() => {
          step.outStatus = this.mpStatus;
          step.showProcessDot = this.showProcessDot;
          if (this.customProcessDotTemplate) {
            step.customProcessTemplate = this.customProcessDotTemplate;
          }
          step.clickable = this.mpIndexChange.observers.length > 0;
          step.direction = this.mpDirection;
          step.index = index + this.mpStartIndex;
          step.currentIndex = this.mpCurrent;
          step.last = length === index + 1;
          step.markForCheck();
        });
      });
      if (this.indexChangeSubscription) {
        this.indexChangeSubscription.unsubscribe();
      }
      this.indexChangeSubscription = merge(
        ...this.steps.map(step => step.click$)
      ).subscribe(index => this.mpIndexChange.emit(index));
    }
  }

  private setClassMap(): void {
    this.classMap = {
      [`ant-steps-${this.mpDirection}`]: true,
      [`ant-steps-label-horizontal`]: this.mpDirection === 'horizontal',
      [`ant-steps-label-vertical`]:
        (this.showProcessDot || this.mpLabelPlacement === 'vertical') &&
        this.mpDirection === 'horizontal',
      [`ant-steps-dot`]: this.showProcessDot,
      ['ant-steps-small']: this.mpSize === 'small',
      ['ant-steps-navigation']: this.mpType === 'navigation'
    };
  }
}
