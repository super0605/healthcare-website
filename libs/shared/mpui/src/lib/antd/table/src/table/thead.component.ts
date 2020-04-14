/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
/* tslint:disable:component-selector */
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { warnDeprecation } from '../../../core/logger';
import { MpSafeAny } from '../../../core/types';

import { InputBoolean } from '../../../core/util';
import { EMPTY, merge, Observable, of, Subject } from 'rxjs';
import {
  delay,
  flatMap,
  map,
  startWith,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import { MpThAddOnComponent } from '../cell/th-addon.component';
import { MpTableDataService } from '../table-data.service';
import { MpTableStyleService } from '../table-style.service';
import { MpTrDirective } from './tr.directive';

@Component({
  selector: 'thead:not(.ant-table-thead)',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
    <ng-container *ngIf="!isInsideTable">
      <ng-template [ngTemplateOutlet]="contentTemplate"></ng-template>
    </ng-container>
  `
})
export class MpTheadComponent
  implements AfterContentInit, OnDestroy, AfterViewInit, OnInit, OnChanges {
  private destroy$ = new Subject<void>();
  isInsideTable = false;
  @ViewChild('contentTemplate', { static: true }) templateRef: TemplateRef<
    MpSafeAny
  >;
  @ContentChildren(MpTrDirective) listOfMpTrDirective: QueryList<MpTrDirective>;
  @ContentChildren(MpThAddOnComponent, { descendants: true })
  listOfMpThAddOnComponent: QueryList<MpThAddOnComponent>;
  /** @deprecated use mpSortFn and mpSortPriority instead **/
  @Input() @InputBoolean() mpSingleSort = false;
  /** @deprecated use mpSortOrderChange instead **/
  @Output() readonly mpSortChange = new EventEmitter<{
    key: MpSafeAny;
    value: string | null;
  }>();
  @Output() readonly mpSortOrderChange = new EventEmitter<{
    key: MpSafeAny;
    value: string | null;
  }>();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Optional() private mpTableStyleService: MpTableStyleService,
    @Optional() private mpTableDataService: MpTableDataService
  ) {
    this.isInsideTable = !!this.mpTableStyleService;
  }

  ngOnInit(): void {
    if (this.mpTableStyleService) {
      this.mpTableStyleService.setTheadTemplate(this.templateRef);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpSingleSort } = changes;
    if (mpSingleSort) {
      warnDeprecation(
        `'mpSingleSort' is deprecated and will be removed in 10.0.0. Please use use 'mpSortFn' and 'mpSortPriority' instead instead.`
      );
    }
  }

  ngAfterContentInit(): void {
    if (this.mpTableStyleService) {
      const firstTableRow$ = this.listOfMpTrDirective.changes.pipe(
        startWith(this.listOfMpTrDirective),
        map(item => item && item.first)
      ) as Observable<MpTrDirective>;
      const listOfColumnsChanges$ = firstTableRow$.pipe(
        switchMap(firstTableRow =>
          firstTableRow ? firstTableRow.listOfColumnsChanges$ : EMPTY
        ),
        takeUntil(this.destroy$)
      );
      listOfColumnsChanges$.subscribe(data =>
        this.mpTableStyleService.setListOfTh(data)
      );
      /** TODO: need reset the measure row when scrollX change **/
      this.mpTableStyleService.enableAutoMeasure$
        .pipe(switchMap(enable => (enable ? listOfColumnsChanges$ : of([]))))
        .pipe(takeUntil(this.destroy$))
        .subscribe(data =>
          this.mpTableStyleService.setListOfMeasureColumn(data)
        );
      const listOfFixedLeftColumnChanges$ = firstTableRow$.pipe(
        switchMap(firstTr =>
          firstTr ? firstTr.listOfFixedLeftColumnChanges$ : EMPTY
        ),
        takeUntil(this.destroy$)
      );
      const listOfFixedRightColumnChanges$ = firstTableRow$.pipe(
        switchMap(firstTr =>
          firstTr ? firstTr.listOfFixedRightColumnChanges$ : EMPTY
        ),
        takeUntil(this.destroy$)
      );
      listOfFixedLeftColumnChanges$.subscribe(listOfFixedLeftColumn => {
        this.mpTableStyleService.setHasFixLeft(
          listOfFixedLeftColumn.length !== 0
        );
      });
      listOfFixedRightColumnChanges$.subscribe(listOfFixedRightColumn => {
        this.mpTableStyleService.setHasFixRight(
          listOfFixedRightColumn.length !== 0
        );
      });
    }
    if (this.mpTableDataService) {
      const listOfColumn$ = this.listOfMpThAddOnComponent.changes.pipe(
        startWith(this.listOfMpThAddOnComponent)
      ) as Observable<QueryList<MpThAddOnComponent>>;
      const manualSort$ = listOfColumn$.pipe(
        switchMap(() =>
          merge(
            ...this.listOfMpThAddOnComponent.map(th => th.manualClickOrder$)
          )
        ),
        takeUntil(this.destroy$)
      );
      manualSort$.subscribe((data: MpThAddOnComponent) => {
        const emitValue = { key: data.mpColumnKey, value: data.sortOrder };
        this.mpSortChange.emit(emitValue);
        this.mpSortOrderChange.emit(emitValue);
        if (
          this.mpSingleSort ||
          (data.mpSortFn && data.mpSortPriority === false)
        ) {
          this.listOfMpThAddOnComponent
            .filter(th => th !== data)
            .forEach(th => th.clearSortOrder());
        }
      });
      const listOfCalcOperator$ = listOfColumn$.pipe(
        switchMap(list =>
          merge(
            ...[
              listOfColumn$,
              ...list.map((c: MpThAddOnComponent) => c.calcOperatorChange$)
            ]
          ).pipe(flatMap(() => listOfColumn$))
        ),
        map(list =>
          list
            .filter(item => !!item.mpSortFn || !!item.mpFilterFn)
            .map(item => {
              const {
                mpSortFn,
                sortOrder,
                mpFilterFn,
                mpFilterValue,
                mpSortPriority,
                mpColumnKey
              } = item;
              return {
                key: mpColumnKey,
                sortFn: mpSortFn,
                sortPriority: mpSortPriority,
                sortOrder: sortOrder!,
                filterFn: mpFilterFn!,
                filterValue: mpFilterValue
              };
            })
        ),
        // TODO: after checked error here
        delay(0)
      );
      listOfCalcOperator$.subscribe(list => {
        this.mpTableDataService.listOfCalcOperator$.next(list);
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.mpTableStyleService) {
      this.renderer.removeChild(
        this.renderer.parentNode(this.elementRef.nativeElement),
        this.elementRef.nativeElement
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
