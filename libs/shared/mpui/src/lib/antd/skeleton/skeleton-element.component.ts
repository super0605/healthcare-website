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
  Directive,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  AvatarShape,
  AvatarSize,
  ButtonShape,
  ButtonSize,
  InputSize
} from './skeleton.type';

@Directive({
  selector: 'mp-skeleton-element',
  host: {
    '[class.ant-skeleton]': 'true',
    '[class.ant-skeleton-element]': 'true',
    '[class.ant-skeleton-active]': 'mpActive'
  }
})
export class MpSkeletonElementDirective {
  @Input() mpActive: boolean = false;
  @Input() mpType: 'button' | 'input' | 'avatar';
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mp-skeleton-element[mpType="button"]',
  template: `
    <span
      [class.ant-skeleton-button]="true"
      [class.ant-skeleton-button-round]="mpShape === 'round'"
      [class.ant-skeleton-button-circle]="mpShape === 'circle'"
      [class.ant-skeleton-button-lg]="mpSize === 'large'"
      [class.ant-skeleton-button-sm]="mpSize === 'small'"
    >
    </span>
  `
})
export class MpSkeletonElementButtonComponent {
  @Input() mpShape: ButtonShape;
  @Input() mpSize: ButtonSize;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mp-skeleton-element[mpType="avatar"]',
  template: `
    <span
      [class.ant-skeleton-avatar]="true"
      [class.ant-skeleton-avatar-square]="mpShape === 'square'"
      [class.ant-skeleton-avatar-circle]="mpShape === 'circle'"
      [class.ant-skeleton-avatar-lg]="mpSize === 'large'"
      [class.ant-skeleton-avatar-sm]="mpSize === 'small'"
      [style]="styleMap"
    >
    </span>
  `
})
export class MpSkeletonElementAvatarComponent implements OnChanges {
  styleMap = {};
  @Input() mpShape: AvatarShape;
  @Input() mpSize: AvatarSize;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mpSize && typeof this.mpSize === 'number') {
      const sideLength = `${this.mpSize}px`;
      this.styleMap = {
        width: sideLength,
        height: sideLength,
        'line-height': sideLength
      };
    } else {
      this.styleMap = {};
    }
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mp-skeleton-element[mpType="input"]',
  template: `
    <span
      [class.ant-skeleton-input]="true"
      [class.ant-skeleton-input-lg]="mpSize === 'large'"
      [class.ant-skeleton-input-sm]="mpSize === 'small'"
    >
    </span>
  `
})
export class MpSkeletonElementInputComponent {
  @Input() mpSize: InputSize;
}
