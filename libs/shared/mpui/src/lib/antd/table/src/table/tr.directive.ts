/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterContentInit,
  ContentChildren,
  Directive,
  OnDestroy,
  Optional,
  QueryList
} from '@angular/core';
import { combineLatest, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { flatMap, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { MpCellFixedDirective } from '../cell/cell-fixed.directive';
import { MpThMeasureDirective } from '../cell/th-measure.directive';
import { MpTableStyleService } from '../table-style.service';

@Directive({
  selector:
    'tr:not([mat-row]):not([mat-header-row]):not([mp-table-measure-row]):not([mpExpand]):not([mp-table-fixed-row])',
  host: {
    '[class.ant-table-row]': 'isInsideTable'
  }
})
export class MpTrDirective implements AfterContentInit, OnDestroy {
  @ContentChildren(MpThMeasureDirective) listOfMpThDirective: QueryList<
    MpThMeasureDirective
  >;
  @ContentChildren(MpCellFixedDirective) listOfCellFixedDirective: QueryList<
    MpCellFixedDirective
  >;
  private destroy$ = new Subject<void>();
  private listOfFixedColumns$ = new ReplaySubject<MpCellFixedDirective[]>(1);
  private listOfColumns$ = new ReplaySubject<MpThMeasureDirective[]>(1);
  listOfFixedColumnsChanges$: Observable<
    MpCellFixedDirective[]
  > = this.listOfFixedColumns$.pipe(
    switchMap(list =>
      merge(
        ...[
          this.listOfFixedColumns$,
          ...list.map((c: MpCellFixedDirective) => c.changes$)
        ]
      ).pipe(flatMap(() => this.listOfFixedColumns$))
    ),
    takeUntil(this.destroy$)
  );
  listOfFixedLeftColumnChanges$ = this.listOfFixedColumnsChanges$.pipe(
    map(list => list.filter(item => item.mpLeft !== false))
  );
  listOfFixedRightColumnChanges$ = this.listOfFixedColumnsChanges$.pipe(
    map(list => list.filter(item => item.mpRight !== false))
  );
  listOfColumnsChanges$: Observable<
    MpThMeasureDirective[]
  > = this.listOfColumns$.pipe(
    switchMap(list =>
      merge(
        ...[
          this.listOfColumns$,
          ...list.map((c: MpThMeasureDirective) => c.changes$)
        ]
      ).pipe(flatMap(() => this.listOfColumns$))
    ),
    takeUntil(this.destroy$)
  );
  isInsideTable = false;

  constructor(@Optional() private mpTableStyleService: MpTableStyleService) {
    this.isInsideTable = !!mpTableStyleService;
  }

  ngAfterContentInit(): void {
    if (this.mpTableStyleService) {
      this.listOfCellFixedDirective.changes
        .pipe(
          startWith(this.listOfCellFixedDirective),
          takeUntil(this.destroy$)
        )
        .subscribe(this.listOfFixedColumns$);
      this.listOfMpThDirective.changes
        .pipe(
          startWith(this.listOfMpThDirective),
          takeUntil(this.destroy$)
        )
        .subscribe(this.listOfColumns$);
      /** set last left and first right **/
      this.listOfFixedLeftColumnChanges$.subscribe(listOfFixedLeft => {
        listOfFixedLeft.forEach(cell =>
          cell.setIsLastLeft(
            cell === listOfFixedLeft[listOfFixedLeft.length - 1]
          )
        );
      });
      this.listOfFixedRightColumnChanges$.subscribe(listOfFixedRight => {
        listOfFixedRight.forEach(cell =>
          cell.setIsFirstRight(cell === listOfFixedRight[0])
        );
      });
      /** calculate fixed mpLeft and mpRight **/
      combineLatest([
        this.mpTableStyleService.listOfListOfThWidth$,
        this.listOfFixedLeftColumnChanges$
      ]).subscribe(([listOfAutoWidth, listOfLeftCell]) => {
        listOfLeftCell.forEach((cell, index) => {
          if (cell.isAutoLeft) {
            const currentArray = listOfLeftCell.slice(0, index);
            const count = currentArray.reduce(
              (pre, cur) => pre + (cur.colspan || 1),
              0
            );
            const width = listOfAutoWidth
              .slice(0, count)
              .reduce((pre, cur) => pre + cur, 0);
            cell.setAutoLeftWidth(`${width}px`);
          }
        });
      });
      combineLatest([
        this.mpTableStyleService.listOfListOfThWidth$,
        this.listOfFixedRightColumnChanges$
      ]).subscribe(([listOfAutoWidth, listOfRightCell]) => {
        listOfRightCell.forEach((_, index) => {
          const cell = listOfRightCell[listOfRightCell.length - index - 1];
          if (cell.isAutoRight) {
            const currentArray = listOfRightCell.slice(
              listOfRightCell.length - index,
              listOfRightCell.length
            );
            const count = currentArray.reduce(
              (pre, cur) => pre + (cur.colspan || 1),
              0
            );
            const width = listOfAutoWidth
              .slice(listOfAutoWidth.length - count, listOfAutoWidth.length)
              .reduce((pre, cur) => pre + cur, 0);
            cell.setAutoRightWidth(`${width}px`);
          }
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
