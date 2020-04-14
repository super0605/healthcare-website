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

import { MpTimelineItemComponent } from './timeline-item.component';
import { MpTimelineComponent } from './timeline.component';

@NgModule({
  declarations: [MpTimelineItemComponent, MpTimelineComponent],
  exports: [MpTimelineItemComponent, MpTimelineComponent],
  imports: [CommonModule, PlatformModule, MpIconModule, MpOutletModule]
})
export class MpTimelineModule {}
