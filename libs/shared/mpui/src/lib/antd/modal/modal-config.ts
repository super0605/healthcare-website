/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { InjectionToken } from '@angular/core';

export interface MpModalConfig {
  mpMask?: boolean;
  mpMaskClosable?: boolean;
}
export const NZ_MODAL_CONFIG = new InjectionToken<MpModalConfig>(
  'NZ_MODAL_CONFIG'
);
