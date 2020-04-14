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
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'mp-tree-indent',
  exportAs: 'mpTreeIndent',
  template: `
    <span
      *ngFor="let i of listOfUnit; let index = index"
      [class]="unitMapOfClass(index)"
    ></span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    '[attr.aria-hidden]': 'true',
    '[class.ant-tree-indent]': '!mpSelectMode',
    '[class.ant-select-tree-indent]': 'mpSelectMode'
  }
})
export class MpTreeIndentComponent implements OnInit, OnChanges {
  @Input() mpTreeLevel: number;
  @Input() mpIsStart: boolean[];
  @Input() mpIsEnd: boolean[];
  @Input() mpSelectMode = false;

  listOfUnit: number[] = [];

  unitMapOfClass(index: number): { [key: string]: boolean } {
    return {
      [`ant-tree-indent-unit`]: !this.mpSelectMode,
      [`ant-tree-indent-unit-start`]:
        !this.mpSelectMode && this.mpIsStart[index + 1],
      [`ant-tree-indent-unit-end`]:
        !this.mpSelectMode && this.mpIsEnd[index + 1],
      [`ant-select-tree-indent-unit`]: this.mpSelectMode,
      [`ant-select-tree-indent-unit-start`]:
        this.mpSelectMode && this.mpIsStart[index + 1],
      [`ant-select-tree-indent-unit-end`]:
        this.mpSelectMode && this.mpIsEnd[index + 1]
    };
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const { mpTreeLevel } = changes;
    if (mpTreeLevel) {
      this.listOfUnit = [...new Array(mpTreeLevel.currentValue || 0)];
    }
  }
}
