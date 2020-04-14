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

import { MpIconModule } from '../icon';
import { MpAutosizeDirective } from './autosize.directive';
import { MpInputGroupSlotComponent } from './input-group-slot.component';
import { MpInputGroupComponent } from './input-group.component';
import { MpInputDirective } from './input.directive';

@NgModule({
  declarations: [
    MpInputDirective,
    MpInputGroupComponent,
    MpAutosizeDirective,
    MpInputGroupSlotComponent
  ],
  exports: [MpInputDirective, MpInputGroupComponent, MpAutosizeDirective],
  imports: [CommonModule, MpIconModule, PlatformModule, MpOutletModule]
})
export class MpInputModule {}
