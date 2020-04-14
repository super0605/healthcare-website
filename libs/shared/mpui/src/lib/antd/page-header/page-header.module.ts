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
import { MpIconModule } from '../icon';

import {
  MpPageHeaderAvatarDirective,
  MpPageHeaderBreadcrumbDirective,
  MpPageHeaderContentDirective,
  MpPageHeaderExtraDirective,
  MpPageHeaderFooterDirective,
  MpPageHeaderSubtitleDirective,
  MpPageHeaderTagDirective,
  MpPageHeaderTitleDirective
} from './page-header-cells';
import { MpPageHeaderComponent } from './page-header.component';

const MpPageHeaderCells = [
  MpPageHeaderTitleDirective,
  MpPageHeaderSubtitleDirective,
  MpPageHeaderContentDirective,
  MpPageHeaderTagDirective,
  MpPageHeaderExtraDirective,
  MpPageHeaderFooterDirective,
  MpPageHeaderBreadcrumbDirective,
  MpPageHeaderAvatarDirective
];

@NgModule({
  imports: [CommonModule, MpOutletModule, MpIconModule],
  exports: [MpPageHeaderComponent, MpPageHeaderCells],
  declarations: [MpPageHeaderComponent, MpPageHeaderCells]
})
export class MpPageHeaderModule {}
