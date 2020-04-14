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
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import {
  gridResponsiveMap,
  MpBreakpointEnum,
  MpBreakpointService
} from '../core/services';
import { MpSafeAny } from '../core/types';
import { InputBoolean, InputNumber } from '../core/util';
import { MpI18nService } from '../i18n';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PaginationItemRenderContext } from './pagination.types';

@Component({
  selector: 'mp-pagination',
  exportAs: 'mpPagination',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="showPagination">
      <ng-container *ngIf="mpSimple; else defaultPagination.template">
        <ng-template
          [ngTemplateOutlet]="simplePagination.template"
        ></ng-template>
      </ng-container>
    </ng-container>
    <mp-pagination-simple
      #simplePagination
      [disabled]="mpDisabled"
      [itemRender]="mpItemRender"
      [locale]="locale"
      [pageSize]="mpPageSize"
      [total]="mpTotal"
      [pageIndex]="mpPageIndex"
      (pageIndexChange)="onPageIndexChange($event)"
    ></mp-pagination-simple>
    <mp-pagination-default
      #defaultPagination
      [mpSize]="size"
      [itemRender]="mpItemRender"
      [showTotal]="mpShowTotal"
      [disabled]="mpDisabled"
      [locale]="locale"
      [showSizeChanger]="mpShowSizeChanger"
      [showQuickJumper]="mpShowQuickJumper"
      [total]="mpTotal"
      [pageIndex]="mpPageIndex"
      [pageSize]="mpPageSize"
      [pageSizeOptions]="mpPageSizeOptions"
      (pageIndexChange)="onPageIndexChange($event)"
      (pageSizeChange)="onPageSizeChange($event)"
    ></mp-pagination-default>
  `,
  host: {
    '[class.ant-pagination]': 'true',
    '[class.ant-pagination-simple]': 'mpSimple',
    '[class.ant-pagination-disabled]': 'mpDisabled',
    '[class.mini]': `!mpSimple && size === 'small'`
  }
})
export class MpPaginationComponent implements OnInit, OnDestroy, OnChanges {
  @Output() readonly mpPageSizeChange: EventEmitter<
    number
  > = new EventEmitter();
  @Output() readonly mpPageIndexChange: EventEmitter<
    number
  > = new EventEmitter();
  @Input() mpShowTotal: TemplateRef<{
    $implicit: number;
    range: [number, number];
  }> | null = null;
  @Input() mpSize: 'default' | 'small' = 'default';
  @Input() mpPageSizeOptions = [10, 20, 30, 40];
  @Input() mpItemRender: TemplateRef<PaginationItemRenderContext>;
  @Input() @InputBoolean() mpDisabled = false;
  @Input() @InputBoolean() mpShowSizeChanger = false;
  @Input() @InputBoolean() mpHideOnSinglePage = false;
  @Input() @InputBoolean() mpShowQuickJumper = false;
  @Input() @InputBoolean() mpSimple = false;
  @Input() @InputBoolean() mpResponsive = false;
  @Input() @InputNumber() mpTotal = 0;
  @Input() @InputNumber() mpPageIndex = 1;
  @Input() @InputNumber() mpPageSize = 10;

  showPagination = true;
  locale: MpSafeAny = {};
  size: 'default' | 'small' = 'default';

  private destroy$ = new Subject<void>();
  private total$ = new ReplaySubject<number>(1);

  validatePageIndex(value: number, lastIndex: number): number {
    if (value > lastIndex) {
      return lastIndex;
    } else if (value < 1) {
      return 1;
    } else {
      return value;
    }
  }

  onPageIndexChange(index: number): void {
    const lastIndex = this.getLastIndex(this.mpTotal, this.mpPageSize);
    const validIndex = this.validatePageIndex(index, lastIndex);
    if (validIndex !== this.mpPageIndex && !this.mpDisabled) {
      this.mpPageIndex = validIndex;
      this.mpPageIndexChange.emit(this.mpPageIndex);
    }
  }

  onPageSizeChange(size: number): void {
    this.mpPageSize = size;
    this.mpPageSizeChange.emit(size);
    const lastIndex = this.getLastIndex(this.mpTotal, this.mpPageSize);
    if (this.mpPageIndex > lastIndex) {
      this.onPageIndexChange(lastIndex);
    }
  }

  onTotalChange(total: number): void {
    const lastIndex = this.getLastIndex(total, this.mpPageSize);
    if (this.mpPageIndex > lastIndex) {
      Promise.resolve().then(() => this.onPageIndexChange(lastIndex));
    }
  }

  getLastIndex(total: number, pageSize: number): number {
    return Math.ceil(total / pageSize);
  }

  constructor(
    private i18n: MpI18nService,
    private cdr: ChangeDetectorRef,
    private breakpointService: MpBreakpointService
  ) {}

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Pagination');
      this.cdr.markForCheck();
    });

    this.total$.pipe(takeUntil(this.destroy$)).subscribe(total => {
      this.onTotalChange(total);
    });

    this.breakpointService
      .subscribe(gridResponsiveMap)
      .pipe(takeUntil(this.destroy$))
      .subscribe(bp => {
        if (this.mpResponsive) {
          this.size = bp === MpBreakpointEnum.xs ? 'small' : 'default';
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpHideOnSinglePage, mpTotal, mpPageSize, mpSize } = changes;
    if (mpTotal) {
      this.total$.next(this.mpTotal);
    }
    if (mpHideOnSinglePage || mpTotal || mpPageSize) {
      this.showPagination =
        (this.mpHideOnSinglePage && this.mpTotal > this.mpPageSize) ||
        (this.mpTotal > 0 && !this.mpHideOnSinglePage);
    }

    if (mpSize) {
      this.size = mpSize.currentValue;
    }
  }
}
