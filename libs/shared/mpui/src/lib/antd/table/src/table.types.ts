/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { MpSafeAny } from '../../core/types';

export type MpTableData =
  | MpSafeAny
  | {
      [key: string]: MpTableData;
    };
export type MpTableLayout = 'fixed' | 'auto';
export type MpTablePaginationPosition = 'top' | 'bottom' | 'both';
export type MpTableSize = 'middle' | 'default' | 'small';
export type MpTableFilterList = Array<{
  text: string;
  value: MpSafeAny;
  byDefault?: boolean;
}>;
export type MpTableSortOrder = string | 'ascend' | 'descend' | null;
export type MpTableSortFn = (
  a: MpTableData,
  b: MpTableData,
  sortOrder?: MpTableSortOrder
) => number;
export type MpTableFilterValue = MpSafeAny[] | MpSafeAny;
export type MpTableFilterFn = (
  value: MpTableFilterValue,
  data: MpTableData
) => boolean;

export interface MpTableQueryParams {
  pageIndex: number;
  pageSize: number;
  sort: Array<{ key: string; value: MpTableSortOrder }>;
  filter: Array<{ key: string; value: MpTableFilterValue }>;
}
