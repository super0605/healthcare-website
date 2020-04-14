/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ClipboardModule } from '@angular/cdk/clipboard';
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MpTransButtonModule } from '../core/trans-button';

import { MpI18nModule } from '../i18n';
import { MpIconModule } from '../icon';
import { MpInputModule } from '../input';
import { MpToolTipModule } from '../tooltip';

import { MpTextCopyComponent } from './text-copy.component';
import { MpTextEditComponent } from './text-edit.component';
import { MpTypographyComponent } from './typography.component';

@NgModule({
  imports: [
    CommonModule,
    MpIconModule,
    MpToolTipModule,
    MpInputModule,
    MpI18nModule,
    MpTransButtonModule,
    ClipboardModule
  ],
  exports: [
    MpTypographyComponent,
    MpTextCopyComponent,
    MpTextEditComponent,
    PlatformModule
  ],
  declarations: [
    MpTypographyComponent,
    MpTextCopyComponent,
    MpTextEditComponent
  ]
})
export class MpTypographyModule {}
