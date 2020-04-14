/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MpNoAnimationModule } from '../core/no-animation';
import { MpOutletModule } from '../core/outlet';
import { MpOverlayModule } from '../core/overlay';
import { MpEmptyModule } from '../empty';
import { MpI18nModule } from '../i18n';
import { MpIconModule } from '../icon';
import { MpOptionContainerComponent } from './option-container.component';
import { MpOptionGroupComponent } from './option-group.component';
import { MpOptionItemGroupComponent } from './option-item-group.component';
import { MpOptionItemComponent } from './option-item.component';
import { MpOptionComponent } from './option.component';
import { MpSelectArrowComponent } from './select-arrow.component';
import { MpSelectClearComponent } from './select-clear.component';
import { MpSelectItemComponent } from './select-item.component';
import { MpSelectPlaceholderComponent } from './select-placeholder.component';
import { MpSelectSearchComponent } from './select-search.component';
import { MpSelectTopControlComponent } from './select-top-control.component';
import { MpSelectComponent } from './select.component';

@NgModule({
  imports: [
    CommonModule,
    MpI18nModule,
    FormsModule,
    PlatformModule,
    OverlayModule,
    MpIconModule,
    MpOutletModule,
    MpEmptyModule,
    MpOverlayModule,
    MpNoAnimationModule,
    ScrollingModule,
    A11yModule
  ],
  declarations: [
    MpOptionComponent,
    MpSelectComponent,
    MpOptionContainerComponent,
    MpOptionGroupComponent,
    MpOptionItemComponent,
    MpSelectTopControlComponent,
    MpSelectSearchComponent,
    MpSelectItemComponent,
    MpSelectClearComponent,
    MpSelectArrowComponent,
    MpSelectPlaceholderComponent,
    MpOptionItemGroupComponent
  ],
  exports: [
    MpOptionComponent,
    MpSelectComponent,
    MpOptionGroupComponent,
    MpSelectArrowComponent,
    MpSelectClearComponent,
    MpSelectItemComponent,
    MpSelectPlaceholderComponent,
    MpSelectSearchComponent
  ]
})
export class MpSelectModule {}
