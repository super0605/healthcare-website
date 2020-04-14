/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { MpSafeAny } from '../types';
import { MpTreeNode } from './mp-tree-base-node';
import { MpTreeBaseService } from './mp-tree-base.service';

export class MpTreeBase {
  constructor(public mpTreeService: MpTreeBaseService) {}

  /**
   * Coerces a value({@link any[]}) to a TreeNodes({@link MpTreeNode[]})
   */
  coerceTreeNodes(value: MpSafeAny[]): MpTreeNode[] {
    let nodes: MpTreeNode[] = [];
    if (!this.mpTreeService.isArrayOfMpTreeNode(value)) {
      // has not been new MpTreeNode
      nodes = value.map(item => new MpTreeNode(item, null, this.mpTreeService));
    } else {
      nodes = value.map((item: MpTreeNode) => {
        item.service = this.mpTreeService;
        return item;
      });
    }
    return nodes;
  }

  /**
   * Get all nodes({@link MpTreeNode})
   */
  getTreeNodes(): MpTreeNode[] {
    return this.mpTreeService.rootNodes;
  }

  /**
   * Get {@link MpTreeNode} with key
   */
  getTreeNodeByKey(key: string): MpTreeNode | null {
    // flat tree nodes
    const nodes: MpTreeNode[] = [];
    const getNode = (node: MpTreeNode): void => {
      nodes.push(node);
      node.getChildren().forEach(n => {
        getNode(n);
      });
    };
    this.getTreeNodes().forEach(n => {
      getNode(n);
    });
    return nodes.find(n => n.key === key) || null;
  }

  /**
   * Get checked nodes(merged)
   */
  getCheckedNodeList(): MpTreeNode[] {
    return this.mpTreeService.getCheckedNodeList();
  }

  /**
   * Get selected nodes
   */
  getSelectedNodeList(): MpTreeNode[] {
    return this.mpTreeService.getSelectedNodeList();
  }

  /**
   * Get half checked nodes
   */
  getHalfCheckedNodeList(): MpTreeNode[] {
    return this.mpTreeService.getHalfCheckedNodeList();
  }

  /**
   * Get expanded nodes
   */
  getExpandedNodeList(): MpTreeNode[] {
    return this.mpTreeService.getExpandedNodeList();
  }

  /**
   * Get matched nodes(if mpSearchValue is not null)
   */
  getMatchedNodeList(): MpTreeNode[] {
    return this.mpTreeService.getMatchedNodeList();
  }
}
