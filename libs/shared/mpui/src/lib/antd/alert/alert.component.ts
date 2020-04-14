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
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { slideAlertMotion } from '../core/animation';
import { MpConfigService, WithConfig } from '../core/config';
import { InputBoolean } from '../core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const NZ_CONFIG_COMPONENT_NAME = 'alert';

@Component({
  selector: 'mp-alert',
  exportAs: 'mpAlert',
  animations: [slideAlertMotion],
  template: `
    <div
      *ngIf="!closed"
      class="ant-alert"
      [class.ant-alert-success]="mpType === 'success'"
      [class.ant-alert-info]="mpType === 'info'"
      [class.ant-alert-warning]="mpType === 'warning'"
      [class.ant-alert-error]="mpType === 'error'"
      [class.ant-alert-no-icon]="!mpShowIcon"
      [class.ant-alert-banner]="mpBanner"
      [class.ant-alert-closable]="mpCloseable"
      [class.ant-alert-with-description]="!!mpDescription"
      [@slideAlertMotion]
      (@slideAlertMotion.done)="onFadeAnimationDone()"
    >
      <ng-container *ngIf="mpShowIcon">
        <i
          mp-icon
          class="ant-alert-icon"
          [mpType]="mpIconType || inferredIconType"
          [mpTheme]="iconTheme"
        ></i>
      </ng-container>
      <span class="ant-alert-message" *ngIf="mpMessage">
        <ng-container *mpStringTemplateOutlet="mpMessage">{{
          mpMessage
        }}</ng-container>
      </span>
      <span class="ant-alert-description" *ngIf="mpDescription">
        <ng-container *mpStringTemplateOutlet="mpDescription">{{
          mpDescription
        }}</ng-container>
      </span>
      <button
        type="button"
        tabindex="0"
        *ngIf="mpCloseable || mpCloseText"
        class="ant-alert-close-icon"
        (click)="closeAlert()"
      >
        <ng-template #closeDefaultTemplate>
          <i mp-icon mpType="close"></i>
        </ng-template>
        <ng-container *ngIf="mpCloseText; else closeDefaultTemplate">
          <ng-container *mpStringTemplateOutlet="mpCloseText">
            <span class="ant-alert-close-text">{{ mpCloseText }}</span>
          </ng-container>
        </ng-container>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class MpAlertComponent implements OnChanges, OnDestroy {
  @Input() mpCloseText: string | TemplateRef<void> | null = null;
  @Input() mpIconType: string | null = null;
  @Input() mpMessage: string | TemplateRef<void> | null = null;
  @Input() mpDescription: string | TemplateRef<void> | null = null;
  @Input() mpType: 'success' | 'info' | 'warning' | 'error' = 'info';
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  @InputBoolean()
  mpCloseable: boolean;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  @InputBoolean()
  mpShowIcon: boolean;
  @Input() @InputBoolean() mpBanner = false;
  @Output() readonly mpOnClose = new EventEmitter<boolean>();
  closed = false;
  iconTheme: 'outline' | 'fill' = 'fill';
  inferredIconType: string = 'info-circle';
  private isTypeSet = false;
  private isShowIconSet = false;
  private destroy$ = new Subject();

  constructor(
    public mpConfigService: MpConfigService,
    private cdr: ChangeDetectorRef
  ) {
    this.mpConfigService
      .getConfigChangeEventForComponent(NZ_CONFIG_COMPONENT_NAME)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  closeAlert(): void {
    this.closed = true;
  }

  onFadeAnimationDone(): void {
    if (this.closed) {
      this.mpOnClose.emit(true);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpShowIcon, mpDescription, mpType, mpBanner } = changes;
    if (mpShowIcon) {
      this.isShowIconSet = true;
    }
    if (mpType) {
      this.isTypeSet = true;
      switch (this.mpType) {
        case 'error':
          this.inferredIconType = 'close-circle';
          break;
        case 'success':
          this.inferredIconType = 'check-circle';
          break;
        case 'info':
          this.inferredIconType = 'info-circle';
          break;
        case 'warning':
          this.inferredIconType = 'exclamation-circle';
          break;
      }
    }
    if (mpDescription) {
      this.iconTheme = this.mpDescription ? 'outline' : 'fill';
    }
    if (mpBanner) {
      if (!this.isTypeSet) {
        this.mpType = 'warning';
      }
      if (!this.isShowIconSet) {
        this.mpShowIcon = true;
      }
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
