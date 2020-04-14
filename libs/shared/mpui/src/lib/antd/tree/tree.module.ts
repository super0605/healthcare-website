/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MpHighlightModule } from '../core/highlight';
import { MpNoAnimationModule } from '../core/no-animation';
import { MpOutletModule } from '../core/outlet';
import { MpIconModule } from '../icon';
import { MpTreeIndentComponent } from './tree-indent.component';
import { MpTreeNodeCheckboxComponent } from './tree-node-checkbox.component';
import { MpTreeNodeSwitcherComponent } from './tree-node-switcher.component';
import { MpTreeNodeTitleComponent } from './tree-node-title.component';
import { MpTreeNodeComponent } from './tree-node.component';
import { MpTreeComponent } from './tree.component';

@NgModule({
  imports: [
    CommonModule,
    MpOutletModule,
    MpIconModule,
    MpNoAnimationModule,
    MpHighlightModule,
    ScrollingModule
  ],
  declarations: [
    MpTreeComponent,
    MpTreeNodeComponent,
    MpTreeIndentComponent,
    MpTreeNodeSwitcherComponent,
    MpTreeNodeCheckboxComponent,
    MpTreeNodeTitleComponent
  ],
  exports: [MpTreeComponent, MpTreeNodeComponent, MpTreeIndentComponent]
})
export class MpTreeModule {}
