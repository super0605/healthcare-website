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

import { MessageConfig, MpConfigService } from '../core/config';
import { toCssPixel } from '../core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MpMessageDataFilled, MpMessageDataOptions } from './typings';

const NZ_CONFIG_COMPONENT_NAME = 'message';
const NZ_MESSAGE_DEFAULT_CONFIG: Required<MessageConfig> = {
  mpAnimate: true,
  mpDuration: 3000,
  mpMaxStack: 7,
  mpPauseOnHover: true,
  mpTop: 24
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-message-container',
  exportAs: 'mpMessageContainer',
  preserveWhitespaces: false,
  template: `
    <div class="ant-message" [style.top]="top">
      <mp-message
        *ngFor="let message of messages"
        [mpMessage]="message"
        (messageDestroy)="removeMessage($event.id, $event.userAction)"
      ></mp-message>
    </div>
  `
})
export class MpMessageContainerComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  messages: MpMessageDataFilled[] = [];
  config: Required<MessageConfig>;
  top: string | null;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected mpConfigService: MpConfigService
  ) {
    this.updateConfig();
  }

  ngOnInit(): void {
    this.subscribeConfigChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Create a new message.
   * @param message Parsed message configuration.
   */
  createMessage(message: MpMessageDataFilled): void {
    if (this.messages.length >= this.config.mpMaxStack) {
      this.messages = this.messages.slice(1);
    }
    message.options = this.mergeMessageOptions(message.options);
    message.onClose = new Subject<boolean>();
    this.messages = [...this.messages, message];
    this.cdr.detectChanges();
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

  protected updateConfig(): void {
    this.config = this.updateConfigFromConfigService();
    this.top = toCssPixel(this.config.mpTop);
    this.cdr.markForCheck();
  }

  protected subscribeConfigChange(): void {
    this.mpConfigService
      .getConfigChangeEventForComponent(NZ_CONFIG_COMPONENT_NAME)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateConfig());
  }

  protected updateConfigFromConfigService(): Required<MessageConfig> {
    return {
      ...NZ_MESSAGE_DEFAULT_CONFIG,
      ...this.config,
      ...this.mpConfigService.getConfigForComponent(NZ_CONFIG_COMPONENT_NAME)
    };
  }

  /**
   * Merge default options and custom message options
   * @param options
   */
  protected mergeMessageOptions(
    options?: MpMessageDataOptions
  ): MpMessageDataOptions {
    const defaultOptions: MpMessageDataOptions = {
      mpDuration: this.config.mpDuration,
      mpAnimate: this.config.mpAnimate,
      mpPauseOnHover: this.config.mpPauseOnHover
    };
    return { ...defaultOptions, ...options };
  }
}
