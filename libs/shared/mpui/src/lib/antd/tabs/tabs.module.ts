/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ObserversModule } from '@angular/cdk/observers';
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MpOutletModule } from '../core/outlet';
import { MpIconModule } from '../icon';

import { MpTabBodyComponent } from './tab-body.component';
import { MpTabLabelDirective } from './tab-label.directive';
import { MpTabLinkDirective } from './tab-link.directive';
import { MpTabComponent } from './tab.component';
import { MpTabDirective } from './tab.directive';
import { MpTabsInkBarDirective } from './tabs-ink-bar.directive';
import { MpTabsNavComponent } from './tabs-nav.component';
import { MpTabSetComponent } from './tabset.component';

@NgModule({
  declarations: [
    MpTabComponent,
    MpTabDirective,
    MpTabSetComponent,
    MpTabsNavComponent,
    MpTabLabelDirective,
    MpTabsInkBarDirective,
    MpTabBodyComponent,
    MpTabLinkDirective
  ],
  exports: [
    MpTabComponent,
    MpTabDirective,
    MpTabSetComponent,
    MpTabsNavComponent,
    MpTabLabelDirective,
    MpTabsInkBarDirective,
    MpTabBodyComponent,
    MpTabLinkDirective
  ],
  imports: [
    CommonModule,
    ObserversModule,
    MpIconModule,
    MpOutletModule,
    PlatformModule
  ]
})
export class MpTabsModule {}
