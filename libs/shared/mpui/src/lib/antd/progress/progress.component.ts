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
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { MpConfigService, WithConfig } from '../core/config';
import { NgStyleInterface } from '../core/types';
import { InputNumber, isNotNil } from '../core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  MpProgressCirclePath,
  MpProgressColorGradient,
  MpProgressFormatter,
  MpProgressGapPositionType,
  MpProgressGradientProgress,
  MpProgressStatusType,
  MpProgressStepItem,
  MpProgressStrokeColorType,
  MpProgressStrokeLinecapType,
  MpProgressTypeType
} from './typings';
import { handleCircleGradient, handleLinearGradient } from './utils';

let gradientIdSeed = 0;

const NZ_CONFIG_COMPONENT_NAME = 'progress';
const statusIconNameMap = new Map([
  ['success', 'check'],
  ['exception', 'close']
]);
const statusColorMap = new Map([
  ['normal', '#108ee9'],
  ['exception', '#ff5500'],
  ['success', '#87d068']
]);
const defaultFormatter: MpProgressFormatter = (p: number): string => `${p}%`;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-progress',
  exportAs: 'mpProgress',
  preserveWhitespaces: false,
  template: `
    <ng-template #progressInfoTemplate>
      <span class="ant-progress-text" *ngIf="mpShowInfo">
        <ng-container
          *ngIf="
            status === 'exception' || (status === 'success' && !mpFormat);
            else formatTemplate
          "
        >
          <i mp-icon [mpType]="icon"></i>
        </ng-container>
        <ng-template #formatTemplate>
          <ng-container
            *mpStringTemplateOutlet="
              formatter;
              context: { $implicit: mpPercent }
            "
          >
            {{ $any(formatter)(mpPercent) }}
          </ng-container>
        </ng-template>
      </span>
    </ng-template>

    <div
      [ngClass]="'ant-progress ant-progress-status-' + status"
      [class.ant-progress-line]="mpType == 'line'"
      [class.ant-progress-small]="mpSize == 'small'"
      [class.ant-progress-show-info]="mpShowInfo"
      [class.ant-progress-circle]="isCircleStyle"
      [class.ant-progress-steps]="isSteps"
    >
      <!-- line progress -->
      <div *ngIf="mpType === 'line'">
        <ng-container *ngIf="!isSteps">
          <div class="ant-progress-outer" *ngIf="!isSteps">
            <div class="ant-progress-inner">
              <div
                class="ant-progress-bg"
                [style.width.%]="mpPercent"
                [style.border-radius]="
                  mpStrokeLinecap === 'round' ? '100px' : '0'
                "
                [style.background]="!isGradient ? mpStrokeColor : null"
                [style.background-image]="isGradient ? lineGradient : null"
                [style.height.px]="strokeWidth"
              ></div>
              <div
                *ngIf="mpSuccessPercent || mpSuccessPercent === 0"
                class="ant-progress-success-bg"
                [style.width.%]="mpSuccessPercent"
                [style.border-radius]="
                  mpStrokeLinecap === 'round' ? '100px' : '0'
                "
                [style.height.px]="strokeWidth"
              ></div>
            </div>
          </div>
          <ng-template [ngTemplateOutlet]="progressInfoTemplate"></ng-template>
        </ng-container>
        <!-- Step style progress -->
        <div class="ant-progress-steps-outer" *ngIf="isSteps">
          <div
            *ngFor="let step of steps; let i = index"
            class="ant-progress-steps-item"
            [ngStyle]="step"
          ></div>
          <ng-template [ngTemplateOutlet]="progressInfoTemplate"></ng-template>
        </div>
      </div>

      <!-- circle / dashboard progress -->
      <div
        [style.width.px]="this.mpWidth"
        [style.height.px]="this.mpWidth"
        [style.fontSize.px]="this.mpWidth * 0.15 + 6"
        class="ant-progress-inner"
        [class.ant-progress-circle-gradient]="isGradient"
        *ngIf="isCircleStyle"
      >
        <svg class="ant-progress-circle " viewBox="0 0 100 100">
          <defs *ngIf="isGradient">
            <linearGradient
              [id]="'gradient-' + gradientId"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="0%"
            >
              <stop
                *ngFor="let i of circleGradient"
                [attr.offset]="i.offset"
                [attr.stop-color]="i.color"
              ></stop>
            </linearGradient>
          </defs>
          <path
            class="ant-progress-circle-trail"
            stroke="#f3f3f3"
            fill-opacity="0"
            [attr.stroke-width]="strokeWidth"
            [attr.d]="pathString"
            [ngStyle]="trailPathStyle"
          ></path>
          <path
            *ngFor="let p of progressCirclePath; trackBy: trackByFn"
            class="ant-progress-circle-path"
            fill-opacity="0"
            [attr.d]="pathString"
            [attr.stroke-linecap]="mpStrokeLinecap"
            [attr.stroke]="p.stroke"
            [attr.stroke-width]="mpPercent ? strokeWidth : 0"
            [ngStyle]="p.strokePathStyle"
          ></path>
        </svg>
        <ng-template [ngTemplateOutlet]="progressInfoTemplate"></ng-template>
      </div>
    </div>
  `
})
export class MpProgressComponent implements OnChanges, OnInit, OnDestroy {
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME, true) mpShowInfo: boolean;
  @Input() mpWidth = 132;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME)
  mpStrokeColor: MpProgressStrokeColorType;
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'default') mpSize:
    | 'default'
    | 'small';
  @Input() mpFormat?: MpProgressFormatter;
  @Input() @InputNumber() mpSuccessPercent?: number;
  @Input() @InputNumber() mpPercent: number = 0;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME)
  @InputNumber()
  mpStrokeWidth: number;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME)
  @InputNumber()
  mpGapDegree: number;
  @Input() mpStatus: MpProgressStatusType;
  @Input() mpType: MpProgressTypeType = 'line';
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'top')
  mpGapPosition: MpProgressGapPositionType;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'round')
  mpStrokeLinecap: MpProgressStrokeLinecapType;

  @Input() @InputNumber() mpSteps?: number;

  steps: MpProgressStepItem[] = [];

  /** Gradient style when `mpType` is `line`. */
  lineGradient: string | null = null;

  /** If user uses gradient color. */
  isGradient = false;

  /** If the linear progress is a step progress. */
  isSteps = false;

  /**
   * Each progress whose `mpType` is circle or dashboard should have unique id to
   * define `<linearGradient>`.
   */
  gradientId = gradientIdSeed++;

  /** Paths to rendered in the template. */
  progressCirclePath: MpProgressCirclePath[] = [];

  circleGradient: Array<{ offset: string; color: string }>;

  trailPathStyle: NgStyleInterface;

  pathString: string;

  icon: string;

  trackByFn = (index: number) => `${index}`;

  get formatter(): MpProgressFormatter {
    return this.mpFormat || defaultFormatter;
  }

  get status(): MpProgressStatusType {
    return this.mpStatus || this.inferredStatus;
  }

  get strokeWidth(): number {
    return (
      this.mpStrokeWidth ||
      (this.mpType === 'line' && this.mpSize !== 'small' ? 8 : 6)
    );
  }

  get isCircleStyle(): boolean {
    return this.mpType === 'circle' || this.mpType === 'dashboard';
  }

  private cachedStatus: MpProgressStatusType = 'normal';
  private inferredStatus: MpProgressStatusType = 'normal';
  private destroy$ = new Subject<void>();

  constructor(public mpConfigService: MpConfigService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const {
      mpSteps,
      mpGapPosition,
      mpStrokeLinecap,
      mpStrokeColor,
      mpGapDegree,
      mpType,
      mpStatus,
      mpPercent,
      mpSuccessPercent
    } = changes;

    if (mpStatus) {
      this.cachedStatus = this.mpStatus || this.cachedStatus;
    }

    if (mpPercent || mpSuccessPercent) {
      const fillAll = parseInt(this.mpPercent.toString(), 10) >= 100;
      if (fillAll) {
        if (
          (isNotNil(this.mpSuccessPercent) && this.mpSuccessPercent! >= 100) ||
          this.mpSuccessPercent === undefined
        ) {
          this.inferredStatus = 'success';
        }
      } else {
        this.inferredStatus = this.cachedStatus;
      }
    }

    if (mpStatus || mpPercent || mpSuccessPercent) {
      this.updateIcon();
    }

    if (mpStrokeColor) {
      this.setStrokeColor();
    }

    if (
      mpGapPosition ||
      mpStrokeLinecap ||
      mpGapDegree ||
      mpType ||
      mpPercent ||
      mpStrokeColor
    ) {
      this.getCirclePaths();
    }

    if (mpSteps) {
      this.isSteps = isNotNil(mpSteps.currentValue);
      this.getSteps();
    }
  }

  ngOnInit(): void {
    this.mpConfigService
      .getConfigChangeEventForComponent(NZ_CONFIG_COMPONENT_NAME)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateIcon();
        this.setStrokeColor();
        this.getCirclePaths();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateIcon(): void {
    const ret = statusIconNameMap.get(this.status);
    this.icon = ret ? ret + (this.isCircleStyle ? '-o' : '-circle-fill') : '';
  }

  /**
   * Calculate step render configs.
   */
  private getSteps(): void {
    const current = Math.floor(this.mpSteps! * (this.mpPercent / 100));
    const stepWidth = this.mpSize === 'small' ? 2 : 14;

    for (let i = 0; i < this.mpSteps!; i++) {
      let color;
      if (i <= current - 1) {
        color = this.mpStrokeColor;
      }
      const stepStyle = {
        backgroundColor: `${color}`,
        width: `${stepWidth}px`,
        height: `${this.strokeWidth}px`
      };
      this.steps.push(stepStyle);
    }
  }

  /**
   * Calculate paths when the type is circle or dashboard.
   */
  private getCirclePaths(): void {
    if (!this.isCircleStyle) {
      return;
    }

    const values = isNotNil(this.mpSuccessPercent)
      ? [this.mpSuccessPercent!, this.mpPercent]
      : [this.mpPercent];

    // Calculate shared styles.
    const radius = 50 - this.strokeWidth / 2;
    const gapPosition =
      this.mpGapPosition || (this.mpType === 'circle' ? 'top' : 'bottom');
    const len = Math.PI * 2 * radius;
    const gapDegree = this.mpGapDegree || (this.mpType === 'circle' ? 0 : 75);

    let beginPositionX = 0;
    let beginPositionY = -radius;
    let endPositionX = 0;
    let endPositionY = radius * -2;

    switch (gapPosition) {
      case 'left':
        beginPositionX = -radius;
        beginPositionY = 0;
        endPositionX = radius * 2;
        endPositionY = 0;
        break;
      case 'right':
        beginPositionX = radius;
        beginPositionY = 0;
        endPositionX = radius * -2;
        endPositionY = 0;
        break;
      case 'bottom':
        beginPositionY = radius;
        endPositionY = radius * 2;
        break;
      default:
    }

    this.pathString = `M 50,50 m ${beginPositionX},${beginPositionY}
       a ${radius},${radius} 0 1 1 ${endPositionX},${-endPositionY}
       a ${radius},${radius} 0 1 1 ${-endPositionX},${endPositionY}`;

    this.trailPathStyle = {
      strokeDasharray: `${len - gapDegree}px ${len}px`,
      strokeDashoffset: `-${gapDegree / 2}px`,
      transition:
        'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s'
    };

    // Calculate styles for each path.
    this.progressCirclePath = values
      .map((value, index) => {
        const isSuccessPercent = values.length === 2 && index === 0;
        return {
          stroke:
            this.isGradient && !isSuccessPercent
              ? `url(#gradient-${this.gradientId})`
              : null,
          strokePathStyle: {
            stroke: !this.isGradient
              ? isSuccessPercent
                ? statusColorMap.get('success')
                : (this.mpStrokeColor as string)
              : null,
            transition:
              'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s',
            strokeDasharray: `${((value || 0) / 100) *
              (len - gapDegree)}px ${len}px`,
            strokeDashoffset: `-${gapDegree / 2}px`
          }
        };
      })
      .reverse();
  }

  private setStrokeColor(): void {
    const color = this.mpStrokeColor;
    const isGradient = (this.isGradient = !!color && typeof color !== 'string');
    if (isGradient && !this.isCircleStyle) {
      this.lineGradient = handleLinearGradient(
        color as MpProgressColorGradient
      );
    } else if (isGradient && this.isCircleStyle) {
      this.circleGradient = handleCircleGradient(this
        .mpStrokeColor as MpProgressGradientProgress);
    } else {
      this.lineGradient = null;
      this.circleGradient = [];
    }
  }
}
