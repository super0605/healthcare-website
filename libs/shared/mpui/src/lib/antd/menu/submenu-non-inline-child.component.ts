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
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { slideMotion, zoomBigMotion } from '../core/animation';
import { MpSafeAny } from '../core/types';
import { MpMenuModeType, MpMenuThemeType } from './menu.types';

@Component({
  selector: '[mp-submenu-none-inline-child]',
  exportAs: 'mpSubmenuNoneInlineChild',
  encapsulation: ViewEncapsulation.None,
  animations: [zoomBigMotion, slideMotion],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class.ant-dropdown-menu]="isMenuInsideDropDown"
      [class.ant-menu]="!isMenuInsideDropDown"
      [class.ant-dropdown-menu-vertical]="isMenuInsideDropDown"
      [class.ant-menu-vertical]="!isMenuInsideDropDown"
      [class.ant-dropdown-menu-sub]="isMenuInsideDropDown"
      [class.ant-menu-sub]="!isMenuInsideDropDown"
      [class]="menuClass"
    >
      <ng-template [ngTemplateOutlet]="templateOutlet"></ng-template>
    </div>
  `,
  host: {
    '[class.ant-menu-submenu]': 'true',
    '[class.ant-menu-submenu-popup]': 'true',
    '[class.ant-menu-light]': "theme === 'light'",
    '[class.ant-menu-dark]': "theme === 'dark'",
    '[class.ant-menu-submenu-placement-bottom]': "mode === 'horizontal'",
    '[class.ant-menu-submenu-placement-right]':
      "mode === 'vertical' && position === 'right'",
    '[class.ant-menu-submenu-placement-left]':
      "mode === 'vertical' && position === 'left'",
    '[@slideMotion]': 'expandState',
    '[@zoomBigMotion]': 'expandState',
    '(mouseenter)': 'setMouseState(true)',
    '(mouseleave)': 'setMouseState(false)'
  }
})
export class MpSubmenuNoneInlineChildComponent implements OnInit, OnChanges {
  @Input() menuClass: string | null = null;
  @Input() theme: MpMenuThemeType = 'light';
  @Input() templateOutlet: TemplateRef<MpSafeAny> | null = null;
  @Input() isMenuInsideDropDown = false;
  @Input() mode: MpMenuModeType = 'vertical';
  @Input() position = 'right';
  @Input() mpDisabled = false;
  @Input() mpOpen = false;
  @Output() readonly subMenuMouseState = new EventEmitter<boolean>();
  setMouseState(state: boolean): void {
    if (!this.mpDisabled) {
      this.subMenuMouseState.next(state);
    }
  }
  expandState = 'collapsed';
  calcMotionState(): void {
    if (this.mpOpen) {
      if (this.mode === 'horizontal') {
        this.expandState = 'bottom';
      } else if (this.mode === 'vertical') {
        this.expandState = 'active';
      }
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
