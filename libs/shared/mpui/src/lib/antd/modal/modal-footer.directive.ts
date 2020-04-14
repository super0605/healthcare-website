/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, Optional, TemplateRef } from '@angular/core';
import { MpModalRef } from './modal-ref';

@Directive({
  selector: '[mpModalFooter]',
  exportAs: 'mpModalFooter'
})
export class MpModalFooterDirective {
  constructor(
    @Optional() private mpModalRef: MpModalRef,
    public templateRef: TemplateRef<{}>
  ) {
    if (this.mpModalRef) {
      this.mpModalRef.updateConfig({
        mpFooter: this.templateRef
      });
    }
  }
}
