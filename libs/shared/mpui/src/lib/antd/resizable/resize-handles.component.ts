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
  SimpleChanges
} from '@angular/core';

import { MpResizeDirection } from './resize-handle.component';

export const DEFAULT_RESIZE_DIRECTION: MpResizeDirection[] = [
  'bottomRight',
  'topRight',
  'bottomLeft',
  'topLeft',
  'bottom',
  'right',
  'top',
  'left'
];

@Component({
  selector: 'mp-resize-handles',
  exportAs: 'mpResizeHandles',
  template: `
    <mp-resize-handle
      *ngFor="let dir of directions"
      [mpDirection]="dir"
    ></mp-resize-handle>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MpResizeHandlesComponent implements OnChanges {
  @Input() mpDirections: MpResizeDirection[] = DEFAULT_RESIZE_DIRECTION;
  directions: Set<MpResizeDirection>;

  constructor() {
    this.directions = new Set(this.mpDirections);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mpDirections) {
      this.directions = new Set(changes.mpDirections.currentValue);
    }
  }
}
