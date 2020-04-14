/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MpResizableDirective } from './resizable.directive';
import { MpResizeHandleComponent } from './resize-handle.component';
import { MpResizeHandlesComponent } from './resize-handles.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    MpResizableDirective,
    MpResizeHandleComponent,
    MpResizeHandlesComponent
  ],
  exports: [
    MpResizableDirective,
    MpResizeHandleComponent,
    MpResizeHandlesComponent
  ]
})
export class MpResizableModule {}
