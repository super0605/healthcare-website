/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { InjectionToken } from '@angular/core';
import { MenuService } from './menu.service';

export const MpIsMenuInsideDropDownToken = new InjectionToken<boolean>(
  'MpIsInDropDownMenuToken'
);
export const MpMenuServiceLocalToken = new InjectionToken<MenuService>(
  'MpMenuServiceLocalToken'
);
