/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
/* tslint:disable:component-selector */
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
  SimpleChange,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { warnDeprecation } from '../../../core/logger';
import { InputBoolean } from '../../../core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  MpTableFilterFn,
  MpTableFilterList,
  MpTableFilterValue,
  MpTableSortFn,
  MpTableSortOrder
} from '../table.types';

@Component({
  selector:
    'th[mpSortKey], th[mpColumnKey], th[mpSort], th[mpSortFn], th[mpSortOrder], th[mpFilters], th[mpShowSort], th[mpShowFilter], th[mpCustomFilter]',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mp-table-filter
      *ngIf="mpShowFilter || mpCustomFilter; else notFilterTemplate"
      [contentTemplate]="notFilterTemplate"
      [extraTemplate]="extraTemplate"
      [customFilter]="mpCustomFilter"
      [filterMultiple]="mpFilterMultiple"
      [listOfFilter]="mpFilters"
      (filterChange)="onFilterValueChange($event)"
    ></mp-table-filter>
    <ng-template #notFilterTemplate>
      <ng-template
        [ngTemplateOutlet]="mpShowSort ? sortTemplate : contentTemplate"
      ></ng-template>
    </ng-template>
    <ng-template #extraTemplate>
      <ng-content select="[mp-th-extra]"></ng-content>
      <ng-content select="mp-filter-trigger"></ng-content>
    </ng-template>
    <ng-template #sortTemplate>
      <mp-table-sorters
        [sortOrder]="sortOrder"
        [sortDirections]="sortDirections"
        [contentTemplate]="contentTemplate"
      ></mp-table-sorters>
    </ng-template>
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
  host: {
    '[class.ant-table-column-has-sorters]': 'mpShowSort',
    '[class.ant-table-column-sort]': `sortOrder === 'descend' || sortOrder === 'ascend'`,
    '(click)': 'emitNextSortValue()'
  }
})
export class MpThAddOnComponent implements OnChanges, OnInit, OnDestroy {
  manualClickOrder$ = new Subject<MpThAddOnComponent>();
  calcOperatorChange$ = new Subject();
  mpFilterValue: MpTableFilterValue = null;
  sortOrder: MpTableSortOrder = null;
  sortDirections: MpTableSortOrder[] = ['ascend', 'descend', null];
  private sortOrderChange$ = new Subject<MpTableSortOrder>();
  private destroy$ = new Subject();
  private isMpShowSortChanged = false;
  private isMpShowFilterChanged = false;
  @Input() mpColumnKey: string;
  @Input() mpFilterMultiple = true;
  @Input() mpSortOrder: MpTableSortOrder = null;
  @Input() mpSortPriority: number | boolean = false;
  @Input() mpSortDirections: MpTableSortOrder[] = ['ascend', 'descend', null];
  @Input() mpFilters: MpTableFilterList = [];
  @Input() mpSortFn: MpTableSortFn | boolean | null = null;
  @Input() mpFilterFn: MpTableFilterFn | boolean | null = null;
  @Input() @InputBoolean() mpShowSort = false;
  @Input() @InputBoolean() mpShowFilter = false;
  @Input() @InputBoolean() mpCustomFilter = false;
  @Output() readonly mpCheckedChange = new EventEmitter<boolean>();
  @Output() readonly mpSortOrderChange = new EventEmitter<string | null>();
  @Output() readonly mpFilterChange = new EventEmitter<MpTableFilterValue>();
  /** @deprecated use mpColumnKey instead **/
  @Input() mpSortKey: string;
  /** @deprecated use mpSortOrder instead **/
  @Input() mpSort: MpTableSortOrder = null;
  /** @deprecated use mpSortOrderChange instead **/
  @Output() readonly mpSortChange = new EventEmitter<string | null>();

  getNextSortDirection(
    sortDirections: MpTableSortOrder[],
    current: MpTableSortOrder
  ): MpTableSortOrder {
    const index = sortDirections.indexOf(current);
    if (index === sortDirections.length - 1) {
      return sortDirections[0];
    } else {
      return sortDirections[index + 1];
    }
  }

  emitNextSortValue(): void {
    if (this.mpShowSort) {
      const nextOrder = this.getNextSortDirection(
        this.sortDirections,
        this.sortOrder!
      );
      this.setSortOrder(nextOrder);
      this.manualClickOrder$.next(this);
    }
  }

  setSortOrder(order: MpTableSortOrder): void {
    this.sortOrderChange$.next(order);
  }

  clearSortOrder(): void {
    if (this.sortOrder !== null) {
      this.setSortOrder(null);
    }
  }

  onFilterValueChange(value: MpTableFilterValue): void {
    this.mpFilterChange.emit(value);
    this.mpFilterValue = value;
    this.updateCalcOperator();
  }

  updateCalcOperator(): void {
    this.calcOperatorChange$.next();
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sortOrderChange$.pipe(takeUntil(this.destroy$)).subscribe(order => {
      if (this.sortOrder !== order) {
        this.sortOrder = order;
        this.mpSortChange.emit(order);
        this.mpSortOrderChange.emit(order);
      }
      this.updateCalcOperator();
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {
      mpSortKey,
      mpSort,
      mpSortDirections,
      mpFilters,
      mpSortOrder,
      mpSortFn,
      mpFilterFn,
      mpSortPriority,
      mpFilterMultiple,
      mpShowSort,
      mpShowFilter
    } = changes;
    if (mpSortDirections) {
      if (this.mpSortDirections && this.mpSortDirections.length) {
        this.sortDirections = this.mpSortDirections;
      }
    }
    if (mpSort) {
      this.sortOrder = this.mpSort;
      this.setSortOrder(this.mpSort);
      warnDeprecation(
        `'mpSort' and 'mpSortChange' is deprecated and will be removed in 10.0.0. Please use 'mpSortOrder' and 'mpSortOrderChange' instead.`
      );
    }
    if (mpSortKey) {
      this.mpColumnKey = this.mpSortKey;
      warnDeprecation(
        `'mpSortKey' is deprecated and will be removed in 10.0.0. Please use 'mpColumnKey' instead.`
      );
    }
    if (mpSortOrder) {
      this.sortOrder = this.mpSortOrder;
      this.setSortOrder(this.mpSortOrder);
    }
    if (mpShowSort) {
      this.isMpShowSortChanged = true;
    }
    if (mpShowFilter) {
      this.isMpShowFilterChanged = true;
    }
    const isFirstChange = (value: SimpleChange) =>
      value && value.firstChange && value.currentValue !== undefined;
    if (
      (isFirstChange(mpSortKey) ||
        isFirstChange(mpSort) ||
        isFirstChange(mpSortOrder) ||
        isFirstChange(mpSortFn)) &&
      !this.isMpShowSortChanged
    ) {
      this.mpShowSort = true;
    }
    if (isFirstChange(mpFilters) && !this.isMpShowFilterChanged) {
      this.mpShowFilter = true;
    }
    if ((mpFilters || mpFilterMultiple) && this.mpShowFilter) {
      const listOfValue = this.mpFilters
        .filter(item => item.byDefault)
        .map(item => item.value);
      this.mpFilterValue = this.mpFilterMultiple
        ? listOfValue
        : listOfValue[0] || null;
    }
    if (mpSortFn || mpFilterFn || mpSortPriority || mpFilters) {
      this.updateCalcOperator();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
