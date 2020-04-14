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
import { FormsModule } from '@angular/forms';
import { MpI18nModule } from '../i18n';
import { MpIconModule } from '../icon';
import { MpProgressModule } from '../progress';
import { MpToolTipModule } from '../tooltip';

import { MpUploadBtnComponent } from './upload-btn.component';
import { MpUploadListComponent } from './upload-list.component';
import { MpUploadComponent } from './upload.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PlatformModule,
    MpToolTipModule,
    MpProgressModule,
    MpI18nModule,
    MpIconModule
  ],
  declarations: [
    MpUploadComponent,
    MpUploadBtnComponent,
    MpUploadListComponent
  ],
  exports: [MpUploadComponent]
})
export class MpUploadModule {}
