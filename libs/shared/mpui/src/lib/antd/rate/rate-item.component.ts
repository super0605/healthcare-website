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
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { InputBoolean } from '../core/util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: '[mp-rate-item]',
  exportAs: 'mpRateItem',
  template: `
    <div
      class="ant-rate-star-second"
      (mouseover)="hoverRate(false); $event.stopPropagation()"
      (click)="clickRate(false)"
    >
      <ng-template
        [ngTemplateOutlet]="character || defaultCharacter"
      ></ng-template>
    </div>
    <div
      class="ant-rate-star-first"
      (mouseover)="hoverRate(true); $event.stopPropagation()"
      (click)="clickRate(true)"
    >
      <ng-template
        [ngTemplateOutlet]="character || defaultCharacter"
      ></ng-template>
    </div>

    <ng-template #defaultCharacter>
      <i mp-icon mpType="star" mpTheme="fill"></i>
    </ng-template>
  `
})
export class MpRateItemComponent {
  @Input() character: TemplateRef<void>;
  @Input() @InputBoolean() allowHalf: boolean = false;
  @Output() readonly itemHover = new EventEmitter<boolean>();
  @Output() readonly itemClick = new EventEmitter<boolean>();

  hoverRate(isHalf: boolean): void {
    this.itemHover.next(isHalf && this.allowHalf);
  }

  clickRate(isHalf: boolean): void {
    this.itemClick.next(isHalf && this.allowHalf);
  }
}
