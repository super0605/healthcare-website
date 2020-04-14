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
  ContentChild,
  ContentChildren,
  Input,
  OnDestroy,
  QueryList,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MpConfigService, WithConfig } from '../core/config';
import { MpSizeDSType } from '../core/types';
import { InputBoolean } from '../core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MpCardGridDirective } from './card-grid.directive';
import { MpCardTabComponent } from './card-tab.component';

const NZ_CONFIG_COMPONENT_NAME = 'card';

@Component({
  selector: 'mp-card',
  exportAs: 'mpCard',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="ant-card-head"
      *ngIf="mpTitle || mpExtra || listOfMpCardTabComponent"
    >
      <div class="ant-card-head-wrapper">
        <div class="ant-card-head-title" *ngIf="mpTitle">
          <ng-container *mpStringTemplateOutlet="mpTitle">{{
            mpTitle
          }}</ng-container>
        </div>
        <div class="ant-card-extra" *ngIf="mpExtra">
          <ng-container *mpStringTemplateOutlet="mpExtra">{{
            mpExtra
          }}</ng-container>
        </div>
      </div>
      <ng-container *ngIf="listOfMpCardTabComponent">
        <ng-template
          [ngTemplateOutlet]="listOfMpCardTabComponent.template"
        ></ng-template>
      </ng-container>
    </div>
    <div class="ant-card-cover" *ngIf="mpCover">
      <ng-template [ngTemplateOutlet]="mpCover"></ng-template>
    </div>
    <div class="ant-card-body" [ngStyle]="mpBodyStyle">
      <ng-container *ngIf="!mpLoading; else loadingTemplate">
        <ng-content></ng-content>
      </ng-container>
      <ng-template #loadingTemplate>
        <mp-card-loading></mp-card-loading>
      </ng-template>
    </div>
    <ul class="ant-card-actions" *ngIf="mpActions.length">
      <li
        *ngFor="let action of mpActions"
        [style.width.%]="100 / mpActions.length"
      >
        <span><ng-template [ngTemplateOutlet]="action"></ng-template></span>
      </li>
    </ul>
  `,
  host: {
    '[class.ant-card]': 'true',
    '[class.ant-card-loading]': 'mpLoading',
    '[class.ant-card-bordered]': 'mpBordered',
    '[class.ant-card-hoverable]': 'mpHoverable',
    '[class.ant-card-small]': 'mpSize === "small"',
    '[class.ant-card-contain-grid]':
      'listOfMpCardGridDirective && listOfMpCardGridDirective.length',
    '[class.ant-card-type-inner]': 'mpType === "inner"',
    '[class.ant-card-contain-tabs]': '!!listOfMpCardTabComponent'
  }
})
export class MpCardComponent implements OnDestroy {
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, true)
  @InputBoolean()
  mpBordered: boolean;
  @Input() @InputBoolean() mpLoading = false;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  @InputBoolean()
  mpHoverable: boolean;
  @Input() mpBodyStyle: { [key: string]: string };
  @Input() mpCover: TemplateRef<void>;
  @Input() mpActions: Array<TemplateRef<void>> = [];
  @Input() mpType: string | 'inner' | null = null;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'default')
  mpSize: MpSizeDSType;
  @Input() mpTitle: string | TemplateRef<void>;
  @Input() mpExtra: string | TemplateRef<void>;
  @ContentChild(MpCardTabComponent, { static: false })
  listOfMpCardTabComponent: MpCardTabComponent;
  @ContentChildren(MpCardGridDirective) listOfMpCardGridDirective: QueryList<
    MpCardGridDirective
  >;
  private destroy$ = new Subject();

  constructor(
    public mpConfigService: MpConfigService,
    private cdr: ChangeDetectorRef
  ) {
    this.mpConfigService
      .getConfigChangeEventForComponent(NZ_CONFIG_COMPONENT_NAME)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
