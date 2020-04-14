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
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { InputNumber } from '../core/util';

import { Subject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-descriptions-item',
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
  exportAs: 'mpDescriptionsItem',
  preserveWhitespaces: false
})
export class MpDescriptionsItemComponent implements OnChanges, OnDestroy {
  @ViewChild(TemplateRef, { static: true }) content: TemplateRef<void>;

  @Input() @InputNumber() mpSpan = 1;
  @Input() mpTitle: string = '';

  readonly inputChange$ = new Subject<void>();

  ngOnChanges(): void {
    this.inputChange$.next();
  }

  ngOnDestroy(): void {
    this.inputChange$.complete();
  }
}
