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
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MpDirectionVHType } from '../core/types';

import { InputBoolean } from '../core/util';
import { Subscription } from 'rxjs';
import { MpListItemExtraComponent } from './list-item-cell';
import { MpListComponent } from './list.component';

@Component({
  selector: 'mp-list-item, [mp-list-item]',
  exportAs: 'mpListItem',
  template: `
    <ng-template #actionsTpl>
      <ul
        mp-list-item-actions
        *ngIf="mpActions?.length > 0"
        [mpActions]="mpActions"
      ></ul>
      <ng-content
        select="mp-list-item-actions, [mp-list-item-actions]"
      ></ng-content>
    </ng-template>
    <ng-template #contentTpl>
      <ng-content select="mp-list-item-meta, [mp-list-item-meta]"></ng-content>
      <ng-content></ng-content>
      <ng-container *ngIf="mpContent">
        <ng-container *mpStringTemplateOutlet="mpContent">{{
          mpContent
        }}</ng-container>
      </ng-container>
    </ng-template>
    <ng-template #extraTpl>
      <ng-content
        select="mp-list-item-extra, [mp-list-item-extra]"
      ></ng-content>
    </ng-template>
    <ng-template #simpleTpl>
      <ng-template [ngTemplateOutlet]="contentTpl"></ng-template>
      <ng-template [ngTemplateOutlet]="mpExtra"></ng-template>
      <ng-template [ngTemplateOutlet]="extraTpl"></ng-template>
      <ng-template [ngTemplateOutlet]="actionsTpl"></ng-template>
    </ng-template>

    <ng-container *ngIf="isVerticalAndExtra; else simpleTpl">
      <div class="ant-list-item-main">
        <ng-template [ngTemplateOutlet]="contentTpl"></ng-template>
        <ng-template [ngTemplateOutlet]="actionsTpl"></ng-template>
      </div>
      <mp-list-item-extra *ngIf="mpExtra">
        <ng-template [ngTemplateOutlet]="mpExtra"></ng-template>
      </mp-list-item-extra>
      <ng-template [ngTemplateOutlet]="extraTpl"></ng-template>
    </ng-container>
  `,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MpListItemComponent implements OnDestroy, AfterViewInit {
  @Input() mpActions: Array<TemplateRef<void>> = [];
  @Input() mpContent: string | TemplateRef<void>;
  @Input() mpExtra: TemplateRef<void>;
  @Input()
  @InputBoolean()
  @HostBinding('class.ant-list-item-no-flex')
  mpNoFlex: boolean = false;

  @ContentChild(MpListItemExtraComponent)
  listItemExtraDirective: MpListItemExtraComponent;

  private itemLayout: MpDirectionVHType;
  private itemLayout$: Subscription;

  get isVerticalAndExtra(): boolean {
    return (
      this.itemLayout === 'vertical' &&
      (!!this.listItemExtraDirective || !!this.mpExtra)
    );
  }

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    private parentComp: MpListComponent,
    private cdr: ChangeDetectorRef
  ) {
    renderer.addClass(elementRef.nativeElement, 'ant-list-item');
  }

  ngAfterViewInit(): void {
    this.itemLayout$ = this.parentComp.itemLayoutNotify$.subscribe(val => {
      this.itemLayout = val;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.itemLayout$) {
      this.itemLayout$.unsubscribe();
    }
  }
}
