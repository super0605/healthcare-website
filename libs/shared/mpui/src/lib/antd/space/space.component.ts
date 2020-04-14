/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  OnDestroy,
  QueryList
} from '@angular/core';
import { MpConfigService, WithConfig } from '../core/config';

import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { MpSpaceItemComponent } from './space-item.component';
import { MpSpaceDirection, MpSpaceSize } from './types';

const NZ_CONFIG_COMPONENT_NAME = 'avatar';

@Component({
  selector: 'mp-space',
  exportAs: 'MpSpace',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
  `,
  host: {
    class: 'ant-space',
    '[class.ant-space-horizontal]': 'mpDirection === "horizontal"',
    '[class.ant-space-vertical]': 'mpDirection === "vertical"'
  }
})
export class MpSpaceComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() mpDirection: MpSpaceDirection = 'horizontal';
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'small') mpSize:
    | number
    | MpSpaceSize;

  @ContentChildren(MpSpaceItemComponent) mpSpaceItemComponents: QueryList<
    MpSpaceItemComponent
  >;

  private destroy$ = new Subject();

  constructor(public mpConfigService: MpConfigService) {}

  private updateSpaceItems(): void {
    if (this.mpSpaceItemComponents) {
      this.mpSpaceItemComponents.forEach(item => {
        item.setDirectionAndSize(this.mpDirection, this.mpSize);
      });
    }
  }

  ngOnChanges(): void {
    this.updateSpaceItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.mpSpaceItemComponents.changes
      .pipe(
        startWith(null),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateSpaceItems();
      });
  }
}
