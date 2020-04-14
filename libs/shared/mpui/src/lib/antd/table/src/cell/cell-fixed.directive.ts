/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2
} from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: 'td[mpRight],th[mpRight],td[mpLeft],th[mpLeft]',
  host: {
    '[class.ant-table-cell-fix-right]': `isFixedRight`,
    '[class.ant-table-cell-fix-left]': `isFixedLeft`,
    '[class.ant-table-cell-fix-right-first]': `isFirstRight`,
    '[class.ant-table-cell-fix-left-last]': `isLastLeft`,
    '[style.position]': `isFixed? 'sticky' : null`
  }
})
export class MpCellFixedDirective implements OnChanges {
  @Input() mpRight: string | boolean = false;
  @Input() mpLeft: string | boolean = false;
  @Input() colspan: number | null = null;
  changes$ = new Subject<void>();
  isFirstRight = false;
  isLastLeft = false;
  isAutoLeft = false;
  isAutoRight = false;
  isFixedLeft = false;
  isFixedRight = false;
  isFixed = false;

  setIsFirstRight(isRightFirst: boolean): void {
    this.isFirstRight = isRightFirst;
    this.cdr.markForCheck();
  }

  setIsLastLeft(isLeftLast: boolean): void {
    this.isLastLeft = isLeftLast;
    this.cdr.markForCheck();
  }

  setAutoLeftWidth(autoLeft: string | null): void {
    this.renderer.setStyle(this.elementRef.nativeElement, 'left', autoLeft);
  }

  setAutoRightWidth(autoRight: string | null): void {
    this.renderer.setStyle(this.elementRef.nativeElement, 'right', autoRight);
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnChanges(): void {
    this.isFirstRight = false;
    this.isLastLeft = false;
    this.isAutoLeft = this.mpLeft === '' || this.mpLeft === true;
    this.isAutoRight = this.mpRight === '' || this.mpRight === true;
    this.isFixedLeft = this.mpLeft !== false;
    this.isFixedRight = this.mpRight !== false;
    this.isFixed = this.isFixedLeft || this.isFixedRight;
    const validatePx = (value: string | boolean): string | null => {
      if (typeof value === 'string' && value !== '') {
        return value;
      } else {
        return null;
      }
    };
    this.setAutoLeftWidth(validatePx(this.mpLeft));
    this.setAutoRightWidth(validatePx(this.mpRight));
    this.changes$.next();
  }
}
