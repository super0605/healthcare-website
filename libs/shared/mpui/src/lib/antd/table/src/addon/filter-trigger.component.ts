/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { MpDropdownMenuComponent } from '../../../dropdown';

@Component({
  selector: 'mp-filter-trigger',
  exportAs: `mpFilterTrigger`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span
      mp-dropdown
      class="ant-table-filter-trigger"
      mpTrigger="click"
      mpPlacement="bottomRight"
      [mpClickHide]="false"
      [mpDropdownMenu]="mpDropdownMenu"
      [class.active]="mpActive"
      [class.ant-table-filter-open]="mpVisible"
      [mpVisible]="mpVisible"
      (mpVisibleChange)="onVisibleChange($event)"
      (click)="onFilterClick($event)"
    >
      <ng-content></ng-content>
    </span>
  `,
  host: {
    '[class.ant-table-filter-trigger-container]': 'true',
    '[class.ant-table-filter-trigger-container-open]': 'mpVisible'
  }
})
export class MpFilterTriggerComponent {
  @Input() mpActive = false;
  @Input() mpDropdownMenu: MpDropdownMenuComponent;
  @Input() mpVisible = false;
  @Output() readonly mpVisibleChange = new EventEmitter<boolean>();
  onVisibleChange(visible: boolean): void {
    this.mpVisible = visible;
    this.mpVisibleChange.next(visible);
  }
  onFilterClick($event: MouseEvent): void {
    $event.stopPropagation();
  }
  hide(): void {
    this.mpVisible = false;
    this.cdr.markForCheck();
  }
  show(): void {
    this.mpVisible = true;
    this.cdr.markForCheck();
  }
  constructor(private cdr: ChangeDetectorRef) {}
}
