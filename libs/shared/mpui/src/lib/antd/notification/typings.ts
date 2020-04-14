/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TemplateRef } from '@angular/core';

import { NgClassInterface, NgStyleInterface } from '../core/types';
import { Subject } from 'rxjs';

export interface MpNotificationData {
  template?: TemplateRef<{}>;

  type?: 'success' | 'info' | 'warning' | 'error' | 'blank' | string;
  title?: string;
  content?: string | TemplateRef<void>;
}

export type MpNotificationPosition =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

export interface MpNotificationDataOptions<T = {}> {
  mpKey?: string;
  mpStyle?: NgStyleInterface | string;
  mpClass?: NgClassInterface | string;
  mpCloseIcon?: TemplateRef<void> | string;
  mpPosition?: MpNotificationPosition;

  /** Anything user wants renderer into a template. */
  mpData?: T;
  mpDuration?: number;
  mpAnimate?: boolean;
  mpPauseOnHover?: boolean;
}

// Filled version of MpMessageData (includes more private properties)
export interface MpNotificationDataFilled {
  messageId: string; // Service-wide unique id, auto generated
  createdAt: Date; // Auto created

  state?: 'enter' | 'leave';
  options?: MpNotificationDataOptions;
  onClose?: Subject<boolean>;
  template?: TemplateRef<{}>;

  type?: 'success' | 'info' | 'warning' | 'error' | 'blank' | string;
  title?: string;
  content?: string | TemplateRef<void>;
}
