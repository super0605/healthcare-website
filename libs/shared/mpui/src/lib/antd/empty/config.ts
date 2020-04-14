/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { InjectionToken, TemplateRef, Type } from '@angular/core';
import { MpSafeAny } from '../core/types';

export type MpEmptySize = 'normal' | 'small' | '';

export type MpEmptyCustomContent =
  | Type<MpSafeAny>
  | TemplateRef<MpSafeAny>
  | string;

export const NZ_EMPTY_COMPONENT_NAME = new InjectionToken<string>(
  'mp-empty-component-name'
);
