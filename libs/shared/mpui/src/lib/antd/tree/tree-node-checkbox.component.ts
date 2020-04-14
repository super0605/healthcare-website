/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'mp-tree-node-checkbox',
  template: `
    <span
      [class.ant-tree-checkbox-inner]="!mpSelectMode"
      [class.ant-select-tree-checkbox-inner]="mpSelectMode"
    ></span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    '[class.ant-select-tree-checkbox]': `mpSelectMode`,
    '[class.ant-select-tree-checkbox-checked]': `mpSelectMode && isChecked`,
    '[class.ant-select-tree-checkbox-indeterminate]': `mpSelectMode && isHalfChecked`,
    '[class.ant-select-tree-checkbox-disabled]': `mpSelectMode && (isDisabled || isDisableCheckbox)`,
    '[class.ant-tree-checkbox]': `!mpSelectMode`,
    '[class.ant-tree-checkbox-checked]': `!mpSelectMode && isChecked`,
    '[class.ant-tree-checkbox-indeterminate]': `!mpSelectMode && isHalfChecked`,
    '[class.ant-tree-checkbox-disabled]': `!mpSelectMode && (isDisabled || isDisableCheckbox)`
  }
})
export class MpTreeNodeCheckboxComponent {
  @Input() mpSelectMode = false;
  @Input() isChecked: boolean;
  @Input() isHalfChecked: boolean;
  @Input() isDisabled: boolean;
  @Input() isDisableCheckbox: boolean;
}
