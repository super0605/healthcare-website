/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TemplateRef, Type } from '@angular/core';
import { MpSafeAny } from '../core/types';
import { MpDrawerRef } from './drawer-ref';

export type MpDrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface MpDrawerOptionsOfComponent<T = MpSafeAny, D = MpSafeAny> {
  mpClosable?: boolean;
  mpMaskClosable?: boolean;
  mpMask?: boolean;
  mpKeyboard?: boolean;
  mpNoAnimation?: boolean;
  mpTitle?: string | TemplateRef<{}>;
  mpContent?: TemplateRef<{ $implicit: D; drawerRef: MpDrawerRef }> | Type<T>;
  mpContentParams?: D;
  mpMaskStyle?: object;
  mpBodyStyle?: object;
  mpWrapClassName?: string;
  mpWidth?: number | string;
  mpHeight?: number | string;
  mpPlacement?: MpDrawerPlacement;
  mpZIndex?: number;
  mpOffsetX?: number;
  mpOffsetY?: number;
}

export interface MpDrawerOptions<T = MpSafeAny, D = MpSafeAny>
  extends MpDrawerOptionsOfComponent<T, D> {
  mpOnCancel?(): Promise<MpSafeAny>;
}
