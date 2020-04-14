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
import { MpWaveModule } from '../core/wave';
import { MpIconModule } from '../icon';
import { MpSwitchComponent } from './switch.component';

@NgModule({
  exports: [MpSwitchComponent],
  declarations: [MpSwitchComponent],
  imports: [CommonModule, MpWaveModule, MpIconModule, MpOutletModule]
})
export class MpSwitchModule {}
