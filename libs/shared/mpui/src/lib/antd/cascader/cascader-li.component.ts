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
  ElementRef,
  Input,
  Renderer2,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { MpCascaderOption } from './typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: '[mp-cascader-option]',
  exportAs: 'mpCascaderOption',
  template: `
    <ng-container *ngIf="optionTemplate; else defaultOptionTemplate">
      <ng-template
        [ngTemplateOutlet]="optionTemplate"
        [ngTemplateOutletContext]="{ $implicit: option, index: columnIndex }"
      ></ng-template>
    </ng-container>
    <ng-template #defaultOptionTemplate>
      <span
        [innerHTML]="
          optionLabel
            | mpHighlight: highlightText:'g':'ant-cascader-menu-item-keyword'
        "
      ></span>
    </ng-template>
    <span
      *ngIf="!option.isLeaf || option.children?.length || option.loading"
      class="ant-cascader-menu-item-expand-icon"
    >
      <i mp-icon [mpType]="option.loading ? 'loading' : 'right'"></i>
    </span>
  `,
  host: {
    '[attr.title]': 'option.title || optionLabel',
    '[class.ant-cascader-menu-item-active]': 'activated',
    '[class.ant-cascader-menu-item-expand]': '!option.isLeaf',
    '[class.ant-cascader-menu-item-disabled]': 'option.disabled'
  }
})
export class MpCascaderOptionComponent {
  @Input() optionTemplate: TemplateRef<MpCascaderOption> | null = null;
  @Input() option: MpCascaderOption;
  @Input() activated = false;
  @Input() highlightText: string;
  @Input() mpLabelProperty = 'label';
  @Input() columnIndex: number;

  constructor(
    private cdr: ChangeDetectorRef,
    elementRef: ElementRef,
    renderer: Renderer2
  ) {
    renderer.addClass(elementRef.nativeElement, 'ant-cascader-menu-item');
  }

  get optionLabel(): string {
    return this.option[this.mpLabelProperty];
  }

  markForCheck(): void {
    this.cdr.markForCheck();
  }
}
