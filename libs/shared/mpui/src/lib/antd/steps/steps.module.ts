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

import { MpStepComponent } from './step.component';
import { MpStepsComponent } from './steps.component';

@NgModule({
  imports: [CommonModule, MpIconModule, MpOutletModule],
  exports: [MpStepsComponent, MpStepComponent],
  declarations: [MpStepsComponent, MpStepComponent]
})
export class MpStepsModule {}
