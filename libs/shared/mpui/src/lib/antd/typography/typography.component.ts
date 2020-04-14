/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { MpConfigService, WithConfig } from '../core/config';
import { cancelRequestAnimationFrame, reqAnimFrame } from '../core/polyfill';
import { MpResizeService } from '../core/services';
import { MpSafeAny } from '../core/types';
import {
  InputBoolean,
  InputNumber,
  isStyleSupport,
  measure
} from '../core/util';

import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MpI18nService } from '../i18n';

import { MpTextCopyComponent } from './text-copy.component';
import { MpTextEditComponent } from './text-edit.component';

const NZ_CONFIG_COMPONENT_NAME = 'typography';
const EXPAND_ELEMENT_CLASSNAME = 'ant-typography-expand';

@Component({
  selector: `
  mp-typography,
  [mp-typography],
  p[mp-paragraph],
  span[mp-text],
  h1[mp-title], h2[mp-title], h3[mp-title], h4[mp-title]
  `,
  exportAs: 'mpTypography',
  template: `
    <ng-template #contentTemplate let-content="content">
      <ng-content *ngIf="!content"></ng-content>
      {{ content }}
    </ng-template>

    <ng-container *ngIf="!editing">
      <ng-container
        *ngIf="
          expanded ||
          (!mpExpandable && !mpSuffix && mpEllipsisRows === 1) ||
          canCssEllipsis
        "
      >
        <ng-template
          [ngTemplateOutlet]="contentTemplate"
          [ngTemplateOutletContext]="{ content: mpContent }"
        ></ng-template>
      </ng-container>
      <ng-container
        *ngIf="
          (mpEllipsis && !expanded && (mpEllipsisRows > 1 || mpExpandable)) ||
          mpSuffix
        "
      >
        <span #ellipsisContainer *ngIf="!expanded"></span>
        <ng-container *ngIf="isEllipsis">{{ ellipsisStr }}</ng-container>
        <ng-container *ngIf="mpSuffix">{{ mpSuffix }}</ng-container>
        <a
          #expandable
          *ngIf="mpExpandable && isEllipsis"
          class="ant-typography-expand"
          (click)="onExpand()"
          >{{ locale?.expand }}</a
        >
      </ng-container>
    </ng-container>

    <mp-text-edit
      *ngIf="mpEditable"
      [text]="mpContent"
      (endEditing)="onEndEditing($event)"
      (startEditing)="onStartEditing()"
    >
    </mp-text-edit>

    <mp-text-copy
      *ngIf="mpCopyable && !editing"
      [text]="copyText"
      (textCopy)="onTextCopy($event)"
    ></mp-text-copy>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  host: {
    '[class.ant-typography]': '!editing',
    '[class.ant-typography-edit-content]': 'editing',
    '[class.ant-typography-secondary]': 'mpType === "secondary"',
    '[class.ant-typography-warning]': 'mpType === "warning"',
    '[class.ant-typography-danger]': 'mpType === "danger"',
    '[class.ant-typography-disabled]': 'mpDisabled',
    '[class.ant-typography-ellipsis]': 'mpEllipsis && !expanded',
    '[class.ant-typography-ellipsis-single-line]':
      'canCssEllipsis && mpEllipsisRows === 1',
    '[class.ant-typography-ellipsis-multiple-line]':
      'canCssEllipsis && mpEllipsisRows > 1',
    '[style.-webkit-line-clamp]':
      '(canCssEllipsis && mpEllipsisRows > 1) ? mpEllipsisRows : null'
  }
})
export class MpTypographyComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() @InputBoolean() mpCopyable = false;
  @Input() @InputBoolean() mpEditable = false;
  @Input() @InputBoolean() mpDisabled = false;
  @Input() @InputBoolean() mpExpandable = false;
  @Input() @InputBoolean() mpEllipsis = false;
  @Input() mpContent: string;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 1)
  @InputNumber()
  mpEllipsisRows: number;
  @Input() mpType: 'secondary' | 'warning' | 'danger' | undefined;
  @Input() mpCopyText: string | undefined;
  @Input() mpSuffix: string | undefined;
  @Output() readonly mpContentChange = new EventEmitter<string>();
  @Output() readonly mpCopy = new EventEmitter<string>();
  @Output() readonly mpExpandChange = new EventEmitter<void>();

  @ViewChild(MpTextEditComponent, { static: false })
  textEditRef: MpTextEditComponent;
  @ViewChild(MpTextCopyComponent, { static: false })
  textCopyRef: MpTextCopyComponent;
  @ViewChild('ellipsisContainer', { static: false })
  ellipsisContainer: ElementRef<HTMLSpanElement>;
  @ViewChild('expandable', { static: false }) expandableBtn: ElementRef<
    HTMLSpanElement
  >;
  @ViewChild('contentTemplate', { static: false })
  contentTemplate: TemplateRef<{ content: string }>;

  locale: MpSafeAny = {};
  document: Document;
  expandableBtnElementCache: HTMLElement | null = null;
  editing = false;
  ellipsisText: string | undefined;
  cssEllipsis: boolean = false;
  isEllipsis: boolean = true;
  expanded: boolean = false;
  ellipsisStr = '...';

  get canCssEllipsis(): boolean {
    return this.mpEllipsis && this.cssEllipsis && !this.expanded;
  }

  private viewInit = false;
  private rfaId: number = -1;
  private destroy$ = new Subject();
  private windowResizeSubscription = Subscription.EMPTY;
  get copyText(): string {
    return typeof this.mpCopyText === 'string'
      ? this.mpCopyText
      : this.mpContent;
  }

  constructor(
    public mpConfigService: MpConfigService,
    private host: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2,
    private platform: Platform,
    private i18n: MpI18nService,
    @Inject(DOCUMENT) document: MpSafeAny,
    private resizeService: MpResizeService
  ) {
    this.document = document;
  }

  onTextCopy(text: string): void {
    this.mpCopy.emit(text);
  }

  onStartEditing(): void {
    this.editing = true;
  }

  onEndEditing(text: string): void {
    this.editing = false;
    this.mpContentChange.emit(text);
    if (this.mpContent === text) {
      this.renderOnNextFrame();
    }
  }

  onExpand(): void {
    this.isEllipsis = false;
    this.expanded = true;
    this.mpExpandChange.emit();
  }

  canUseCSSEllipsis(): boolean {
    if (
      this.mpEditable ||
      this.mpCopyable ||
      this.mpExpandable ||
      this.mpSuffix
    ) {
      return false;
    }
    if (this.mpEllipsisRows === 1) {
      return isStyleSupport('textOverflow');
    } else {
      return isStyleSupport('webkitLineClamp');
    }
  }

  renderOnNextFrame(): void {
    cancelRequestAnimationFrame(this.rfaId);
    if (
      !this.viewInit ||
      !this.mpEllipsis ||
      this.mpEllipsisRows < 0 ||
      this.expanded ||
      !this.platform.isBrowser
    ) {
      return;
    }
    this.rfaId = reqAnimFrame(() => {
      this.syncEllipsis();
    });
  }

  getOriginContentViewRef(): {
    viewRef: EmbeddedViewRef<{ content: string }>;
    removeView(): void;
  } {
    const viewRef = this.viewContainerRef.createEmbeddedView<{
      content: string;
    }>(this.contentTemplate, {
      content: this.mpContent
    });
    viewRef.detectChanges();
    return {
      viewRef,
      removeView: () => {
        this.viewContainerRef.remove(this.viewContainerRef.indexOf(viewRef));
      }
    };
  }

  syncEllipsis(): void {
    if (this.cssEllipsis) {
      return;
    }
    const { viewRef, removeView } = this.getOriginContentViewRef();
    const fixedNodes = [this.textCopyRef, this.textEditRef]
      .filter(e => e && e.nativeElement)
      .map(e => e.nativeElement);
    const expandableBtnElement = this.getExpandableBtnElement();
    if (expandableBtnElement) {
      fixedNodes.push(expandableBtnElement);
    }
    const { contentNodes, text, ellipsis } = measure(
      this.host.nativeElement,
      this.mpEllipsisRows,
      viewRef.rootNodes,
      fixedNodes,
      this.ellipsisStr,
      this.mpSuffix
    );

    removeView();

    this.ellipsisText = text;
    this.isEllipsis = ellipsis;
    const ellipsisContainerNativeElement = this.ellipsisContainer.nativeElement;
    while (ellipsisContainerNativeElement.firstChild) {
      this.renderer.removeChild(
        ellipsisContainerNativeElement,
        ellipsisContainerNativeElement.firstChild
      );
    }
    contentNodes.forEach(n => {
      this.renderer.appendChild(
        ellipsisContainerNativeElement,
        n.cloneNode(true)
      );
    });
    this.cdr.markForCheck();
  }

  // Need to create the element for calculation size before view init
  private getExpandableBtnElement(): HTMLElement | null {
    if (this.mpExpandable) {
      const expandText = this.locale ? this.locale.expand : '';
      const cache = this.expandableBtnElementCache;
      if (!cache || cache.innerText === expandText) {
        const el = this.document.createElement('a');
        el.className = EXPAND_ELEMENT_CLASSNAME;
        el.innerText = expandText;
        this.expandableBtnElementCache = el;
      }
      return this.expandableBtnElementCache;
    } else {
      this.expandableBtnElementCache = null;
      return null;
    }
  }

  private renderAndSubscribeWindowResize(): void {
    if (this.platform.isBrowser) {
      this.windowResizeSubscription.unsubscribe();
      this.cssEllipsis = this.canUseCSSEllipsis();
      this.renderOnNextFrame();
      this.windowResizeSubscription = this.resizeService
        .subscribe()
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.renderOnNextFrame());
    }
  }

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Text');
      this.cdr.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.viewInit = true;
    this.renderAndSubscribeWindowResize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {
      mpCopyable,
      mpEditable,
      mpExpandable,
      mpEllipsis,
      mpContent,
      mpEllipsisRows,
      mpSuffix
    } = changes;
    if (
      mpCopyable ||
      mpEditable ||
      mpExpandable ||
      mpEllipsis ||
      mpContent ||
      mpEllipsisRows ||
      mpSuffix
    ) {
      if (this.mpEllipsis) {
        if (this.expanded) {
          this.windowResizeSubscription.unsubscribe();
        } else {
          this.renderAndSubscribeWindowResize();
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.expandableBtnElementCache = null;
    this.windowResizeSubscription.unsubscribe();
  }
}
