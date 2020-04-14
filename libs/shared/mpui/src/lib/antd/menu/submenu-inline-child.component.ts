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
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { collapseMotion } from '../core/animation';
import { MpSafeAny } from '../core/types';
import { MpMenuModeType } from './menu.types';

@Component({
  selector: '[mp-submenu-inline-child]',
  animations: [collapseMotion],
  exportAs: 'mpSubmenuInlineChild',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template [ngTemplateOutlet]="templateOutlet"></ng-template>
  `,
  host: {
    '[class.ant-menu]': 'true',
    '[class.ant-menu-inline]': 'true',
    '[class.ant-menu-sub]': 'true',
    '[class]': 'menuClass',
    '[@collapseMotion]': 'expandState'
  }
})
export class MpSubmenuInlineChildComponent implements OnInit, OnChanges {
  @Input() templateOutlet: TemplateRef<MpSafeAny> | null = null;
  @Input() menuClass: string | null = null;
  @Input() mode: MpMenuModeType = 'vertical';
  @Input() mpOpen = false;
  expandState = 'collapsed';
  calcMotionState(): void {
    if (this.mpOpen) {
      this.expandState = 'expanded';
    } else {
      this.expandState = 'collapsed';
    }
  }
  ngOnInit(): void {
    this.calcMotionState();
  }
  ngOnChanges(changes: SimpleChanges): void {
    const { mode, mpOpen } = changes;
    if (mode || mpOpen) {
      this.calcMotionState();
    }
  }
}
