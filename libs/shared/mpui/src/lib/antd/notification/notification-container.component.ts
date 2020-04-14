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
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { NotificationConfig, MpConfigService } from '../core/config';
import { toCssPixel } from '../core/util';

import { Subject } from 'rxjs';
import { MpNotificationDataFilled, MpNotificationDataOptions } from './typings';

const NZ_CONFIG_COMPONENT_NAME = 'notification';
const NZ_NOTIFICATION_DEFAULT_CONFIG: Required<NotificationConfig> = {
  mpTop: '24px',
  mpBottom: '24px',
  mpPlacement: 'topRight',
  mpDuration: 4500,
  mpMaxStack: 7,
  mpPauseOnHover: true,
  mpAnimate: true
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-notification-container',
  exportAs: 'mpNotificationContainer',
  preserveWhitespaces: false,
  template: `
    <div
      class="ant-notification ant-notification-topLeft"
      [style.top]="top"
      [style.left]="'0px'"
    >
      <mp-notification
        *ngFor="let message of topLeftMessages"
        [mpMessage]="message"
        [mpPlacement]="config.mpPlacement"
        (messageDestroy)="removeMessage($event.id, $event.userAction)"
      ></mp-notification>
    </div>
    <div
      class="ant-notification ant-notification-topRight"
      [style.top]="top"
      [style.right]="'0px'"
    >
      <mp-notification
        *ngFor="let message of topRightMessages"
        [mpMessage]="message"
        [mpPlacement]="config.mpPlacement"
        (messageDestroy)="removeMessage($event.id, $event.userAction)"
      ></mp-notification>
    </div>
    <div
      class="ant-notification ant-notification-bottomLeft"
      [style.bottom]="bottom"
      [style.left]="'0px'"
    >
      <mp-notification
        *ngFor="let message of bottomLeftMessages"
        [mpMessage]="message"
        [mpPlacement]="config.mpPlacement"
        (messageDestroy)="removeMessage($event.id, $event.userAction)"
      ></mp-notification>
    </div>
    <div
      class="ant-notification ant-notification-bottomRight"
      [style.bottom]="bottom"
      [style.right]="'0px'"
    >
      <mp-notification
        *ngFor="let message of bottomRightMessages"
        [mpMessage]="message"
        [mpPlacement]="config.mpPlacement"
        (messageDestroy)="removeMessage($event.id, $event.userAction)"
      ></mp-notification>
    </div>
  `
})
export class MpNotificationContainerComponent implements OnInit, OnDestroy {
  config: Required<NotificationConfig>;
  bottom: string | null;
  messages: Array<Required<MpNotificationDataFilled>> = [];

  constructor(
    protected cdr: ChangeDetectorRef,
    protected mpConfigService: MpConfigService
  ) {
    this.updateConfig();
  }

  get topLeftMessages(): Array<Required<MpNotificationDataFilled>> {
    return this.messages.filter(m => m.options.mpPosition === 'topLeft');
  }

  get topRightMessages(): Array<Required<MpNotificationDataFilled>> {
    return this.messages.filter(
      m => m.options.mpPosition === 'topRight' || !m.options.mpPosition
    );
  }

  get bottomLeftMessages(): Array<Required<MpNotificationDataFilled>> {
    return this.messages.filter(m => m.options.mpPosition === 'bottomLeft');
  }

  get bottomRightMessages(): Array<Required<MpNotificationDataFilled>> {
    return this.messages.filter(m => m.options.mpPosition === 'bottomRight');
  }

  /**
   * Create a new notification.
   * If there's a notification whose `mpKey` is same with `mpKey` in `MpNotificationDataFilled`,
   * replace its content instead of create a new one.
   * @override
   * @param notification
   */
  createMessage(notification: MpNotificationDataFilled): void {
    notification.options = this.mergeMessageOptions(notification.options);
    notification.onClose = new Subject<boolean>();
    const key = notification.options.mpKey;
    const notificationWithSameKey = this.messages.find(
      msg =>
        msg.options.mpKey ===
        (notification.options as Required<MpNotificationDataOptions>).mpKey
    );

    if (key && notificationWithSameKey) {
      this.replaceNotification(notificationWithSameKey, notification);
    } else {
      if (this.messages.length >= this.config.mpMaxStack) {
        this.messages.splice(0, 1);
      }
      this.messages.push(notification as Required<MpNotificationDataFilled>);
    }
    this.cdr.detectChanges();
  }

  protected updateConfig(): void {
    const newConfig = (this.config = {
      ...NZ_NOTIFICATION_DEFAULT_CONFIG,
      ...this.config,
      ...this.mpConfigService.getConfigForComponent(NZ_CONFIG_COMPONENT_NAME)
    }) as NotificationConfig;

    this.top = toCssPixel(newConfig.mpTop!);
    this.bottom = toCssPixel(newConfig.mpBottom!);

    this.cdr.markForCheck();
  }

  protected subscribeConfigChange(): void {
    this.mpConfigService
      .getConfigChangeEventForComponent(NZ_CONFIG_COMPONENT_NAME)
      .subscribe(() => this.updateConfig());
  }

  private replaceNotification(
    old: MpNotificationDataFilled,
    _new: MpNotificationDataFilled
  ): void {
    old.title = _new.title;
    old.content = _new.content;
    old.template = _new.template;
    old.type = _new.type;
  }

  destroy$ = new Subject<void>();
  top: string | null;

  ngOnInit(): void {
    this.subscribeConfigChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Remove a message by `messageId`.
   * @param messageId Id of the message to be removed.
   * @param userAction Whether this is closed by user interaction.
   */
  removeMessage(messageId: string, userAction: boolean = false): void {
    this.messages.some((message, index) => {
      if (message.messageId === messageId) {
        this.messages.splice(index, 1);
        this.messages = [...this.messages];
        this.cdr.detectChanges();
        message.onClose!.next(userAction);
        message.onClose!.complete();
        return true;
      }
      return false;
    });
  }

  /**
   * Remove all messages.
   */
  removeMessageAll(): void {
    this.messages = [];
    this.cdr.detectChanges();
  }

  /**
   * Merge default options and custom message options
   * @param options
   */
  protected mergeMessageOptions(
    options?: MpNotificationDataOptions
  ): MpNotificationDataOptions {
    const defaultOptions: MpNotificationDataOptions = {
      mpDuration: this.config.mpDuration,
      mpAnimate: this.config.mpAnimate,
      mpPauseOnHover: this.config.mpPauseOnHover
    };
    return { ...defaultOptions, ...options };
  }
}
