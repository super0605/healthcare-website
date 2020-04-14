/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../core/types';
import { Subject } from 'rxjs';

@Component({
  selector: 'mp-option-group',
  exportAs: 'mpOptionGroup',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
  `
})
export class MpOptionGroupComponent implements OnChanges {
  @Input() mpLabel: string | TemplateRef<MpSafeAny> | null = null;
  changes = new Subject<void>();
  ngOnChanges(): void {
    this.changes.next();
  }
}
