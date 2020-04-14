/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MpConfigService, WithConfig } from '../core/config';
import { MpSizeLDSType } from '../core/types';
import { InputBoolean, InputNumber } from '../core/util';

import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, flatMap, takeUntil } from 'rxjs/operators';

const NZ_CONFIG_COMPONENT_NAME = 'spin';

@Component({
  selector: 'mp-spin',
  exportAs: 'mpSpin',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #defaultTemplate>
      <span class="ant-spin-dot ant-spin-dot-spin">
        <i class="ant-spin-dot-item"></i>
        <i class="ant-spin-dot-item"></i>
        <i class="ant-spin-dot-item"></i>
        <i class="ant-spin-dot-item"></i>
      </span>
    </ng-template>
    <div *ngIf="isLoading">
      <div
        class="ant-spin"
        [class.ant-spin-spinning]="isLoading"
        [class.ant-spin-lg]="mpSize === 'large'"
        [class.ant-spin-sm]="mpSize === 'small'"
        [class.ant-spin-show-text]="mpTip"
      >
        <ng-template
          [ngTemplateOutlet]="mpIndicator || defaultTemplate"
        ></ng-template>
        <div class="ant-spin-text" *ngIf="mpTip">{{ mpTip }}</div>
      </div>
    </div>
    <div
      *ngIf="!mpSimple"
      class="ant-spin-container"
      [class.ant-spin-blur]="isLoading"
    >
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[class.ant-spin-nested-loading]': '!mpSimple'
  }
})
export class MpSpinComponent implements OnChanges, OnDestroy, OnInit {
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME) mpIndicator: TemplateRef<void>;
  @Input() mpSize: MpSizeLDSType = 'default';
  @Input() mpTip: string | null = null;
  @Input() @InputNumber() mpDelay = 0;
  @Input() @InputBoolean() mpSimple = false;
  @Input() @InputBoolean() mpSpinning = true;
  private destroy$ = new Subject<void>();
  private spinning$ = new BehaviorSubject(this.mpSpinning);
  private delay$ = new BehaviorSubject(this.mpDelay);
  isLoading = true;

  constructor(
    public mpConfigService: MpConfigService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const loading$ = this.spinning$.pipe(
      flatMap(() => this.delay$),
      flatMap(delay => {
        if (delay === 0) {
          return this.spinning$;
        } else {
          return this.spinning$.pipe(debounceTime(delay));
        }
      }),
      takeUntil(this.destroy$)
    );
    loading$.subscribe(loading => {
      this.isLoading = loading;
      this.cdr.markForCheck();
    });
    this.mpConfigService
      .getConfigChangeEventForComponent(NZ_CONFIG_COMPONENT_NAME)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.cdr.markForCheck());
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpSpinning, mpDelay } = changes;
    if (mpSpinning) {
      this.spinning$.next(this.mpSpinning);
    }
    if (mpDelay) {
      this.delay$.next(this.mpDelay);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
