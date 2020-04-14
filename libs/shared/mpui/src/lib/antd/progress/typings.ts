/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TemplateRef } from '@angular/core';
import { NgStyleInterface } from '../core/types';

export type MpProgressGapPositionType = 'top' | 'bottom' | 'left' | 'right';

export type MpProgressStatusType =
  | 'success'
  | 'exception'
  | 'active'
  | 'normal';

export type MpProgressTypeType = 'line' | 'circle' | 'dashboard';

export type MpProgressStrokeLinecapType = 'round' | 'square';

export interface MpProgressGradientProgress {
  [percent: string]: string;
}

export interface MpProgressGradientFromTo {
  from: string;
  to: string;
}

export type MpProgressColorGradient = { direction?: string } & (
  | MpProgressGradientProgress
  | MpProgressGradientFromTo);

export type MpProgressStrokeColorType = string | MpProgressColorGradient;

export type MpProgressFormatter =
  | ((percent: number) => string)
  | TemplateRef<{ $implicit: number }>;

export interface MpProgressCirclePath {
  stroke: string | null;
  strokePathStyle: NgStyleInterface;
}

export interface MpProgressStepItem {
  backgroundColor: string;
  width: string;
  height: string;
}
