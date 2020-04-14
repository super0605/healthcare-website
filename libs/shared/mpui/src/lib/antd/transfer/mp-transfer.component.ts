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
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../core/types';
import { InputBoolean, toArray } from '../core/util';
import { MpI18nService } from '../i18n';

import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  TransferCanMove,
  TransferChange,
  TransferDirection,
  TransferItem,
  TransferSearchChange,
  TransferSelectChange
} from './interface';
import { MpTransferListComponent } from './mp-transfer-list.component';

@Component({
  selector: 'mp-transfer',
  exportAs: 'mpTransfer',
  preserveWhitespaces: false,
  templateUrl: './mp-transfer.component.html',
  host: {
    '[class]': 'hostClassMap'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MpTransferComponent implements OnInit, OnChanges, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @ViewChildren(MpTransferListComponent)
  private lists!: QueryList<MpTransferListComponent>;
  locale: MpSafeAny = {};
  hostClassMap = {};

  leftFilter = '';
  rightFilter = '';

  // #region fields

  @Input() @InputBoolean() mpDisabled = false;
  @Input() mpDataSource: TransferItem[] = [];
  @Input() mpTitles: string[] = ['', ''];
  @Input() mpOperations: string[] = [];
  @Input() mpListStyle: object;
  @Input() @InputBoolean() mpShowSelectAll = true;
  @Input() mpItemUnit: string;
  @Input() mpItemsUnit: string;
  @Input() mpCanMove: (arg: TransferCanMove) => Observable<TransferItem[]> = (
    arg: TransferCanMove
  ) => of(arg.list);
  @Input() mpRenderList: Array<TemplateRef<void> | null> = [null, null];
  @Input() mpRender: TemplateRef<void>;
  @Input() mpFooter: TemplateRef<void>;
  @Input() @InputBoolean() mpShowSearch = false;
  @Input() mpFilterOption: (inputValue: string, item: TransferItem) => boolean;
  @Input() mpSearchPlaceholder: string;
  @Input() mpNotFoundContent: string;
  @Input() mpTargetKeys: string[] = [];

  // events
  @Output() readonly mpChange = new EventEmitter<TransferChange>();
  @Output() readonly mpSearchChange = new EventEmitter<TransferSearchChange>();
  @Output() readonly mpSelectChange = new EventEmitter<TransferSelectChange>();

  // #endregion

  // #region process data

  // left
  leftDataSource: TransferItem[] = [];

  // right
  rightDataSource: TransferItem[] = [];

  private splitDataSource(): void {
    this.leftDataSource = [];
    this.rightDataSource = [];
    this.mpDataSource.forEach(record => {
      if (record.direction === 'right') {
        record.direction = 'right';
        this.rightDataSource.push(record);
      } else {
        record.direction = 'left';
        this.leftDataSource.push(record);
      }
    });
  }

  private getCheckedData(direction: TransferDirection): TransferItem[] {
    return this[
      direction === 'left' ? 'leftDataSource' : 'rightDataSource'
    ].filter(w => w.checked);
  }

  handleLeftSelectAll = (checked: boolean) =>
    this.handleSelect('left', checked);
  handleRightSelectAll = (checked: boolean) =>
    this.handleSelect('right', checked);

  handleLeftSelect = (item: TransferItem) =>
    this.handleSelect('left', !!item.checked, item);
  handleRightSelect = (item: TransferItem) =>
    this.handleSelect('right', !!item.checked, item);

  handleSelect(
    direction: TransferDirection,
    checked: boolean,
    item?: TransferItem
  ): void {
    const list = this.getCheckedData(direction);
    this.updateOperationStatus(direction, list.length);
    this.mpSelectChange.emit({ direction, checked, list, item });
  }

  handleFilterChange(ret: {
    direction: TransferDirection;
    value: string;
  }): void {
    this.mpSearchChange.emit(ret);
  }

  // #endregion

  // #region operation

  leftActive = false;
  rightActive = false;

  private updateOperationStatus(
    direction: TransferDirection,
    count?: number
  ): void {
    this[direction === 'right' ? 'leftActive' : 'rightActive'] =
      (typeof count === 'undefined'
        ? this.getCheckedData(direction).filter(w => !w.disabled).length
        : count) > 0;
  }

  moveToLeft = () => this.moveTo('left');
  moveToRight = () => this.moveTo('right');

  moveTo(direction: TransferDirection): void {
    const oppositeDirection = direction === 'left' ? 'right' : 'left';
    this.updateOperationStatus(oppositeDirection, 0);
    const datasource =
      direction === 'left' ? this.rightDataSource : this.leftDataSource;
    const moveList = datasource.filter(
      item => item.checked === true && !item.disabled
    );
    this.mpCanMove({ direction, list: moveList }).subscribe(
      newMoveList => this.truthMoveTo(direction, newMoveList.filter(i => !!i)),
      () => moveList.forEach(i => (i.checked = false))
    );
  }

  private truthMoveTo(
    direction: TransferDirection,
    list: TransferItem[]
  ): void {
    const oppositeDirection = direction === 'left' ? 'right' : 'left';
    const datasource =
      direction === 'left' ? this.rightDataSource : this.leftDataSource;
    const targetDatasource =
      direction === 'left' ? this.leftDataSource : this.rightDataSource;
    for (const item of list) {
      item.checked = false;
      item.hide = false;
      item.direction = direction;
      datasource.splice(datasource.indexOf(item), 1);
    }
    targetDatasource.splice(0, 0, ...list);
    this.updateOperationStatus(oppositeDirection);
    this.mpChange.emit({
      from: oppositeDirection,
      to: direction,
      list
    });
    this.markForCheckAllList();
  }

  // #endregion

  constructor(private cdr: ChangeDetectorRef, private i18n: MpI18nService) {}

  private setClassMap(): void {
    const prefixCls = 'ant-transfer';
    this.hostClassMap = {
      [`${prefixCls}`]: true,
      [`${prefixCls}-disabled`]: this.mpDisabled,
      [`${prefixCls}-customize-list`]: this.mpRenderList.some(i => !!i)
    };
  }

  private markForCheckAllList(): void {
    if (!this.lists) {
      return;
    }
    this.lists.forEach(i => i.markForCheck());
  }

  private handleMpTargetKeys(): void {
    const keys = toArray(this.mpTargetKeys);
    const hasOwnKey = (e: TransferItem) => e.hasOwnProperty('key');
    this.leftDataSource.forEach(e => {
      if (hasOwnKey(e) && keys.indexOf(e.key) !== -1 && !e.disabled) {
        e.checked = true;
      }
    });
    this.moveToRight();
  }

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Transfer');
      this.markForCheckAllList();
    });
    this.setClassMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setClassMap();
    if (changes.mpDataSource) {
      this.splitDataSource();
      this.updateOperationStatus('left');
      this.updateOperationStatus('right');
      this.cdr.detectChanges();
      this.markForCheckAllList();
    }
    if (changes.mpTargetKeys) {
      this.handleMpTargetKeys();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
