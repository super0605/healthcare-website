/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { MpSafeAny } from '../types';

export function isPromise<T>(obj: MpSafeAny): obj is Promise<T> {
  return (
    !!obj && typeof obj.then === 'function' && typeof obj.catch === 'function'
  );
}