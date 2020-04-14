/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MpOutletModule } from '../core/outlet';

import { MpI18nModule } from '../i18n';

import { MpEmbedEmptyComponent } from './embed-empty.component';
import { MpEmptyComponent } from './empty.component';
import { MpEmptyDefaultComponent } from './partial/default';
import { MpEmptySimpleComponent } from './partial/simple';

@NgModule({
  imports: [CommonModule, PortalModule, MpOutletModule, MpI18nModule],
  declarations: [
    MpEmptyComponent,
    MpEmbedEmptyComponent,
    MpEmptyDefaultComponent,
    MpEmptySimpleComponent
  ],
  exports: [MpEmptyComponent, MpEmbedEmptyComponent]
})
export class MpEmptyModule {}
