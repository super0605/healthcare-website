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
  Component,
  ContentChild,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MpDirectionVHType, MpSafeAny, MpSizeLDSType } from '../core/types';
import { InputBoolean } from '../core/util';
import { BehaviorSubject, Observable } from 'rxjs';
import { MpListGrid } from './interface';
import {
  MpListFooterComponent,
  MpListLoadMoreDirective,
  MpListPaginationComponent
} from './list-cell';

@Component({
  selector: 'mp-list, [mp-list]',
  exportAs: 'mpList',
  template: `
    <ng-template #itemsTpl>
      <div class="ant-list-items">
        <ng-container *ngFor="let item of mpDataSource; let index = index">
          <ng-template
            [ngTemplateOutlet]="mpRenderItem"
            [ngTemplateOutletContext]="{ $implicit: item, index: index }"
          ></ng-template>
        </ng-container>
        <ng-content select="mp-list-item, [mp-list-item]"></ng-content>
      </div>
    </ng-template>

    <mp-list-header *ngIf="mpHeader">
      <ng-container *mpStringTemplateOutlet="mpHeader">{{
        mpHeader
      }}</ng-container>
    </mp-list-header>
    <ng-content select="mp-list-header"></ng-content>

    <mp-spin [mpSpinning]="mpLoading">
      <ng-container>
        <div
          *ngIf="mpLoading && mpDataSource && mpDataSource.length === 0"
          [style.min-height.px]="53"
        ></div>
        <div
          *ngIf="mpGrid && mpDataSource; else itemsTpl"
          mp-row
          [mpGutter]="mpGrid.gutter"
        >
          <div
            mp-col
            [mpSpan]="mpGrid.span"
            [mpXs]="mpGrid.xs"
            [mpSm]="mpGrid.sm"
            [mpMd]="mpGrid.md"
            [mpLg]="mpGrid.lg"
            [mpXl]="mpGrid.xl"
            [mpXXl]="mpGrid.xxl"
            *ngFor="let item of mpDataSource; let index = index"
          >
            <ng-template
              [ngTemplateOutlet]="mpRenderItem"
              [ngTemplateOutletContext]="{ $implicit: item, index: index }"
            ></ng-template>
          </div>
        </div>
        <mp-list-empty
          *ngIf="!mpLoading && mpDataSource && mpDataSource.length === 0"
          [mpNoResult]="mpNoResult"
        ></mp-list-empty>
      </ng-container>
      <ng-content></ng-content>
    </mp-spin>

    <mp-list-footer *ngIf="mpFooter">
      <ng-container *mpStringTemplateOutlet="mpFooter">{{
        mpFooter
      }}</ng-container>
    </mp-list-footer>
    <ng-content select="mp-list-footer, [mp-list-footer]"></ng-content>

    <ng-template [ngTemplateOutlet]="mpLoadMore"></ng-template>
    <ng-content select="mp-list-load-more, [mp-list-load-more]"></ng-content>

    <mp-list-pagination *ngIf="mpPagination">
      <ng-template [ngTemplateOutlet]="mpPagination"></ng-template>
    </mp-list-pagination>
    <ng-content select="mp-list-pagination, [mp-list-pagination]"></ng-content>
  `,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ant-list]': 'true',
    '[class.ant-list-vertical]': 'mpItemLayout === "vertical"',
    '[class.ant-list-lg]': 'mpSize === "large"',
    '[class.ant-list-sm]': 'mpSize === "small"',
    '[class.ant-list-split]': 'mpSplit',
    '[class.ant-list-bordered]': 'mpBordered',
    '[class.ant-list-loading]': 'mpLoading',
    '[class.ant-list-something-after-last-item]': 'hasSomethingAfterLastItem'
  }
})
export class MpListComponent implements AfterContentInit, OnChanges, OnDestroy {
  @Input() mpDataSource: MpSafeAny[];
  @Input() @InputBoolean() mpBordered = false;
  @Input() mpGrid: MpListGrid;
  @Input() mpHeader: string | TemplateRef<void>;
  @Input() mpFooter: string | TemplateRef<void>;
  @Input() mpItemLayout: MpDirectionVHType = 'horizontal';
  @Input() mpRenderItem: TemplateRef<void>;
  @Input() @InputBoolean() mpLoading = false;
  @Input() mpLoadMore: TemplateRef<void>;
  @Input() mpPagination: TemplateRef<void>;
  @Input() mpSize: MpSizeLDSType = 'default';
  @Input() @InputBoolean() mpSplit = true;
  @Input() mpNoResult: string | TemplateRef<void>;

  @ContentChild(MpListFooterComponent)
  mpListFooterComponent: MpListFooterComponent;
  @ContentChild(MpListPaginationComponent)
  mpListPaginationComponent: MpListPaginationComponent;
  @ContentChild(MpListLoadMoreDirective)
  mpListLoadMoreDirective: MpListLoadMoreDirective;

  hasSomethingAfterLastItem = false;

  private itemLayoutNotifySource = new BehaviorSubject<MpDirectionVHType>(
    this.mpItemLayout
  );

  get itemLayoutNotify$(): Observable<MpDirectionVHType> {
    return this.itemLayoutNotifySource.asObservable();
  }

  constructor() {}

  getSomethingAfterLastItem(): boolean {
    return !!(
      this.mpLoadMore ||
      this.mpPagination ||
      this.mpFooter ||
      this.mpListFooterComponent ||
      this.mpListPaginationComponent ||
      this.mpListLoadMoreDirective
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mpItemLayout) {
      this.itemLayoutNotifySource.next(this.mpItemLayout);
    }
  }

  ngOnDestroy(): void {
    this.itemLayoutNotifySource.unsubscribe();
  }

  ngAfterContentInit(): void {
    this.hasSomethingAfterLastItem = this.getSomethingAfterLastItem();
  }
}
