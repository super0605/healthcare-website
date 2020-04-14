/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TemplateRef } from '@angular/core';
import { MpSafeAny } from '../core/types';

export type MpSelectModeType = 'default' | 'multiple' | 'tags';
export interface MpSelectItemInterface {
  template?: TemplateRef<MpSafeAny> | null;
  mpLabel: string | null;
  mpValue: MpSafeAny | null;
  mpDisabled?: boolean;
  mpHide?: boolean;
  mpCustomContent?: boolean;
  groupLabel?: string | TemplateRef<MpSafeAny> | null;
  type?: string;
  key?: MpSafeAny;
}

export type MpSelectTopControlItemType = Partial<MpSelectItemInterface> & {
  contentTemplateOutlet: TemplateRef<MpSafeAny> | null;
  contentTemplateOutletContext: MpSafeAny;
};

export type MpFilterOptionType = (
  input: string,
  option: MpSelectItemInterface
) => boolean;
