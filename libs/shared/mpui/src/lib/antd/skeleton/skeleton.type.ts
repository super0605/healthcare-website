/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

export type ParagraphWidth = number | string | Array<number | string>;
export type ButtonShape = 'circle' | 'round' | 'default';
export type AvatarShape = 'square' | 'circle';
export type InputSize = 'large' | 'small' | 'default';
export type ButtonSize = InputSize;
export type AvatarSize = InputSize | number;

export interface MpSkeletonAvatar {
  size?: AvatarSize;
  shape?: AvatarShape;
}

export interface MpSkeletonTitle {
  width?: number | string;
}

export interface MpSkeletonParagraph {
  rows?: number;
  width?: ParagraphWidth;
}
