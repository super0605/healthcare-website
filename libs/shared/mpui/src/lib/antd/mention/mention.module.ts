/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MpIconModule } from '../icon';
import { MpMentionSuggestionDirective } from './mention-suggestions';
import { MpMentionTriggerDirective } from './mention-trigger';
import { MpMentionComponent } from './mention.component';

const COMPONENTS = [
  MpMentionComponent,
  MpMentionTriggerDirective,
  MpMentionSuggestionDirective
];

@NgModule({
  imports: [CommonModule, FormsModule, OverlayModule, MpIconModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class MpMentionModule {}
