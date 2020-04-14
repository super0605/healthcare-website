/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { Location } from '@angular/common';
import { MpConfigService, WithConfig } from '../core/config';
import {
  MpPageHeaderBreadcrumbDirective,
  MpPageHeaderFooterDirective
} from './page-header-cells';

const NZ_CONFIG_COMPONENT_NAME = 'pageHeader';

@Component({
  selector: 'mp-page-header',
  exportAs: 'mpPageHeader',
  template: `
    <ng-content select="mp-breadcrumb[mp-page-header-breadcrumb]"></ng-content>

    <div class="ant-page-header-heading">
      <!--back-->
      <div
        *ngIf="mpBackIcon !== null"
        (click)="onBack()"
        class="ant-page-header-back"
      >
        <div role="button" tabindex="0" class="ant-page-header-back-button">
          <i
            *ngIf="isStringBackIcon"
            mp-icon
            [mpType]="mpBackIcon ? mpBackIcon : 'arrow-left'"
            mpTheme="outline"
          ></i>
          <ng-container
            *ngIf="isTemplateRefBackIcon"
            [ngTemplateOutlet]="mpBackIcon"
          ></ng-container>
        </div>
      </div>
      <!--avatar-->
      <ng-content select="mp-avatar[mp-page-header-avatar]"></ng-content>
      <!--title-->
      <span class="ant-page-header-heading-title" *ngIf="mpTitle">
        <ng-container *mpStringTemplateOutlet="mpTitle">{{
          mpTitle
        }}</ng-container>
      </span>
      <ng-content
        *ngIf="!mpTitle"
        select="mp-page-header-title, [mp-page-header-title]"
      ></ng-content>
      <!--subtitle-->
      <span class="ant-page-header-heading-sub-title" *ngIf="mpSubtitle">
        <ng-container *mpStringTemplateOutlet="mpSubtitle">{{
          mpSubtitle
        }}</ng-container>
      </span>
      <ng-content
        *ngIf="!mpSubtitle"
        select="mp-page-header-subtitle, [mp-page-header-subtitle]"
      ></ng-content>
      <ng-content
        select="mp-page-header-tags, [mp-page-header-tags]"
      ></ng-content>
      <ng-content
        select="mp-page-header-extra, [mp-page-header-extra]"
      ></ng-content>
    </div>

    <ng-content
      select="mp-page-header-content, [mp-page-header-content]"
    ></ng-content>
    <ng-content
      select="mp-page-header-footer, [mp-page-header-footer]"
    ></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ant-page-header',
    '[class.has-footer]': 'mpPageHeaderFooter',
    '[class.ant-page-header-ghost]': 'mpGhost',
    '[class.has-breadcrumb]': 'mpPageHeaderBreadcrumb'
  }
})
export class MpPageHeaderComponent implements OnChanges {
  isTemplateRefBackIcon = false;
  isStringBackIcon = false;

  @Input() mpBackIcon: string | TemplateRef<void> | null = null;
  @Input() mpTitle: string | TemplateRef<void>;
  @Input() mpSubtitle: string | TemplateRef<void>;
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME, true) mpGhost: boolean;
  @Output() readonly mpBack = new EventEmitter<void>();

  @ContentChild(MpPageHeaderFooterDirective, { static: false })
  mpPageHeaderFooter: ElementRef<MpPageHeaderFooterDirective>;

  @ContentChild(MpPageHeaderBreadcrumbDirective, { static: false })
  mpPageHeaderBreadcrumb: ElementRef<MpPageHeaderBreadcrumbDirective>;

  constructor(
    private location: Location,
    public mpConfigService: MpConfigService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('mpBackIcon')) {
      this.isTemplateRefBackIcon =
        changes.mpBackIcon.currentValue instanceof TemplateRef;
      this.isStringBackIcon =
        typeof changes.mpBackIcon.currentValue === 'string';
    }
  }

  onBack(): void {
    if (this.mpBack.observers.length) {
      this.mpBack.emit();
    } else {
      this.location.back();
    }
  }
}
