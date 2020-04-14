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
  Host,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { collapseMotion } from '../core/animation';

import { MpConfigService, WithConfig } from '../core/config';
import { InputBoolean } from '../core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MpCollapseComponent } from './collapse.component';

const NZ_CONFIG_COMPONENT_NAME = 'collapsePanel';

@Component({
  selector: 'mp-collapse-panel',
  exportAs: 'mpCollapsePanel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [collapseMotion],
  template: `
    <div
      role="tab"
      [attr.aria-expanded]="mpActive"
      class="ant-collapse-header"
      (click)="clickHeader()"
    >
      <ng-container *ngIf="mpShowArrow">
        <ng-container *mpStringTemplateOutlet="mpExpandedIcon">
          <i
            mp-icon
            [mpType]="mpExpandedIcon || 'right'"
            class="ant-collapse-arrow"
            [mpRotate]="mpActive ? 90 : 0"
          ></i>
        </ng-container>
      </ng-container>
      <ng-container *mpStringTemplateOutlet="mpHeader">{{
        mpHeader
      }}</ng-container>
      <div class="ant-collapse-extra" *ngIf="mpExtra">
        <ng-container *mpStringTemplateOutlet="mpExtra">{{
          mpExtra
        }}</ng-container>
      </div>
    </div>
    <div
      class="ant-collapse-content"
      [class.ant-collapse-content-active]="mpActive"
      [@collapseMotion]="mpActive ? 'expanded' : 'hidden'"
    >
      <div class="ant-collapse-content-box">
        <ng-content></ng-content>
      </div>
    </div>
  `,

  host: {
    '[class.ant-collapse-item]': 'true',
    '[class.ant-collapse-no-arrow]': '!mpShowArrow',
    '[class.ant-collapse-item-active]': 'mpActive',
    '[class.ant-collapse-item-disabled]': 'mpDisabled'
  }
})
export class MpCollapsePanelComponent implements OnInit, OnDestroy {
  @Input() @InputBoolean() mpActive = false;
  @Input() @InputBoolean() mpDisabled = false;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, true)
  @InputBoolean()
  mpShowArrow: boolean;
  @Input() mpExtra: string | TemplateRef<void>;
  @Input() mpHeader: string | TemplateRef<void>;
  @Input() mpExpandedIcon: string | TemplateRef<void>;
  @Output() readonly mpActiveChange = new EventEmitter<boolean>();
  private destroy$ = new Subject();
  clickHeader(): void {
    if (!this.mpDisabled) {
      this.mpCollapseComponent.click(this);
    }
  }

  markForCheck(): void {
    this.cdr.markForCheck();
  }

  constructor(
    public mpConfigService: MpConfigService,
    private cdr: ChangeDetectorRef,
    @Host() private mpCollapseComponent: MpCollapseComponent
  ) {
    this.mpConfigService
      .getConfigChangeEventForComponent(NZ_CONFIG_COMPONENT_NAME)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  ngOnInit(): void {
    this.mpCollapseComponent.addPanel(this);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.mpCollapseComponent.removePanel(this);
  }
}
