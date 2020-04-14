/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MpAvatarModule } from '../avatar';
import { MpOutletModule } from '../core/outlet';
import { MpEmptyModule } from '../empty';
import { MpGridModule } from '../grid';
import { MpSpinModule } from '../spin';

import {
  MpListEmptyComponent,
  MpListFooterComponent,
  MpListGridDirective,
  MpListHeaderComponent,
  MpListLoadMoreDirective,
  MpListPaginationComponent
} from './list-cell';
import {
  MpListItemActionComponent,
  MpListItemActionsComponent,
  MpListItemExtraComponent
} from './list-item-cell';
import {
  MpListItemMetaAvatarComponent,
  MpListItemMetaDescriptionComponent,
  MpListItemMetaTitleComponent
} from './list-item-meta-cell';
import { MpListItemMetaComponent } from './list-item-meta.component';
import { MpListItemComponent } from './list-item.component';
import { MpListComponent } from './list.component';

const DIRECTIVES = [
  MpListComponent,
  MpListHeaderComponent,
  MpListFooterComponent,
  MpListPaginationComponent,
  MpListEmptyComponent,
  MpListItemComponent,
  MpListItemMetaComponent,
  MpListItemMetaTitleComponent,
  MpListItemMetaDescriptionComponent,
  MpListItemMetaAvatarComponent,
  MpListItemActionsComponent,
  MpListItemActionComponent,
  MpListItemExtraComponent,
  MpListLoadMoreDirective,
  MpListGridDirective
];

@NgModule({
  imports: [
    CommonModule,
    MpSpinModule,
    MpGridModule,
    MpAvatarModule,
    MpOutletModule,
    MpEmptyModule
  ],
  declarations: [DIRECTIVES],
  exports: [DIRECTIVES]
})
export class MpListModule {}
