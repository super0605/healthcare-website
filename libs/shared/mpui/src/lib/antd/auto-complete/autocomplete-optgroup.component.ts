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
  Input,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'mp-auto-optgroup',
  exportAs: 'mpAutoOptgroup',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ant-select-item ant-select-item-group">
      <ng-container *mpStringTemplateOutlet="mpLabel">{{
        mpLabel
      }}</ng-container>
    </div>
    <ng-content select="mp-auto-option"></ng-content>
  `
})
export class MpAutocompleteOptgroupComponent {
  @Input() mpLabel: string | TemplateRef<void>;

  constructor() {}
}
