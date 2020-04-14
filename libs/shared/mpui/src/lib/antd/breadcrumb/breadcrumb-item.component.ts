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
  ViewEncapsulation
} from '@angular/core';

import { MpDropdownMenuComponent } from '../dropdown';

import { MpBreadCrumbComponent } from './breadcrumb.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-breadcrumb-item',
  exportAs: 'mpBreadcrumbItem',
  preserveWhitespaces: false,
  template: `
    <ng-container *ngIf="!!mpOverlay; else noMenuTpl">
      <span
        class="ant-breadcrumb-overlay-link"
        mp-dropdown
        [mpDropdownMenu]="mpOverlay"
      >
        <ng-template [ngTemplateOutlet]="noMenuTpl"></ng-template>
        <i *ngIf="!!mpOverlay" mp-icon mpType="down"></i>
      </span>
    </ng-container>

    <ng-template #noMenuTpl>
      <span class="ant-breadcrumb-link">
        <ng-content></ng-content>
      </span>
    </ng-template>

    <span
      class="ant-breadcrumb-separator"
      *ngIf="mpBreadCrumbComponent.mpSeparator"
    >
      <ng-container *mpStringTemplateOutlet="mpBreadCrumbComponent.mpSeparator">
        {{ mpBreadCrumbComponent.mpSeparator }}
      </ng-container>
    </span>
  `
})
export class MpBreadCrumbItemComponent {
  /**
   * Dropdown content of a breadcrumb item.
   */
  @Input() mpOverlay?: MpDropdownMenuComponent;

  constructor(public mpBreadCrumbComponent: MpBreadCrumbComponent) {}
}
