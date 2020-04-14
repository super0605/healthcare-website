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
import { MpOverlayModule } from '../core/overlay';

import { MpI18nModule } from '../i18n';
import { MpIconModule } from '../icon';

import { MpTimePickerPanelComponent } from './time-picker-panel.component';
import { MpTimePickerComponent } from './time-picker.component';
import { MpTimeValueAccessorDirective } from './time-value-accessor.directive';

@NgModule({
  declarations: [
    MpTimePickerComponent,
    MpTimePickerPanelComponent,
    MpTimeValueAccessorDirective
  ],
  exports: [MpTimePickerPanelComponent, MpTimePickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    MpI18nModule,
    OverlayModule,
    MpIconModule,
    MpOverlayModule
  ]
})
export class MpTimePickerModule {}
