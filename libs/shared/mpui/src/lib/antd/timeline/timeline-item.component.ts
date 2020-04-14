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
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { MpTimelineMode } from './timeline.component';

const TimelineTimeDefaultColors = [
  'red',
  'blue',
  'green',
  'grey',
  'gray'
] as const;
export type MpTimelineItemColor = typeof TimelineTimeDefaultColors[number];

function isDefaultColor(color?: string): boolean {
  return TimelineTimeDefaultColors.findIndex(i => i === color) !== -1;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  selector: 'mp-timeline-item, [mp-timeline-item]',
  exportAs: 'mpTimelineItem',
  template: `
    <ng-template #template>
      <li
        class="ant-timeline-item"
        [class.ant-timeline-item-right]="position === 'right'"
        [class.ant-timeline-item-left]="position === 'left'"
        [class.ant-timeline-item-last]="isLast"
      >
        <div class="ant-timeline-item-tail"></div>
        <div
          class="ant-timeline-item-head"
          [class.ant-timeline-item-head-red]="mpColor === 'red'"
          [class.ant-timeline-item-head-blue]="mpColor === 'blue'"
          [class.ant-timeline-item-head-green]="mpColor === 'green'"
          [class.ant-timeline-item-head-gray]="mpColor === 'gray'"
          [class.ant-timeline-item-head-custom]="!!mpDot"
          [style.border-color]="borderColor"
        >
          <ng-container *mpStringTemplateOutlet="mpDot">{{
            mpDot
          }}</ng-container>
        </div>
        <div class="ant-timeline-item-content">
          <ng-content></ng-content>
        </div>
      </li>
    </ng-template>
  `
})
export class MpTimelineItemComponent implements OnChanges {
  @ViewChild('template', { static: false }) template: TemplateRef<void>;

  @Input() mpColor: MpTimelineItemColor = 'blue';
  @Input() mpDot: string | TemplateRef<void>;

  isLast = false;
  borderColor: string | null = null;
  position: MpTimelineMode | undefined;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mpColor) {
      this.updateCustomColor();
    }
  }

  detectChanges(): void {
    this.cdr.detectChanges();
  }

  private updateCustomColor(): void {
    this.borderColor = isDefaultColor(this.mpColor) ? null : this.mpColor;
  }
}
