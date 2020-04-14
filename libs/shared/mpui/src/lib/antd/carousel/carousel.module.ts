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

import { MpCarouselContentDirective } from './carousel-content.directive';
import { MpCarouselComponent } from './carousel.component';

@NgModule({
  declarations: [MpCarouselComponent, MpCarouselContentDirective],
  exports: [MpCarouselComponent, MpCarouselContentDirective],
  imports: [CommonModule, PlatformModule]
})
export class MpCarouselModule {}
