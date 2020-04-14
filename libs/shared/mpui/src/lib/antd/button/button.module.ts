/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ɵMpTransitionPatchModule as MpTransitionPatchModule } from '../core/transition-patch';
import { MpWaveModule } from '../core/wave';
import { MpIconModule } from '../icon';
import { MpButtonGroupComponent } from './button-group.component';
import { MpButtonComponent } from './button.component';

@NgModule({
  declarations: [MpButtonComponent, MpButtonGroupComponent],
  exports: [
    MpButtonComponent,
    MpButtonGroupComponent,
    MpTransitionPatchModule,
    MpWaveModule
  ],
  imports: [CommonModule, MpWaveModule, MpIconModule, MpTransitionPatchModule]
})
export class MpButtonModule {}
