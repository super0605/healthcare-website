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
  MpResultContentDirective,
  MpResultExtraDirective,
  MpResultIconDirective,
  MpResultSubtitleDirective,
  MpResultTitleDirective
} from './result-cells';
import { MpResultComponent } from './result.component';

import { MpResultNotFoundComponent } from './partial/not-found';
import { MpResultServerErrorComponent } from './partial/server-error.component';
import { MpResultUnauthorizedComponent } from './partial/unauthorized';

const partial = [
  MpResultNotFoundComponent,
  MpResultServerErrorComponent,
  MpResultUnauthorizedComponent
];

const cellDirectives = [
  MpResultContentDirective,
  MpResultExtraDirective,
  MpResultIconDirective,
  MpResultSubtitleDirective,
  MpResultTitleDirective
];

@NgModule({
  imports: [CommonModule, MpOutletModule, MpIconModule],
  declarations: [MpResultComponent, ...cellDirectives, ...partial],
  exports: [MpResultComponent, ...cellDirectives]
})
export class MpResultModule {}
