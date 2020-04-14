/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MpConfigService, WithConfig } from '../../../core/config';
import { MpResizeObserver } from '../../../core/resize-observers';
import { MpSafeAny } from '../../../core/types';
import { InputBoolean, measureScrollbar } from '../../../core/util';
import { PaginationItemRenderContext } from '../../../pagination';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { MpTableDataService } from '../table-data.service';
import { MpTableStyleService } from '../table-style.service';
import {
  MpTableData,
  MpTableLayout,
  MpTablePaginationPosition,
  MpTableQueryParams,
  MpTableSize
} from '../table.types';
import { MpTableInnerScrollComponent } from './table-inner-scroll.component';
import { MpTableVirtualScrollDirective } from './table-virtual-scroll.directive';

const NZ_CONFIG_COMPONENT_NAME = 'table';

@Component({
  selector: 'mp-table',
  exportAs: 'mpTable',
  providers: [MpTableStyleService, MpTableDataService],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <mp-spin
      [mpDelay]="mpLoadingDelay"
      [mpSpinning]="mpLoading"
      [mpIndicator]="mpLoadingIndicator"
    >
      <ng-container
        *ngIf="
          mpPaginationPosition === 'both' || mpPaginationPosition === 'top'
        "
      >
        <ng-template [ngTemplateOutlet]="paginationTemplate"></ng-template>
      </ng-container>
      <div
        #tableMainElement
        class="ant-table"
        [class.ant-table-fixed-header]="mpData.length && scrollY"
        [class.ant-table-fixed-column]="scrollX"
        [class.ant-table-has-fix-left]="hasFixLeft"
        [class.ant-table-has-fix-right]="hasFixRight"
        [class.ant-table-bordered]="mpBordered"
        [class.ant-table-middle]="mpSize === 'middle'"
        [class.ant-table-small]="mpSize === 'small'"
      >
        <mp-table-title-footer
          [title]="mpTitle"
          *ngIf="mpTitle"
        ></mp-table-title-footer>
        <mp-table-inner-scroll
          *ngIf="scrollY || scrollX; else defaultTemplate"
          [data]="data"
          [scrollX]="scrollX"
          [scrollY]="scrollY"
          [contentTemplate]="contentTemplate"
          [listOfColWidth]="listOfColWidth"
          [theadTemplate]="theadTemplate"
          [verticalScrollBarWidth]="verticalScrollBarWidth"
          [virtualTemplate]="mpVirtualScrollDirective?.templateRef"
          [virtualItemSize]="mpVirtualItemSize"
          [virtualMaxBufferPx]="mpVirtualMaxBufferPx"
          [virtualMinBufferPx]="mpVirtualMinBufferPx"
          [tableMainElement]="tableMainElement"
          [virtualForTrackBy]="mpVirtualForTrackBy"
        ></mp-table-inner-scroll>
        <ng-template #defaultTemplate>
          <mp-table-inner-default
            [tableLayout]="mpTableLayout"
            [listOfColWidth]="listOfColWidth"
            [theadTemplate]="theadTemplate"
            [contentTemplate]="contentTemplate"
          ></mp-table-inner-default>
        </ng-template>
        <mp-table-title-footer
          [footer]="mpFooter"
          *ngIf="mpFooter"
        ></mp-table-title-footer>
      </div>
      <ng-container
        *ngIf="
          mpPaginationPosition === 'both' || mpPaginationPosition === 'bottom'
        "
      >
        <ng-template [ngTemplateOutlet]="paginationTemplate"></ng-template>
      </ng-container>
    </mp-spin>
    <ng-template #paginationTemplate>
      <mp-pagination
        *ngIf="mpShowPagination && data.length"
        class="ant-table-pagination ant-table-pagination-right"
        [mpShowSizeChanger]="mpShowSizeChanger"
        [mpPageSizeOptions]="mpPageSizeOptions"
        [mpItemRender]="mpItemRender"
        [mpShowQuickJumper]="mpShowQuickJumper"
        [mpHideOnSinglePage]="mpHideOnSinglePage"
        [mpShowTotal]="mpShowTotal"
        [mpSize]="mpSize === 'default' ? 'default' : 'small'"
        [mpPageSize]="mpPageSize"
        [mpTotal]="mpTotal"
        [mpSimple]="mpSimple"
        [mpPageIndex]="mpPageIndex"
        (mpPageSizeChange)="onPageSizeChange($event)"
        (mpPageIndexChange)="onPageIndexChange($event)"
      >
      </mp-pagination>
    </ng-template>
    <ng-template #contentTemplate><ng-content></ng-content></ng-template>
  `,
  host: {
    '[class.ant-table-wrapper]': 'true'
  }
})
export class MpTableComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() mpTableLayout: MpTableLayout = 'auto';
  @Input() mpShowTotal: TemplateRef<{
    $implicit: number;
    range: [number, number];
  }> | null = null;
  @Input() mpItemRender: TemplateRef<PaginationItemRenderContext> | null = null;
  @Input() mpLoadingIndicator: TemplateRef<MpSafeAny> | null = null;
  @Input() mpTitle: string | TemplateRef<MpSafeAny> | null = null;
  @Input() mpFooter: string | TemplateRef<MpSafeAny> | null = null;
  @Input() mpNoResult: string | TemplateRef<MpSafeAny> | undefined = undefined;
  @Input() mpPageSizeOptions = [10, 20, 30, 40, 50];
  @Input() mpVirtualItemSize = 0;
  @Input() mpVirtualMaxBufferPx = 200;
  @Input() mpVirtualMinBufferPx = 100;
  @Input() mpVirtualForTrackBy: TrackByFunction<MpTableData> = index => index;
  @Input() mpLoadingDelay = 0;
  @Input() mpPageIndex = 1;
  @Input() mpPageSize = 10;
  @Input() mpTotal = 0;
  @Input() mpWidthConfig: Array<string | null> = [];
  @Input() mpData: MpTableData[] = [];
  @Input() mpPaginationPosition: MpTablePaginationPosition = 'bottom';
  @Input() mpScroll: { x?: string | null; y?: string | null } = {
    x: null,
    y: null
  };
  @Input() @InputBoolean() mpFrontPagination = true;
  @Input() @InputBoolean() mpTemplateMode = false;
  @Input() @InputBoolean() mpShowPagination = true;
  @Input() @InputBoolean() mpLoading = false;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  @InputBoolean()
  mpBordered: boolean;
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'default') mpSize: MpTableSize;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  @InputBoolean()
  mpShowSizeChanger: boolean;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  @InputBoolean()
  mpHideOnSinglePage: boolean;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  @InputBoolean()
  mpShowQuickJumper: boolean;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  @InputBoolean()
  mpSimple: boolean;
  @Output() readonly mpPageSizeChange = new EventEmitter<number>();
  @Output() readonly mpPageIndexChange = new EventEmitter<number>();
  @Output() readonly mpQueryParams = new EventEmitter<MpTableQueryParams>();
  @Output() readonly mpCurrentPageDataChange = new EventEmitter<
    MpTableData[]
  >();

  /** public data for ngFor tr */
  public data: MpTableData[] = [];
  public cdkVirtualScrollViewport: CdkVirtualScrollViewport;
  scrollX: string | null = null;
  scrollY: string | null = null;
  theadTemplate: TemplateRef<MpSafeAny> | null = null;
  listOfColWidth: Array<string | null> = [];
  hasFixLeft = false;
  hasFixRight = false;
  private destroy$ = new Subject<void>();
  private loading$ = new BehaviorSubject<boolean>(false);
  private templateMode$ = new BehaviorSubject<boolean>(false);
  @ContentChild(MpTableVirtualScrollDirective, { static: false })
  mpVirtualScrollDirective: MpTableVirtualScrollDirective;
  @ViewChild(MpTableInnerScrollComponent)
  mpTableInnerScrollComponent: MpTableInnerScrollComponent;
  verticalScrollBarWidth = 0;
  onPageSizeChange(size: number): void {
    this.mpTableDataService.updatePageSize(size);
  }

  onPageIndexChange(index: number): void {
    this.mpTableDataService.updatePageIndex(index);
  }

  constructor(
    private elementRef: ElementRef,
    private mpResizeObserver: MpResizeObserver,
    private mpConfigService: MpConfigService,
    private cdr: ChangeDetectorRef,
    private mpTableStyleService: MpTableStyleService,
    private mpTableDataService: MpTableDataService
  ) {
    this.mpConfigService
      .getConfigChangeEventForComponent(NZ_CONFIG_COMPONENT_NAME)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  ngOnInit(): void {
    const {
      pageIndexDistinct$,
      pageSizeDistinct$,
      listOfCurrentPageData$,
      total$,
      queryParams$
    } = this.mpTableDataService;
    const {
      theadTemplate$,
      hasFixLeft$,
      hasFixRight$
    } = this.mpTableStyleService;
    queryParams$.pipe(takeUntil(this.destroy$)).subscribe(this.mpQueryParams);
    pageIndexDistinct$.pipe(takeUntil(this.destroy$)).subscribe(pageIndex => {
      if (pageIndex !== this.mpPageIndex) {
        this.mpPageIndex = pageIndex;
        this.mpPageIndexChange.next(pageIndex);
      }
    });
    pageSizeDistinct$.pipe(takeUntil(this.destroy$)).subscribe(pageSize => {
      if (pageSize !== this.mpPageSize) {
        this.mpPageSize = pageSize;
        this.mpPageSizeChange.next(pageSize);
      }
    });
    total$
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.mpFrontPagination)
      )
      .subscribe(total => {
        if (total !== this.mpTotal) {
          this.mpTotal = total;
          this.cdr.markForCheck();
        }
      });
    listOfCurrentPageData$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.data = data;
      this.mpCurrentPageDataChange.next(data);
      this.cdr.markForCheck();
    });

    theadTemplate$.pipe(takeUntil(this.destroy$)).subscribe(theadTemplate => {
      this.theadTemplate = theadTemplate;
      this.cdr.markForCheck();
    });

    hasFixLeft$.pipe(takeUntil(this.destroy$)).subscribe(hasFixLeft => {
      this.hasFixLeft = hasFixLeft;
      this.cdr.markForCheck();
    });

    hasFixRight$.pipe(takeUntil(this.destroy$)).subscribe(hasFixRight => {
      this.hasFixRight = hasFixRight;
      this.cdr.markForCheck();
    });

    combineLatest([total$, this.loading$, this.templateMode$])
      .pipe(
        map(
          ([total, loading, templateMode]) =>
            total === 0 && !loading && !templateMode
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(empty => {
        this.mpTableStyleService.setShowEmpty(empty);
      });

    this.verticalScrollBarWidth = measureScrollbar('vertical');
    this.mpTableStyleService.listOfListOfThWidthPx$
      .pipe(takeUntil(this.destroy$))
      .subscribe(listOfWidth => {
        this.listOfColWidth = listOfWidth;
        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {
      mpScroll,
      mpPageIndex,
      mpPageSize,
      mpFrontPagination,
      mpData,
      mpWidthConfig,
      mpNoResult,
      mpLoading,
      mpTemplateMode
    } = changes;
    if (mpPageIndex) {
      this.mpTableDataService.updatePageIndex(this.mpPageIndex);
    }
    if (mpPageSize) {
      this.mpTableDataService.updatePageSize(this.mpPageSize);
    }
    if (mpData) {
      this.mpData = this.mpData || [];
      this.mpTableDataService.updateListOfData(this.mpData);
    }
    if (mpFrontPagination) {
      this.mpTableDataService.updateFrontPagination(this.mpFrontPagination);
    }
    if (mpScroll) {
      this.scrollX = (this.mpScroll && this.mpScroll.x) || null;
      this.scrollY = (this.mpScroll && this.mpScroll.y) || null;
      this.mpTableStyleService.setScroll(this.scrollX, this.scrollY);
    }
    if (mpWidthConfig) {
      this.mpTableStyleService.setTableWidthConfig(this.mpWidthConfig);
    }
    if (mpLoading) {
      this.loading$.next(this.mpLoading);
    }
    if (mpTemplateMode) {
      this.templateMode$.next(this.mpTemplateMode);
    }
    if (mpNoResult) {
      this.mpTableStyleService.setNoResult(this.mpNoResult);
    }
  }

  ngAfterViewInit(): void {
    this.mpResizeObserver
      .observe(this.elementRef)
      .pipe(
        map(([entry]) => {
          const { width } = entry.target.getBoundingClientRect();
          const scrollBarWidth = this.scrollY ? this.verticalScrollBarWidth : 0;
          return Math.floor(width - scrollBarWidth);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(this.mpTableStyleService.hostWidth$);
    if (
      this.mpTableInnerScrollComponent &&
      this.mpTableInnerScrollComponent.cdkVirtualScrollViewport
    ) {
      this.cdkVirtualScrollViewport = this.mpTableInnerScrollComponent.cdkVirtualScrollViewport;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
