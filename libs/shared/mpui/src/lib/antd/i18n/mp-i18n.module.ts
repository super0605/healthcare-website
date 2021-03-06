/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { MpI18nPipe } from './mp-i18n.pipe';

@NgModule({
  declarations: [MpI18nPipe],
  exports: [MpI18nPipe]
})
export class MpI18nModule {}
