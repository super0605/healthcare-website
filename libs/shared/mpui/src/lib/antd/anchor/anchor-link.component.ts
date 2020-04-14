/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Platform } from '@angular/cdk/platform';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { MpSafeAny } from '../core/types';
import { MpAnchorComponent } from './anchor.component';

@Component({
  selector: 'mp-link',
  exportAs: 'mpLink',
  preserveWhitespaces: false,
  template: `
    <a
      #linkTitle
      (click)="goToClick($event)"
      href="{{ mpHref }}"
      class="ant-anchor-link-title"
      title="{{ titleStr }}"
    >
      <span *ngIf="titleStr; else titleTpl || mpTemplate">{{ titleStr }}</span>
    </a>
    <ng-content></ng-content>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MpAnchorLinkComponent implements OnInit, OnDestroy {
  @Input() mpHref = '#';

  titleStr: string | null = '';
  titleTpl: TemplateRef<MpSafeAny>;

  @Input()
  set mpTitle(value: string | TemplateRef<void>) {
    if (value instanceof TemplateRef) {
      this.titleStr = null;
      this.titleTpl = value;
    } else {
      this.titleStr = value;
    }
  }

  @ContentChild('mpTemplate', { static: false }) mpTemplate: TemplateRef<void>;
  @ViewChild('linkTitle') linkTitle: ElementRef<HTMLAnchorElement>;

  constructor(
    public elementRef: ElementRef,
    private anchorComp: MpAnchorComponent,
    private platform: Platform,
    private renderer: Renderer2
  ) {
    this.renderer.addClass(elementRef.nativeElement, 'ant-anchor-link');
  }

  ngOnInit(): void {
    this.anchorComp.registerLink(this);
  }

  getLinkTitleElement(): HTMLAnchorElement {
    return this.linkTitle.nativeElement;
  }

  setActive(): void {
    this.renderer.addClass(
      this.elementRef.nativeElement,
      'ant-anchor-link-active'
    );
  }

  unsetActive(): void {
    this.renderer.removeClass(
      this.elementRef.nativeElement,
      'ant-anchor-link-active'
    );
  }

  goToClick(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    if (this.platform.isBrowser) {
      this.anchorComp.handleScrollTo(this);
    }
  }

  ngOnDestroy(): void {
    this.anchorComp.unregisterLink(this);
  }
}
