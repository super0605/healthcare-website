/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TemplateRef } from '@angular/core';
import { CandyDate } from '../core/time';

export type PickerResult = PickerResultSingle | PickerResultRange;

export type DisabledDateFn = (d: Date) => boolean;

export type DisabledTimePartial = 'start' | 'end';

export type PanelMode = 'decade' | 'year' | 'month' | 'week' | 'date' | 'time';

export type RangePartType = 'left' | 'right';

export type CompatibleDate = Date | Date[];

export type DisabledTimeFn = (
  current: Date | Date[],
  partial?: DisabledTimePartial
) => DisabledTimeConfig;

// The common result data format (the range-picker's props can be result as array)
export interface PickerResultSingle {
  date: CandyDate;
  dateString: string;
}
export interface PickerResultRange {
  date: CandyDate[];
  dateString: string[];
}

export interface DisabledTimeConfig {
  mpDisabledHours(): number[];
  mpDisabledMinutes(hour: number): number[];
  mpDisabledSeconds(hour: number, minute: number): number[];
}

export interface SupportTimeOptions {
  mpFormat?: string;
  mpHourStep?: number;
  mpMinuteStep?: number;
  mpSecondStep?: number;
  mpDisabledHours?(): number[];
  mpDisabledMinutes?(hour: number): number[];
  mpDisabledSeconds?(hour: number, minute: number): number[];
  mpHideDisabledOptions?: boolean;
  mpDefaultOpenValue?: Date;
  mpAddOn?: TemplateRef<void>;
  mpUse12Hours?: boolean;
}

export interface PresetRanges {
  [key: string]: Date[] | (() => Date[]);
}
