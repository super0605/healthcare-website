/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MpOutletModule } from '../core/outlet';

import { MpCardGridDirective } from './card-grid.directive';
import { MpCardLoadingComponent } from './card-loading.component';
import { MpCardMetaComponent } from './card-meta.component';
import { MpCardTabComponent } from './card-tab.component';
import { MpCardComponent } from './card.component';

@NgModule({
  imports: [CommonModule, MpOutletModule],
  declarations: [
    MpCardComponent,
    MpCardGridDirective,
    MpCardMetaComponent,
    MpCardLoadingComponent,
    MpCardTabComponent
  ],
  exports: [
    MpCardComponent,
    MpCardGridDirective,
    MpCardMetaComponent,
    MpCardLoadingComponent,
    MpCardTabComponent
  ]
})
export class MpCardModule {}
