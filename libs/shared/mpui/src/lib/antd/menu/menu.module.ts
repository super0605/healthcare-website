/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MpNoAnimationModule } from '../core/no-animation';
import { MpOutletModule } from '../core/outlet';
import { MpIconModule } from '../icon';
import { MpMenuDividerDirective } from './menu-divider.directive';
import { MpMenuGroupComponent } from './menu-group.component';
import { MpMenuItemDirective } from './menu-item.directive';
import { MpMenuDirective } from './menu.directive';
import { MpSubmenuInlineChildComponent } from './submenu-inline-child.component';
import { MpSubmenuNoneInlineChildComponent } from './submenu-non-inline-child.component';
import { MpSubMenuTitleComponent } from './submenu-title.component';
import { MpSubMenuComponent } from './submenu.component';

@NgModule({
  imports: [
    CommonModule,
    PlatformModule,
    OverlayModule,
    MpIconModule,
    MpNoAnimationModule,
    MpOutletModule
  ],
  declarations: [
    MpMenuDirective,
    MpMenuItemDirective,
    MpSubMenuComponent,
    MpMenuDividerDirective,
    MpMenuGroupComponent,
    MpSubMenuTitleComponent,
    MpSubmenuInlineChildComponent,
    MpSubmenuNoneInlineChildComponent
  ],
  exports: [
    MpMenuDirective,
    MpMenuItemDirective,
    MpSubMenuComponent,
    MpMenuDividerDirective,
    MpMenuGroupComponent
  ]
})
export class MpMenuModule {}
