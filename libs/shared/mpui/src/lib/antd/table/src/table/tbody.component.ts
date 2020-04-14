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
  Component,
  Optional,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../../../core/types';
import { BehaviorSubject } from 'rxjs';
import { MpTableStyleService } from '../table-style.service';

@Component({
  selector: 'tbody',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <tr
      mp-table-measure-row
      *ngIf="isInsideTable && (listOfMeasureColumn$ | async)!.length"
      [listOfMeasureColumn]="listOfMeasureColumn$ | async"
      (listOfAutoWidth)="onListOfAutoWidthChange($event)"
    ></tr>
    <ng-content></ng-content>
    <tr
      class="ant-table-placeholder"
      mp-table-fixed-row
      *ngIf="showEmpty$ | async"
    >
      <mp-embed-empty
        mpComponentName="table"
        [specificContent]="noResult$ | async"
      ></mp-embed-empty>
    </tr>
  `,
  host: {
    '[class.ant-table-tbody]': 'isInsideTable'
  }
})
export class MpTbodyComponent {
  isInsideTable = false;
  showEmpty$ = new BehaviorSubject<boolean>(false);
  noResult$ = new BehaviorSubject<string | TemplateRef<MpSafeAny> | undefined>(
    undefined
  );
  listOfMeasureColumn$ = new BehaviorSubject<string[]>([]);

  constructor(@Optional() private mpTableStyleService: MpTableStyleService) {
    this.isInsideTable = !!this.mpTableStyleService;
    if (this.mpTableStyleService) {
      const {
        showEmpty$,
        noResult$,
        listOfMeasureColumn$
      } = this.mpTableStyleService;
      noResult$.subscribe(this.noResult$);
      listOfMeasureColumn$.subscribe(this.listOfMeasureColumn$);
      showEmpty$.subscribe(this.showEmpty$);
    }
  }

  onListOfAutoWidthChange(listOfAutoWidth: number[]): void {
    this.mpTableStyleService.setListOfAutoWidth(listOfAutoWidth);
  }
}
