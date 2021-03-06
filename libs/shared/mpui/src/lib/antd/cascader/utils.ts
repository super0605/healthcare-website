/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { MpCascaderOption } from './typings';

export function isChildOption(o: MpCascaderOption): boolean {
  return o.isLeaf || !o.children || !o.children.length;
}

export function isParentOption(o: MpCascaderOption): boolean {
  return !!o.children && !!o.children.length && !o.isLeaf;
}
