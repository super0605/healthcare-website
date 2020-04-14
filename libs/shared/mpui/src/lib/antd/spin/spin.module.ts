/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MpSpinComponent } from './spin.component';

@NgModule({
  exports: [MpSpinComponent],
  declarations: [MpSpinComponent],
  imports: [CommonModule, ObserversModule]
})
export class MpSpinModule {}
