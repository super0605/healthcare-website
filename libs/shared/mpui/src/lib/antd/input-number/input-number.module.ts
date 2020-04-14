/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MpIconModule } from '../icon';

import { MpInputNumberComponent } from './input-number.component';

@NgModule({
  imports: [CommonModule, FormsModule, MpIconModule],
  declarations: [MpInputNumberComponent],
  exports: [MpInputNumberComponent]
})
export class MpInputNumberModule {}
