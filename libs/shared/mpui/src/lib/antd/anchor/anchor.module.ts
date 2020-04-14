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
import { MpAffixModule } from '../affix';
import { SCROLL_SERVICE_PROVIDER } from '../core/services';

import { MpAnchorLinkComponent } from './anchor-link.component';
import { MpAnchorComponent } from './anchor.component';

@NgModule({
  declarations: [MpAnchorComponent, MpAnchorLinkComponent],
  exports: [MpAnchorComponent, MpAnchorLinkComponent],
  imports: [CommonModule, MpAffixModule, PlatformModule],
  providers: [SCROLL_SERVICE_PROVIDER]
})
export class MpAnchorModule {}
