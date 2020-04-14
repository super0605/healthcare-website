/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { InjectionToken } from '@angular/core';

import { DateLocale, MpI18nInterface } from './mp-i18n.interface';

export const NZ_I18N = new InjectionToken<MpI18nInterface>('mp-i18n');

/** Locale for date operations, should import from date-fns, see example: https://github.com/date-fns/date-fns/blob/v1.30.1/src/locale/zh_cn/index.js */
export const NZ_DATE_LOCALE = new InjectionToken<DateLocale>('mp-date-locale');
