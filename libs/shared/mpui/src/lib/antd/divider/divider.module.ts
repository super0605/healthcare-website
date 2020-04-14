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
import { MpDividerComponent } from './divider.component';

@NgModule({
  imports: [CommonModule, MpOutletModule],
  declarations: [MpDividerComponent],
  exports: [MpDividerComponent]
})
export class MpDividerModule {}
