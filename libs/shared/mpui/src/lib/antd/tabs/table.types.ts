/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { MpSafeAny } from '../core/types';
import { Observable } from 'rxjs';

export interface MpAnimatedInterface {
  inkBar: boolean;
  tabPane: boolean;
}

export class MpTabChangeEvent {
  index: number;
  tab: MpSafeAny;
}

export type MpTabsCanDeactivateFn = (
  fromIndex: number,
  toIndex: number
) => Observable<boolean> | Promise<boolean> | boolean;

export type MpTabPosition = 'top' | 'bottom' | 'left' | 'right';
export type MpTabPositionMode = 'horizontal' | 'vertical';
export type MpTabType = 'line' | 'card';
