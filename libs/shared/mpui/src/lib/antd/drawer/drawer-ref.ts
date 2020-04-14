/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TemplateRef } from '@angular/core';
import { MpSafeAny } from '../core/types';
import { Observable } from 'rxjs';
import { MpDrawerPlacement } from './drawer-options';

export abstract class MpDrawerRef<R = MpSafeAny> {
  abstract afterClose: Observable<R>;
  abstract afterOpen: Observable<void>;
  abstract close(result?: R): void;
  abstract open(): void;

  abstract mpClosable: boolean;
  abstract mpNoAnimation: boolean;
  abstract mpMaskClosable: boolean;
  abstract mpKeyboard: boolean;
  abstract mpMask: boolean;
  abstract mpTitle: string | TemplateRef<{}>;
  abstract mpPlacement: MpDrawerPlacement;
  abstract mpMaskStyle: object;
  abstract mpBodyStyle: object;
  abstract mpWrapClassName: string;
  abstract mpWidth: number | string;
  abstract mpHeight: number | string;
  abstract mpZIndex: number | string;
  abstract mpOffsetX: number | string;
  abstract mpOffsetY: number | string;
}
