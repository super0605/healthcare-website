/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MpOutletModule } from '../core/outlet';
import { MpPipesModule } from '../core/pipe';

import { MpCountdownComponent } from './countdown.component';
import { MpStatisticNumberComponent } from './statistic-number.component';
import { MpStatisticComponent } from './statistic.component';

@NgModule({
  imports: [CommonModule, PlatformModule, MpOutletModule, MpPipesModule],
  declarations: [
    MpStatisticComponent,
    MpCountdownComponent,
    MpStatisticNumberComponent
  ],
  exports: [
    MpStatisticComponent,
    MpCountdownComponent,
    MpStatisticNumberComponent
  ]
})
export class MpStatisticModule {}
