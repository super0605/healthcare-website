/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../core/types';
import { MpSelectItemInterface, MpSelectModeType } from './select.types';

@Component({
  selector: 'mp-option-container',
  exportAs: 'mpOptionContainer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  template: `
    <div>
      <div
        *ngIf="listOfContainerItem.length === 0"
        class="ant-select-item-empty"
      >
        <mp-embed-empty
          mpComponentName="select"
          [specificContent]="notFoundContent"
        ></mp-embed-empty>
      </div>
      <cdk-virtual-scroll-viewport
        [itemSize]="itemSize"
        [maxBufferPx]="itemSize * maxItemLength"
        [minBufferPx]="itemSize * maxItemLength"
        (scrolledIndexChange)="onScrolledIndexChange($event)"
        [style.height.px]="listOfContainerItem.length * itemSize"
        [style.max-height.px]="itemSize * maxItemLength"
      >
        <div
          *cdkVirtualFor="let item of listOfContainerItem; trackBy: trackValue"
        >
          <ng-container [ngSwitch]="item.type">
            <mp-option-item-group
              *ngSwitchCase="'group'"
              [mpLabel]="item.groupLabel"
            ></mp-option-item-group>
            <mp-option-item
              *ngSwitchCase="'item'"
              [icon]="menuItemSelectedIcon"
              [customContent]="item.mpCustomContent"
              [template]="item.template"
              [grouped]="!!item.groupLabel"
              [disabled]="item.mpDisabled"
              [showState]="mode === 'tags' || mode === 'multiple'"
              [label]="item.mpLabel"
              [compareWith]="compareWith"
              [activatedValue]="activatedValue"
              [listOfSelectedValue]="listOfSelectedValue"
              [value]="item.mpValue"
              (itemHover)="onItemHover($event)"
              (itemClick)="onItemClick($event)"
            ></mp-option-item>
          </ng-container>
        </div>
      </cdk-virtual-scroll-viewport>
      <ng-template [ngTemplateOutlet]="dropdownRender"></ng-template>
    </div>
  `,
  host: {
    '[class.ant-select-dropdown]': 'true'
  }
})
export class MpOptionContainerComponent implements OnChanges {
  @Input() notFoundContent: string | undefined = undefined;
  @Input() menuItemSelectedIcon: TemplateRef<MpSafeAny> | null = null;
  @Input() dropdownRender: TemplateRef<MpSafeAny> | null = null;
  @Input() activatedValue: MpSafeAny | null = null;
  @Input() listOfSelectedValue: MpSafeAny[] = [];
  @Input() compareWith: (o1: MpSafeAny, o2: MpSafeAny) => boolean;
  @Input() mode: MpSelectModeType = 'default';
  @Input() listOfContainerItem: MpSelectItemInterface[] = [];
  @Output() readonly itemClick = new EventEmitter<MpSafeAny>();
  @Output() readonly itemHover = new EventEmitter<MpSafeAny>();
  @Output() readonly scrollToBottom = new EventEmitter<void>();
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  cdkVirtualScrollViewport: CdkVirtualScrollViewport;
  private scrolledIndex = 0;
  readonly itemSize = 32;
  readonly maxItemLength = 8;

  onItemClick(value: MpSafeAny): void {
    this.itemClick.emit(value);
  }

  onItemHover(value: MpSafeAny): void {
    // TODO: bug when mouse inside the option container & keydown
    this.itemHover.emit(value);
  }

  trackValue(_index: number, option: MpSelectItemInterface): MpSafeAny {
    return option.key;
  }

  onScrolledIndexChange(index: number): void {
    this.scrolledIndex = index;
    if (index === this.listOfContainerItem.length - this.maxItemLength) {
      this.scrollToBottom.emit();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { listOfContainerItem, activatedValue } = changes;
    if (listOfContainerItem || activatedValue) {
      const index = this.listOfContainerItem.findIndex(item =>
        this.compareWith(item.key, this.activatedValue)
      );
      if (
        index < this.scrolledIndex ||
        index >= this.scrolledIndex + this.maxItemLength
      ) {
        this.cdkVirtualScrollViewport.scrollToIndex(index || 0);
      }
    }
  }
}
