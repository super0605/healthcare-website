/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { MpSafeAny } from '../core/types';

export type MpCascaderExpandTrigger = 'click' | 'hover';
export type MpCascaderTriggerType = 'click' | 'hover';
export type MpCascaderSize = 'small' | 'large' | 'default';

export type MpCascaderFilter = (
  searchValue: string,
  path: MpCascaderOption[]
) => boolean;
export type MpCascaderSorter = (
  a: MpCascaderOption[],
  b: MpCascaderOption[],
  inputValue: string
) => number;

/**
 * @deprecated Use the prefixed version.
 */
export interface CascaderOption {
  value?: MpSafeAny;
  label?: string;
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  isLeaf?: boolean;
  parent?: MpCascaderOption;
  children?: MpCascaderOption[];

  [key: string]: MpSafeAny;
}

export type MpCascaderOption = CascaderOption;

/**
 * @deprecated Use the prefixed version.
 */
export interface CascaderSearchOption extends MpCascaderOption {
  path: MpCascaderOption[];
}

export type MpCascaderSearchOption = CascaderSearchOption;

export interface MpShowSearchOptions {
  filter?: MpCascaderFilter;
  sorter?: MpCascaderSorter;
}

export function isShowSearchObject(
  options: MpShowSearchOptions | boolean
): options is MpShowSearchOptions {
  return typeof options !== 'boolean';
}

/**
 * To avoid circular dependency, provide an interface of `MpCascaderComponent`
 * for `MpCascaderService`.
 */
export interface MpCascaderComponentAsSource {
  inputValue: string;
  mpShowSearch: MpShowSearchOptions | boolean;
  mpLabelProperty: string;
  mpValueProperty: string;
  mpChangeOnSelect: boolean;

  mpChangeOn?(option: MpCascaderOption, level: number): boolean;

  mpLoadData?(node: MpCascaderOption, index?: number): PromiseLike<MpSafeAny>;
}
