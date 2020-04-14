/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MpSkeletonElementAvatarComponent,
  MpSkeletonElementButtonComponent,
  MpSkeletonElementDirective,
  MpSkeletonElementInputComponent
} from './skeleton-element.component';
import { MpSkeletonComponent } from './skeleton.component';

@NgModule({
  declarations: [
    MpSkeletonComponent,
    MpSkeletonElementDirective,
    MpSkeletonElementButtonComponent,
    MpSkeletonElementAvatarComponent,
    MpSkeletonElementInputComponent
  ],
  imports: [CommonModule],
  exports: [
    MpSkeletonComponent,
    MpSkeletonElementDirective,
    MpSkeletonElementButtonComponent,
    MpSkeletonElementAvatarComponent,
    MpSkeletonElementInputComponent
  ]
})
export class MpSkeletonModule {}
