/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive } from '@angular/core';

@Directive({
  selector: 'div[mp-result-title]',
  exportAs: 'mpResultTitle',
  host: {
    class: 'ant-result-title'
  }
})
export class MpResultTitleDirective {}

@Directive({
  selector: 'div[mp-result-subtitle]',
  exportAs: 'mpResultSubtitle',
  host: {
    class: 'ant-result-subtitle'
  }
})
export class MpResultSubtitleDirective {}

@Directive({
  selector: 'i[mp-result-icon], div[mp-result-icon]',
  exportAs: 'mpResultIcon'
})
export class MpResultIconDirective {}

@Directive({
  selector: 'div[mp-result-content]',
  exportAs: 'mpResultContent',
  host: {
    class: 'ant-result-content'
  }
})
export class MpResultContentDirective {}

@Directive({
  selector: 'div[mp-result-extra]',
  exportAs: 'mpResultExtra',
  host: {
    class: 'ant-result-extra'
  }
})
export class MpResultExtraDirective {}
