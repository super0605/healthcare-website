/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { PlatformModule } from '@angular/cdk/platform';
import { NgModule } from '@angular/core';
import { MpWaveDirective } from './mp-wave.directive';

@NgModule({
  imports: [PlatformModule],
  exports: [MpWaveDirective],
  declarations: [MpWaveDirective]
})
export class MpWaveModule {}
