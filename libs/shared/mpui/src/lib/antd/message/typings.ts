/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

export type MpMessageType =
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'loading';

export interface MpMessageDataOptions {
  mpDuration?: number;
  mpAnimate?: boolean;
  mpPauseOnHover?: boolean;
}

/**
 * Message data for terminal users.
 */
export interface MpMessageData {
  type?: MpMessageType | string;
  content?: string | TemplateRef<void>;
}

/**
 * Filled version of MpMessageData (includes more private properties).
 */
export interface MpMessageDataFilled extends MpMessageData {
  messageId: string;
  createdAt: Date;

  options?: MpMessageDataOptions;
  state?: 'enter' | 'leave';
  onClose?: Subject<boolean>;
}
