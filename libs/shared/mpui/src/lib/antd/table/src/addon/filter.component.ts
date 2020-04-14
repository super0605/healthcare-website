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
import { MpSafeAny } from '../../../core/types';
import { MpI18nInterface, MpI18nService } from '../../../i18n';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MpTableFilterList } from '../table.types';

interface MpThItemInterface {
  text: string;
  value: MpSafeAny;
  checked: boolean;
}

@Component({
  selector: 'mp-table-filter',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="ant-table-filter-column-title">
      <ng-template [ngTemplateOutlet]="contentTemplate"></ng-template>
    </span>
    <ng-container *ngIf="!customFilter; else extraTemplate">
      <mp-filter-trigger
        [mpVisible]="isVisible"
        [mpActive]="isChecked"
        [mpDropdownMenu]="filterMenu"
        (mpVisibleChange)="onVisibleChange($event)"
      >
        <i mp-icon mpType="filter" mpTheme="fill"></i>
      </mp-filter-trigger>
      <mp-dropdown-menu #filterMenu="mpDropdownMenu">
        <div class="ant-table-filter-dropdown">
          <ul mp-menu>
            <li
              mp-menu-item
              [mpSelected]="f.checked"
              *ngFor="let f of listOfParsedFilter; trackBy: trackByValue"
              (click)="check(f)"
            >
              <label
                mp-radio
                *ngIf="!filterMultiple"
                [ngModel]="f.checked"
                (ngModelChange)="check(f)"
              ></label>
              <label
                mp-checkbox
                *ngIf="filterMultiple"
                [ngModel]="f.checked"
                (ngModelChange)="check(f)"
              ></label>
              <span>{{ f.text }}</span>
            </li>
          </ul>
          <div class="ant-table-filter-dropdown-btns">
            <button
              mp-button
              mpType="link"
              mpSize="small"
              (click)="reset()"
              [disabled]="!isChecked"
            >
              {{ locale.filterReset }}
            </button>
            <button
              mp-button
              mpType="primary"
              mpSize="small"
              (click)="confirm()"
            >
              {{ locale.filterConfirm }}
            </button>
          </div>
        </div>
      </mp-dropdown-menu>
    </ng-container>
  `,
  host: {
    '[class.ant-table-filter-column]': 'true'
  }
})
export class MpTableFilterComponent implements OnChanges, OnDestroy, OnInit {
  @Input() contentTemplate: TemplateRef<MpSafeAny> | null = null;
  @Input() customFilter = false;
  @Input() extraTemplate: TemplateRef<MpSafeAny> | null = null;
  @Input() filterMultiple = true;
  @Input() listOfFilter: MpTableFilterList = [];
  @Output() readonly filterChange = new EventEmitter<MpSafeAny[] | MpSafeAny>();
  private destroy$ = new Subject();
  locale: MpI18nInterface['Table'] = {} as MpI18nInterface['Table'];
  isChanged = false;
  isChecked = false;
  isVisible = false;
  listOfParsedFilter: MpThItemInterface[] = [];

  trackByValue(_: number, item: MpThItemInterface): MpSafeAny {
    return item.value;
  }

  check(filter: MpThItemInterface): void {
    this.isChanged = true;
    if (this.filterMultiple) {
      this.listOfParsedFilter = this.listOfParsedFilter.map(item => {
        if (item === filter) {
          return { ...item, checked: !filter.checked };
        } else {
          return item;
        }
      });
      filter.checked = !filter.checked;
    } else {
      this.listOfParsedFilter = this.listOfParsedFilter.map(item => {
        return { ...item, checked: item === filter };
      });
    }
    this.isChecked = this.getCheckedStatus(this.listOfParsedFilter);
  }

  confirm(): void {
    this.isVisible = false;
    this.emitFilterData();
  }

  reset(): void {
    this.isChanged = true;
    this.isVisible = false;
    this.listOfParsedFilter = this.parseListOfFilter(this.listOfFilter, true);
    this.isChecked = this.getCheckedStatus(this.listOfParsedFilter);
    this.emitFilterData();
  }

  onVisibleChange(value: boolean): void {
    this.isVisible = value;
    if (!value) {
      this.emitFilterData();
    }
  }

  emitFilterData(): void {
    if (this.isChanged) {
      const listOfChecked = this.listOfParsedFilter
        .filter(item => item.checked)
        .map(item => item.value);
      if (this.filterMultiple) {
        this.filterChange.emit(listOfChecked);
      } else {
        this.filterChange.emit(listOfChecked[0] || null);
      }
      this.isChanged = false;
    }
  }

  parseListOfFilter(
    listOfFilter: MpTableFilterList,
    reset?: boolean
  ): MpThItemInterface[] {
    return listOfFilter.map(item => {
      const checked = reset ? false : !!item.byDefault;
      return { text: item.text, value: item.value, checked };
    });
  }

  getCheckedStatus(listOfParsedFilter: MpThItemInterface[]): boolean {
    return listOfParsedFilter.some(item => item.checked);
  }

  constructor(private cdr: ChangeDetectorRef, private i18n: MpI18nService) {}

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Table');
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { listOfFilter } = changes;
    if (listOfFilter && this.listOfFilter && this.listOfFilter.length) {
      this.listOfParsedFilter = this.parseListOfFilter(this.listOfFilter);
      this.isChecked = this.getCheckedStatus(this.listOfParsedFilter);
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
