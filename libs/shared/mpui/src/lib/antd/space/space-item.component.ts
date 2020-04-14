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
  ElementRef,
  OnInit,
  Renderer2
} from '@angular/core';

import { MpSpaceDirection, MpSpaceSize } from './types';

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24
};

@Component({
  selector: 'mp-space-item, [mp-space-item]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
  `,
  host: {
    class: 'ant-space-item'
  }
})
export class MpSpaceItemComponent implements OnInit {
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  setDirectionAndSize(
    direction: MpSpaceDirection,
    size: number | MpSpaceSize
  ): void {
    const marginSize = typeof size === 'string' ? spaceSize[size] : size;
    if (direction === 'horizontal') {
      this.renderer.removeStyle(this.elementRef.nativeElement, 'margin-bottom');
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'margin-right',
        `${marginSize}px`
      );
    } else {
      this.renderer.removeStyle(this.elementRef.nativeElement, 'margin-right');
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'margin-bottom',
        `${marginSize}px`
      );
    }
  }

  ngOnInit(): void {}
}
