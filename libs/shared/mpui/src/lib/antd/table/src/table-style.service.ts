/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Injectable, TemplateRef } from '@angular/core';
import { MpSafeAny } from '../../core/types';
import { BehaviorSubject, combineLatest, merge, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MpThMeasureDirective } from './cell/th-measure.directive';

@Injectable()
export class MpTableStyleService {
  theadTemplate$ = new ReplaySubject<TemplateRef<MpSafeAny>>(1);
  hasFixLeft$ = new ReplaySubject<boolean>(1);
  hasFixRight$ = new ReplaySubject<boolean>(1);
  hostWidth$ = new ReplaySubject<number>(1);
  columnCount$ = new ReplaySubject<number>(1);
  showEmpty$ = new ReplaySubject<boolean>(1);
  noResult$ = new ReplaySubject<string | TemplateRef<MpSafeAny> | undefined>(1);
  private listOfThWidthConfigPx$ = new BehaviorSubject<Array<string | null>>(
    []
  );
  private tableWidthConfigPx$ = new BehaviorSubject<Array<string | null>>([]);
  private manualWidthConfigPx$ = combineLatest([
    this.tableWidthConfigPx$,
    this.listOfThWidthConfigPx$
  ]).pipe(
    map(([widthConfig, listOfWidth]) =>
      widthConfig.length ? widthConfig : listOfWidth
    )
  );
  private listOfAutoWidthPx$ = new ReplaySubject<string[]>(1);
  listOfListOfThWidthPx$ = merge(
    this.manualWidthConfigPx$,
    combineLatest([this.listOfAutoWidthPx$, this.manualWidthConfigPx$]).pipe(
      map(([autoWidth, manualWidth]) => {
        /** use autoWidth until column length match **/
        return autoWidth.length !== manualWidth.length
          ? manualWidth
          : autoWidth;
      })
    )
  );
  listOfMeasureColumn$ = new ReplaySubject<string[]>(1);
  listOfListOfThWidth$ = this.listOfAutoWidthPx$.pipe(
    map(list => list.map(width => parseInt(width, 10)))
  );
  enableAutoMeasure$ = new ReplaySubject<boolean>(1);

  setTheadTemplate(template: TemplateRef<MpSafeAny>): void {
    this.theadTemplate$.next(template);
  }

  setHasFixLeft(hasFixLeft: boolean): void {
    this.hasFixLeft$.next(hasFixLeft);
  }

  setHasFixRight(hasFixRight: boolean): void {
    this.hasFixRight$.next(hasFixRight);
  }

  setTableWidthConfig(widthConfig: Array<string | null>): void {
    this.tableWidthConfigPx$.next(widthConfig);
  }

  setListOfTh(listOfTh: MpThMeasureDirective[]): void {
    let columnCount = 0;
    listOfTh.forEach(th => {
      columnCount += th.colspan || 1;
    });
    const listOfThPx = listOfTh.map(item => item.mpWidth);
    this.columnCount$.next(columnCount);
    this.listOfThWidthConfigPx$.next(listOfThPx);
  }

  setListOfMeasureColumn(listOfTh: MpThMeasureDirective[]): void {
    const listOfKeys: string[] = [];
    listOfTh.forEach(th => {
      const length = th.colspan || 1;
      for (let i = 0; i < length; i++) {
        listOfKeys.push(`measure_key_${i}`);
      }
    });
    this.listOfMeasureColumn$.next(listOfKeys);
  }

  setListOfAutoWidth(listOfAutoWidth: number[]): void {
    this.listOfAutoWidthPx$.next(listOfAutoWidth.map(width => `${width}px`));
  }

  setShowEmpty(showEmpty: boolean): void {
    this.showEmpty$.next(showEmpty);
  }

  setNoResult(noResult: string | TemplateRef<MpSafeAny> | undefined): void {
    this.noResult$.next(noResult);
  }

  setScroll(scrollX: string | null, scrollY: string | null): void {
    const enableAutoMeasure = !!(scrollX || scrollY);
    if (!enableAutoMeasure) {
      this.setListOfAutoWidth([]);
    }
    this.enableAutoMeasure$.next(enableAutoMeasure);
  }

  constructor() {}
}
