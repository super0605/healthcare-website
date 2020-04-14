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
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MpMenuModeType } from './menu.types';

@Component({
  selector: '[mp-submenu-title]',
  exportAs: 'mpSubmenuTitle',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <i mp-icon [mpType]="mpIcon" *ngIf="mpIcon"></i>
    <ng-container *mpStringTemplateOutlet="mpTitle">
      <span>{{ mpTitle }}</span>
    </ng-container>
    <ng-content></ng-content>
    <span
      *ngIf="isMenuInsideDropDown; else notDropdownTpl"
      class="ant-dropdown-menu-submenu-arrow"
    >
      <i
        mp-icon
        mpType="right"
        class="ant-dropdown-menu-submenu-arrow-icon"
      ></i>
    </span>
    <ng-template #notDropdownTpl>
      <i class="ant-menu-submenu-arrow"></i>
    </ng-template>
  `,
  host: {
    '[class.ant-dropdown-menu-submenu-title]': 'isMenuInsideDropDown',
    '[class.ant-menu-submenu-title]': '!isMenuInsideDropDown',
    '[style.paddingLeft.px]': 'paddingLeft',
    '(click)': 'clickTitle()',
    '(mouseenter)': 'setMouseState(true)',
    '(mouseleave)': 'setMouseState(false)'
  }
})
export class MpSubMenuTitleComponent {
  @Input() mpIcon: string | null = null;
  @Input() mpTitle: string | TemplateRef<void> | null = null;
  @Input() isMenuInsideDropDown = false;
  @Input() mpDisabled = false;
  @Input() paddingLeft: number | null = null;
  @Input() mode: MpMenuModeType = 'vertical';
  @Output() readonly toggleSubMenu = new EventEmitter();
  @Output() readonly subMenuMouseState = new EventEmitter<boolean>();
  setMouseState(state: boolean): void {
    if (!this.mpDisabled) {
      this.subMenuMouseState.next(state);
    }
  }
  clickTitle(): void {
    if (this.mode === 'inline' && !this.mpDisabled) {
      this.toggleSubMenu.emit();
    }
  }
}
