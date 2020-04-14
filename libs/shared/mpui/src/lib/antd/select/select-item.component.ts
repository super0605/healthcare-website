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
import { MpSafeAny } from '../core/types';

@Component({
  selector: 'mp-select-item',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *mpStringTemplateOutlet="
        contentTemplateOutlet;
        context: { $implicit: contentTemplateOutletContext }
      "
    >
      <div
        class="ant-select-selection-item-content"
        *ngIf="deletable; else labelTemplate"
      >
        {{ label }}
      </div>
      <ng-template #labelTemplate>{{ label }}</ng-template>
    </ng-container>
    <span
      *ngIf="deletable && !disabled"
      class="ant-select-selection-item-remove"
      (click)="onDelete($event)"
    >
      <i mp-icon mpType="close" *ngIf="!removeIcon; else removeIcon"></i>
    </span>
  `,
  host: {
    '[attr.title]': 'label',
    '[class.ant-select-selection-item]': 'true',
    '[class.ant-select-selection-item-disabled]': 'disabled'
  }
})
export class MpSelectItemComponent {
  @Input() disabled = false;
  @Input() label: string | null = null;
  @Input() deletable = false;
  @Input() removeIcon: TemplateRef<MpSafeAny> | null = null;
  @Input() contentTemplateOutletContext: MpSafeAny | null = null;
  @Input() contentTemplateOutlet: string | TemplateRef<MpSafeAny> | null = null;
  @Output() readonly delete = new EventEmitter<MouseEvent>();
  onDelete(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this.disabled) {
      this.delete.next(e);
    }
  }
}
