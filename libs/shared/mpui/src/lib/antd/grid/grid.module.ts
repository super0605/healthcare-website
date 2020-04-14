/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { LayoutModule } from '@angular/cdk/layout';
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MpColDirective } from './col.directive';
import { MpRowDirective } from './row.directive';

@NgModule({
  declarations: [MpColDirective, MpRowDirective],
  exports: [MpColDirective, MpRowDirective],
  imports: [CommonModule, LayoutModule, PlatformModule]
})
export class MpGridModule {}
