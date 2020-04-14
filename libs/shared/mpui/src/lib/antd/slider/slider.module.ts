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
import { MpToolTipModule } from '../tooltip';

import { MpSliderHandleComponent } from './handle.component';
import { MpSliderMarksComponent } from './marks.component';
import { MpSliderComponent } from './slider.component';
import { MpSliderStepComponent } from './step.component';
import { MpSliderTrackComponent } from './track.component';

@NgModule({
  exports: [
    MpSliderComponent,
    MpSliderTrackComponent,
    MpSliderHandleComponent,
    MpSliderStepComponent,
    MpSliderMarksComponent
  ],
  declarations: [
    MpSliderComponent,
    MpSliderTrackComponent,
    MpSliderHandleComponent,
    MpSliderStepComponent,
    MpSliderMarksComponent
  ],
  imports: [CommonModule, PlatformModule, MpToolTipModule]
})
export class MpSliderModule {}
