/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MpOutletModule } from '../core/outlet';

import {
  MpCommentActionComponent,
  MpCommentActionHostDirective,
  MpCommentAvatarDirective,
  MpCommentContentDirective
} from './comment-cells';
import { MpCommentComponent } from './comment.component';

const NZ_COMMENT_CELLS = [
  MpCommentAvatarDirective,
  MpCommentContentDirective,
  MpCommentActionComponent,
  MpCommentActionHostDirective
];

@NgModule({
  imports: [CommonModule, MpOutletModule],
  exports: [MpCommentComponent, ...NZ_COMMENT_CELLS],
  declarations: [MpCommentComponent, ...NZ_COMMENT_CELLS]
})
export class MpCommentModule {}
