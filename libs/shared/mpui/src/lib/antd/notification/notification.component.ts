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
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { notificationMotion } from '../core/animation';
import { MpNotificationDataFilled, MpNotificationDataOptions } from './typings';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-notification',
  exportAs: 'mpNotification',
  preserveWhitespaces: false,
  animations: [notificationMotion],
  template: `
    <div
      class="ant-notification-notice ant-notification-notice-closable"
      [ngStyle]="mpMessage.options?.mpStyle"
      [ngClass]="mpMessage.options?.mpClass"
      [@notificationMotion]="state"
      (mouseenter)="onEnter()"
      (mouseleave)="onLeave()"
    >
      <div *ngIf="!mpMessage.template" class="ant-notification-notice-content">
        <div
          class="ant-notification-notice-content"
          [ngClass]="{
            'ant-notification-notice-with-icon': mpMessage.type !== 'blank'
          }"
        >
          <div
            [class.ant-notification-notice-with-icon]="
              mpMessage.type !== 'blank'
            "
          >
            <ng-container [ngSwitch]="mpMessage.type">
              <i
                *ngSwitchCase="'success'"
                mp-icon
                mpType="check-circle"
                class="ant-notification-notice-icon ant-notification-notice-icon-success"
              ></i>
              <i
                *ngSwitchCase="'info'"
                mp-icon
                mpType="info-circle"
                class="ant-notification-notice-icon ant-notification-notice-icon-info"
              ></i>
              <i
                *ngSwitchCase="'warning'"
                mp-icon
                mpType="exclamation-circle"
                class="ant-notification-notice-icon ant-notification-notice-icon-warning"
              ></i>
              <i
                *ngSwitchCase="'error'"
                mp-icon
                mpType="close-circle"
                class="ant-notification-notice-icon ant-notification-notice-icon-error"
              ></i>
            </ng-container>
            <div
              class="ant-notification-notice-message"
              [innerHTML]="mpMessage.title"
            ></div>
            <div
              class="ant-notification-notice-description"
              [innerHTML]="mpMessage.content"
            ></div>
          </div>
        </div>
      </div>
      <ng-template
        [ngIf]="mpMessage.template"
        [ngTemplateOutlet]="mpMessage.template"
        [ngTemplateOutletContext]="{ $implicit: this, data: mpMessage.options?.mpData }"
      >
      </ng-template>
      <a tabindex="0" class="ant-notification-notice-close" (click)="close()">
        <span class="ant-notification-notice-close-x">
          <ng-container *ngIf="mpMessage.options?.mpCloseIcon; else iconTpl">
            <ng-container
              *mpStringTemplateOutlet="mpMessage.options?.mpCloseIcon"
            >
              <i mp-icon [mpType]="mpMessage.options?.mpCloseIcon"></i>
            </ng-container>
          </ng-container>
          <ng-template #iconTpl>
            <i mp-icon mpType="close" class="ant-notification-close-icon"></i>
          </ng-template>
        </span>
      </a>
    </div>
  `
})
export class MpNotificationComponent implements OnInit, OnDestroy {
  @Input() mpMessage: MpNotificationDataFilled;
  @Input() mpIndex: number;
  @Input() mpPlacement: string;
  @Output() readonly messageDestroy = new EventEmitter<{
    id: string;
    userAction: boolean;
  }>();

  protected options: Required<MpNotificationDataOptions>;

  // Whether to set a timeout to destroy itself.
  private autoClose: boolean;

  private eraseTimer: number | null = null;
  private eraseTimingStart: number;
  private eraseTTL: number; // Time to live.

  constructor(protected cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // `MpMessageContainer` does its job so all properties cannot be undefined.
    this.options = this.mpMessage.options as Required<
      MpNotificationDataOptions
    >;

    if (this.options.mpAnimate) {
      this.mpMessage.state = 'enter';
    }

    this.autoClose = this.options.mpDuration > 0;

    if (this.autoClose) {
      this.initErase();
      this.startEraseTimeout();
    }
  }

  ngOnDestroy(): void {
    if (this.autoClose) {
      this.clearEraseTimeout();
    }
  }

  onEnter(): void {
    if (this.autoClose && this.options.mpPauseOnHover) {
      this.clearEraseTimeout();
      this.updateTTL();
    }
  }

  onLeave(): void {
    if (this.autoClose && this.options.mpPauseOnHover) {
      this.startEraseTimeout();
    }
  }

  // Remove self
  protected destroy(userAction: boolean = false): void {
    if (this.options.mpAnimate) {
      this.mpMessage.state = 'leave';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.messageDestroy.next({
          id: this.mpMessage.messageId,
          userAction: userAction
        });
      }, 200);
    } else {
      this.messageDestroy.next({
        id: this.mpMessage.messageId,
        userAction: userAction
      });
    }
  }

  private initErase(): void {
    this.eraseTTL = this.options.mpDuration;
    this.eraseTimingStart = Date.now();
  }

  private updateTTL(): void {
    if (this.autoClose) {
      this.eraseTTL -= Date.now() - this.eraseTimingStart;
    }
  }

  private startEraseTimeout(): void {
    if (this.eraseTTL > 0) {
      this.clearEraseTimeout();
      this.eraseTimer = setTimeout(() => this.destroy(), this.eraseTTL);
      this.eraseTimingStart = Date.now();
    } else {
      this.destroy();
    }
  }

  private clearEraseTimeout(): void {
    if (this.eraseTimer !== null) {
      clearTimeout(this.eraseTimer);
      this.eraseTimer = null;
    }
  }

  close(): void {
    this.destroy(true);
  }

  get state(): string | undefined {
    if (this.mpMessage.state === 'enter') {
      if (this.mpPlacement === 'topLeft' || this.mpPlacement === 'bottomLeft') {
        return 'enterLeft';
      } else {
        return 'enterRight';
      }
    } else {
      return this.mpMessage.state;
    }
  }
}
