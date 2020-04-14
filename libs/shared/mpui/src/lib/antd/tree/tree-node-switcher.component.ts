/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef
} from '@angular/core';
import { MpTreeNode, MpTreeNodeOptions } from '../core/tree';

@Component({
  selector: 'mp-tree-node-switcher',
  template: `
    <ng-container *ngIf="isShowSwitchIcon">
      <ng-container *ngIf="!isLoading; else loadingTemplate">
        <ng-container
          *mpStringTemplateOutlet="
            mpExpandedIcon;
            context: { $implicit: context, origin: context.origin }
          "
        >
          <i
            mp-icon
            mpType="caret-down"
            [class.ant-select-tree-switcher-icon]="mpSelectMode"
            [class.ant-tree-switcher-icon]="!mpSelectMode"
          ></i>
        </ng-container>
      </ng-container>
    </ng-container>
    <ng-container *ngIf="mpShowLine">
      <ng-container *ngIf="!isLoading; else loadingTemplate">
        <ng-container
          *mpStringTemplateOutlet="
            mpExpandedIcon;
            context: { $implicit: context, origin: context.origin }
          "
        >
          <i
            *ngIf="isShowLineIcon"
            mp-icon
            [mpType]="isSwitcherOpen ? 'minus-square' : 'plus-square'"
            class="ant-tree-switcher-line-icon"
          ></i>
          <i
            *ngIf="!isShowLineIcon"
            mp-icon
            mpType="file"
            class="ant-tree-switcher-line-icon"
          ></i>
        </ng-container>
      </ng-container>
    </ng-container>
    <ng-template #loadingTemplate>
      <i
        mp-icon
        mpType="loading"
        [mpSpin]="true"
        class="ant-tree-switcher-loading-icon"
      ></i>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    '[class.ant-select-tree-switcher]': 'mpSelectMode',
    '[class.ant-select-tree-switcher-noop]': 'mpSelectMode && isLeaf',
    '[class.ant-select-tree-switcher_open]': 'mpSelectMode && isSwitcherOpen',
    '[class.ant-select-tree-switcher_close]': 'mpSelectMode && isSwitcherClose',
    '[class.ant-tree-switcher]': '!mpSelectMode',
    '[class.ant-tree-switcher-noop]': '!mpSelectMode && isLeaf',
    '[class.ant-tree-switcher_open]': '!mpSelectMode && isSwitcherOpen',
    '[class.ant-tree-switcher_close]': '!mpSelectMode && isSwitcherClose'
  }
})
export class MpTreeNodeSwitcherComponent {
  @Input() mpShowExpand: boolean;
  @Input() mpShowLine: boolean;
  @Input() mpExpandedIcon: TemplateRef<{
    $implicit: MpTreeNode;
    origin: MpTreeNodeOptions;
  }>;
  @Input() mpSelectMode = false;
  @Input() context: MpTreeNode;
  @Input() isLeaf: boolean;
  @Input() isLoading: boolean;
  @Input() isExpanded: boolean;

  get isShowLineIcon(): boolean {
    return !this.isLeaf && this.mpShowLine;
  }

  get isShowSwitchIcon(): boolean {
    return !this.isLeaf && !this.mpShowLine;
  }

  get isSwitcherOpen(): boolean {
    return this.isExpanded && !this.isLeaf;
  }

  get isSwitcherClose(): boolean {
    return !this.isExpanded && !this.isLeaf;
  }
}
