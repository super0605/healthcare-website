/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

export type MpMark = string | MpMarkObj;

export interface MpMarkObj {
  style?: object;
  label: string;
}

export class MpMarks {
  [key: number]: MpMark;
}

/**
 * Processed steps that would be passed to sub components.
 */
export interface MpExtendedMark {
  value: number;
  offset: number;
  config: MpMark;
}

/**
 * Marks that would be rendered.
 */
export interface MpDisplayedMark extends MpExtendedMark {
  active: boolean;
  label: string;
  style?: object;
}

/**
 * Steps that would be rendered.
 */
export interface MpDisplayedStep extends MpExtendedMark {
  active: boolean;
  style?: object;
}

export type MpSliderShowTooltip = 'always' | 'never' | 'default';

export type MpSliderValue = number[] | number;

export interface MpSliderHandler {
  offset: number | null;
  value: number | null;
  active: boolean;
}
