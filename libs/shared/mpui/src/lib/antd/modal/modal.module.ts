/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MpButtonModule } from '../button';
import { MpNoAnimationModule } from '../core/no-animation';
import { MpOutletModule } from '../core/outlet';
import { MpPipesModule } from '../core/pipe';
import { MpI18nModule } from '../i18n';
import { MpIconModule } from '../icon';

import { MpModalCloseComponent } from './modal-close.component';
import { MpModalConfirmContainerComponent } from './modal-confirm-container.component';
import { MpModalContainerComponent } from './modal-container.component';
import { MpModalFooterComponent } from './modal-footer.component';
import { MpModalFooterDirective } from './modal-footer.directive';
import { MpModalTitleComponent } from './modal-title.component';
import { MpModalComponent } from './modal.component';
import { MpModalService } from './modal.service';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    MpOutletModule,
    PortalModule,
    MpI18nModule,
    MpButtonModule,
    MpIconModule,
    MpPipesModule,
    MpNoAnimationModule
  ],
  exports: [MpModalComponent, MpModalFooterDirective],
  providers: [MpModalService],
  declarations: [
    MpModalComponent,
    MpModalFooterDirective,
    MpModalCloseComponent,
    MpModalFooterComponent,
    MpModalTitleComponent,
    MpModalContainerComponent,
    MpModalConfirmContainerComponent,
    MpModalComponent
  ]
})
export class MpModalModule {}
