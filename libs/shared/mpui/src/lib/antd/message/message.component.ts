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
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { moveUpMotion } from '../core/animation';

import { MpMessageDataFilled, MpMessageDataOptions } from './typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-message',
  exportAs: 'mpMessage',
  preserveWhitespaces: false,
  animations: [moveUpMotion],
  template: `
    <div
      class="ant-message-notice"
      [@moveUpMotion]="mpMessage.state"
      (mouseenter)="onEnter()"
      (mouseleave)="onLeave()"
    >
      <div class="ant-message-notice-content">
        <div
          class="ant-message-custom-content"
          [ngClass]="'ant-message-' + mpMessage.type"
        >
          <ng-container [ngSwitch]="mpMessage.type">
            <i *ngSwitchCase="'success'" mp-icon mpType="check-circle"></i>
            <i *ngSwitchCase="'info'" mp-icon mpType="info-circle"></i>
            <i
              *ngSwitchCase="'warning'"
              mp-icon
              mpType="exclamation-circle"
            ></i>
            <i *ngSwitchCase="'error'" mp-icon mpType="close-circle"></i>
            <i *ngSwitchCase="'loading'" mp-icon mpType="loading"></i>
          </ng-container>
          <ng-container *mpStringTemplateOutlet="mpMessage.content">
            <span [innerHTML]="mpMessage.content"></span>
          </ng-container>
        </div>
      </div>
    </div>
  `
})
export class MpMessageComponent implements OnInit, OnDestroy {
  @Input() mpMessage: MpMessageDataFilled;
  @Input() mpIndex: number;
  @Output() readonly messageDestroy = new EventEmitter<{
    id: string;
    userAction: boolean;
  }>();

  protected options: Required<MpMessageDataOptions>;

  // Whether to set a timeout to destroy itself.
  private autoClose: boolean;

  private eraseTimer: number | null = null;
  private eraseTimingStart: number;
  private eraseTTL: number; // Time to live.

  constructor(protected cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // `MpMessageContainer` does its job so all properties cannot be undefined.
    this.options = this.mpMessage.options as Required<MpMessageDataOptions>;

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
}
