/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MpTimelineItemComponent } from './timeline-item.component';

const TimelineModes = ['left', 'alternate', 'right'] as const;
export type MpTimelineMode = typeof TimelineModes[number];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  selector: 'mp-timeline',
  exportAs: 'mpTimeline',
  template: `
    <ul
      class="ant-timeline"
      [class.ant-timeline-right]="mpMode === 'right'"
      [class.ant-timeline-alternate]="mpMode === 'alternate'"
      [class.ant-timeline-pending]="!!mpPending"
      [class.ant-timeline-reverse]="mpReverse"
    >
      <!-- User inserted timeline dots. -->
      <ng-container
        *ngIf="mpReverse"
        [ngTemplateOutlet]="pendingTemplate"
      ></ng-container>
      <ng-container *ngFor="let item of timelineItems">
        <ng-template [ngTemplateOutlet]="item.template"></ng-template>
      </ng-container>
      <ng-container
        *ngIf="!mpReverse"
        [ngTemplateOutlet]="pendingTemplate"
      ></ng-container>
      <!-- Pending dot. -->
    </ul>
    <ng-template #pendingTemplate>
      <li *ngIf="mpPending" class="ant-timeline-item ant-timeline-item-pending">
        <div class="ant-timeline-item-tail"></div>
        <div
          class="ant-timeline-item-head ant-timeline-item-head-custom ant-timeline-item-head-blue"
        >
          <ng-container *mpStringTemplateOutlet="mpPendingDot">
            {{ mpPendingDot
            }}<i *ngIf="!mpPendingDot" mp-icon mpType="loading"></i>
          </ng-container>
        </div>
        <div class="ant-timeline-item-content">
          <ng-container *mpStringTemplateOutlet="mpPending">
            {{ isPendingBoolean ? '' : mpPending }}
          </ng-container>
        </div>
      </li>
    </ng-template>
    <!-- Grasp items -->
    <ng-content></ng-content>
  `
})
export class MpTimelineComponent
  implements AfterContentInit, OnChanges, OnDestroy {
  @ContentChildren(MpTimelineItemComponent) listOfItems: QueryList<
    MpTimelineItemComponent
  >;

  @Input() mpMode: MpTimelineMode;
  @Input() mpPending: string | boolean | TemplateRef<void>;
  @Input() mpPendingDot: string | TemplateRef<void>;
  @Input() mpReverse: boolean = false;

  isPendingBoolean: boolean = false;
  timelineItems: MpTimelineItemComponent[] = [];

  private destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { mpMode, mpReverse, mpPending } = changes;

    if (simpleChangeActivated(mpMode) || simpleChangeActivated(mpReverse)) {
      this.updateChildren();
    }

    if (mpPending) {
      this.isPendingBoolean = mpPending.currentValue === true;
    }
  }

  ngAfterContentInit(): void {
    this.updateChildren();

    this.listOfItems.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateChildren();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateChildren(): void {
    if (this.listOfItems && this.listOfItems.length) {
      const length = this.listOfItems.length;
      this.listOfItems.forEach((item, index) => {
        item.isLast = !this.mpReverse ? index === length - 1 : index === 0;
        item.position =
          this.mpMode === 'left' || !this.mpMode
            ? undefined
            : this.mpMode === 'right'
            ? 'right'
            : this.mpMode === 'alternate' && index % 2 === 0
            ? 'left'
            : 'right';
        item.detectChanges();
      });
      this.timelineItems = this.mpReverse
        ? this.listOfItems.toArray().reverse()
        : this.listOfItems.toArray();
    }
    this.cdr.markForCheck();
  }
}

function simpleChangeActivated(simpleChange?: SimpleChange): boolean {
  return !!(
    simpleChange &&
    (simpleChange.previousValue !== simpleChange.currentValue ||
      simpleChange.isFirstChange())
  );
}
