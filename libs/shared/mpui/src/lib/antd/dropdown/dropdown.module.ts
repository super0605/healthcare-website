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

import { MpButtonModule } from '../button';
import { MpNoAnimationModule } from '../core/no-animation';
import { MpOutletModule } from '../core/outlet';
import { MpOverlayModule } from '../core/overlay';
import { MpIconModule } from '../icon';
import { MpMenuModule } from '../menu';
import { MpContextMenuServiceModule } from './context-menu.service.module';
import { MpDropDownADirective } from './dropdown-a.directive';
import { MpDropdownButtonDirective } from './dropdown-button.directive';
import { MpDropdownMenuComponent } from './dropdown-menu.component';
import { MpDropDownDirective } from './dropdown.directive';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    FormsModule,
    MpButtonModule,
    MpMenuModule,
    MpIconModule,
    MpNoAnimationModule,
    MpOverlayModule,
    MpContextMenuServiceModule,
    MpOutletModule
  ],
  declarations: [
    MpDropDownDirective,
    MpDropDownADirective,
    MpDropdownMenuComponent,
    MpDropdownButtonDirective
  ],
  exports: [
    MpMenuModule,
    MpDropDownDirective,
    MpDropDownADirective,
    MpDropdownMenuComponent,
    MpDropdownButtonDirective
  ]
})
export class MpDropDownModule {}
