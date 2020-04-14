/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { MpTreeNode } from './mp-tree-base-node';

export interface MpFormatEmitEvent {
  eventName: string;
  node?: MpTreeNode | null;
  event?: MouseEvent | DragEvent | null;
  dragNode?: MpTreeNode;
  selectedKeys?: MpTreeNode[];
  checkedKeys?: MpTreeNode[];
  matchedKeys?: MpTreeNode[];
  nodes?: MpTreeNode[];
  keys?: string[];
}

export interface MpFormatBeforeDropEvent {
  dragNode: MpTreeNode;
  node: MpTreeNode;
  pos: number;
}

export interface MpTreeNodeBaseComponent {
  markForCheck(): void;
}
