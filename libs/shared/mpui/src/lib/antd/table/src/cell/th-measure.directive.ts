/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: 'th'
})
export class MpThMeasureDirective implements OnChanges {
  changes$ = new Subject();
  @Input() mpWidth: string | null = null;
  @Input() colspan: number | null = null;
  ngOnChanges(changes: SimpleChanges): void {
    const { mpWidth, colspan } = changes;
    if (mpWidth || colspan) {
      this.changes$.next();
    }
  }
}
