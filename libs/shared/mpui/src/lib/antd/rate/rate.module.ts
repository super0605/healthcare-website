/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MpIconModule } from '../icon';
import { MpToolTipModule } from '../tooltip';

import { MpRateItemComponent } from './rate-item.component';
import { MpRateComponent } from './rate.component';

@NgModule({
  exports: [MpRateComponent],
  declarations: [MpRateComponent, MpRateItemComponent],
  imports: [CommonModule, MpIconModule, MpToolTipModule]
})
export class MpRateModule {}
