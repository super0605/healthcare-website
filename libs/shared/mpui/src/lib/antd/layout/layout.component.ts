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
  ContentChildren,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { MpSiderComponent } from './sider.component';

@Component({
  selector: 'mp-layout',
  exportAs: 'mpLayout',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[class.ant-layout-has-sider]': 'listOfMpSiderComponent.length > 0',
    '[class.ant-layout]': 'true'
  }
})
export class MpLayoutComponent {
  @ContentChildren(MpSiderComponent) listOfMpSiderComponent: QueryList<
    MpSiderComponent
  >;
}
