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
  Input,
  Renderer2,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import {
  MpListItemMetaDescriptionComponent as DescriptionComponent,
  MpListItemMetaTitleComponent as TitleComponent
} from './list-item-meta-cell';

@Component({
  selector: 'mp-list-item-meta, [mp-list-item-meta]',
  exportAs: 'mpListItemMeta',
  template: `
    <!--Old API Start-->
    <mp-list-item-meta-avatar
      *ngIf="avatarStr"
      [mpSrc]="avatarStr"
    ></mp-list-item-meta-avatar>
    <mp-list-item-meta-avatar *ngIf="avatarTpl">
      <ng-container [ngTemplateOutlet]="avatarTpl"></ng-container>
    </mp-list-item-meta-avatar>
    <!--Old API End-->

    <ng-content select="mp-list-item-meta-avatar"></ng-content>

    <div
      *ngIf="mpTitle || mpDescription || descriptionComponent || titleComponent"
      class="ant-list-item-meta-content"
    >
      <!--Old API Start-->
      <mp-list-item-meta-title *ngIf="mpTitle && !titleComponent">
        <ng-container *mpStringTemplateOutlet="mpTitle">{{
          mpTitle
        }}</ng-container>
      </mp-list-item-meta-title>
      <mp-list-item-meta-description
        *ngIf="mpDescription && !descriptionComponent"
      >
        <ng-container *mpStringTemplateOutlet="mpDescription">{{
          mpDescription
        }}</ng-container>
      </mp-list-item-meta-description>
      <!--Old API End-->

      <ng-content select="mp-list-item-meta-title"></ng-content>
      <ng-content select="mp-list-item-meta-description"></ng-content>
    </div>
  `,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MpListItemMetaComponent {
  avatarStr = '';
  avatarTpl: TemplateRef<void>;

  @Input()
  set mpAvatar(value: string | TemplateRef<void>) {
    if (value instanceof TemplateRef) {
      this.avatarStr = '';
      this.avatarTpl = value;
    } else {
      this.avatarStr = value;
    }
  }

  @Input() mpTitle: string | TemplateRef<void>;

  @Input() mpDescription: string | TemplateRef<void>;

  @ContentChild(DescriptionComponent)
  descriptionComponent: DescriptionComponent;
  @ContentChild(TitleComponent) titleComponent: TitleComponent;
  constructor(public elementRef: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(elementRef.nativeElement, 'ant-list-item-meta');
  }
}
