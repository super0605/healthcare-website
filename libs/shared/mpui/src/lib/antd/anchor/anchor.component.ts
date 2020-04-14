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
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MpConfigService, WithConfig } from '../core/config';
import { warnDeprecation } from '../core/logger';
import { MpScrollService } from '../core/services';
import { NgStyleInterface, MpSafeAny } from '../core/types';
import { InputBoolean, InputNumber } from '../core/util';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

import { MpAnchorLinkComponent } from './anchor-link.component';
import { getOffsetTop } from './util';

interface Section {
  comp: MpAnchorLinkComponent;
  top: number;
}

const NZ_CONFIG_COMPONENT_NAME = 'anchor';
const sharpMatcherRegx = /#([^#]+)$/;

@Component({
  selector: 'mp-anchor',
  exportAs: 'mpAnchor',
  preserveWhitespaces: false,
  template: `
    <mp-affix
      *ngIf="mpAffix; else content"
      [mpOffsetTop]="mpOffsetTop"
      [mpTarget]="container"
    >
      <ng-template [ngTemplateOutlet]="content"></ng-template>
    </mp-affix>
    <ng-template #content>
      <div class="ant-anchor-wrapper" [ngStyle]="wrapperStyle">
        <div
          class="ant-anchor"
          [ngClass]="{ fixed: !mpAffix && !mpShowInkInFixed }"
        >
          <div class="ant-anchor-ink">
            <div class="ant-anchor-ink-ball" #ink></div>
          </div>
          <ng-content></ng-content>
        </div>
      </div>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MpAnchorComponent implements OnDestroy, AfterViewInit, OnChanges {
  @ViewChild('ink', { static: false }) private ink: ElementRef;

  @Input() @InputBoolean() mpAffix = true;

  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  @InputBoolean()
  mpShowInkInFixed: boolean;

  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 5)
  @InputNumber()
  mpBounds: number;

  @Input()
  @InputNumber()
  @WithConfig<number>(NZ_CONFIG_COMPONENT_NAME)
  mpOffsetTop: number;

  @Input() mpContainer: string | HTMLElement;
  @Input() mpTarget: string | HTMLElement;

  @Output() readonly mpClick = new EventEmitter<string>();
  @Output() readonly mpScroll = new EventEmitter<MpAnchorLinkComponent>();

  visible = false;
  wrapperStyle: NgStyleInterface = { 'max-height': '100vh' };

  container: HTMLElement | Window;

  private links: MpAnchorLinkComponent[] = [];
  private animating = false;
  private destroy$ = new Subject();
  private handleScrollTimeoutID = -1;

  constructor(
    @Inject(DOCUMENT) private doc: MpSafeAny,
    public mpConfigService: MpConfigService,
    private scrollSrv: MpScrollService,
    private cdr: ChangeDetectorRef,
    private platform: Platform,
    private zone: NgZone,
    private renderer: Renderer2
  ) {}

  registerLink(link: MpAnchorLinkComponent): void {
    this.links.push(link);
  }

  unregisterLink(link: MpAnchorLinkComponent): void {
    this.links.splice(this.links.indexOf(link), 1);
  }

  private getContainer(): HTMLElement | Window {
    return this.container || window;
  }

  ngAfterViewInit(): void {
    this.registerScrollEvent();
  }

  ngOnDestroy(): void {
    clearTimeout(this.handleScrollTimeoutID);
    this.destroy$.next();
    this.destroy$.complete();
  }

  private registerScrollEvent(): void {
    if (!this.platform.isBrowser) {
      return;
    }
    this.destroy$.next();
    this.zone.runOutsideAngular(() => {
      fromEvent(this.getContainer(), 'scroll')
        .pipe(
          throttleTime(50),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.handleScroll());
    });
    // Browser would maintain the scrolling position when refreshing.
    // So we have to delay calculation in avoid of getting a incorrect result.
    this.handleScrollTimeoutID = setTimeout(() => this.handleScroll());
  }

  handleScroll(): void {
    if (typeof document === 'undefined' || this.animating) {
      return;
    }

    const sections: Section[] = [];
    const scope = (this.mpOffsetTop || 0) + this.mpBounds;
    this.links.forEach(comp => {
      const sharpLinkMatch = sharpMatcherRegx.exec(comp.mpHref.toString());
      if (!sharpLinkMatch) {
        return;
      }
      const target = this.doc.getElementById(sharpLinkMatch[1]);
      if (target) {
        const top = getOffsetTop(target, this.getContainer());
        if (top < scope) {
          sections.push({
            top,
            comp
          });
        }
      }
    });

    this.visible = !!sections.length;
    if (!this.visible) {
      this.clearActive();
      this.cdr.detectChanges();
    } else {
      const maxSection = sections.reduce((prev, curr) =>
        curr.top > prev.top ? curr : prev
      );
      this.handleActive(maxSection.comp);
    }
    this.setVisible();
  }

  private clearActive(): void {
    this.links.forEach(i => {
      i.unsetActive();
    });
  }

  private handleActive(comp: MpAnchorLinkComponent): void {
    this.clearActive();
    comp.setActive();
    const linkNode = comp.getLinkTitleElement();
    this.ink.nativeElement.style.top = `${linkNode.offsetTop +
      linkNode.clientHeight / 2 -
      4.5}px`;
    this.visible = true;
    this.setVisible();
    this.mpScroll.emit(comp);
  }

  private setVisible(): void {
    const visible = this.visible;
    const visibleClassname = 'visible';
    if (this.ink) {
      if (visible) {
        this.renderer.addClass(this.ink.nativeElement, visibleClassname);
      } else {
        this.renderer.removeClass(this.ink.nativeElement, visibleClassname);
      }
    }
  }

  handleScrollTo(linkComp: MpAnchorLinkComponent): void {
    const el = this.doc.querySelector(linkComp.mpHref);
    if (!el) {
      return;
    }

    this.animating = true;
    const containerScrollTop = this.scrollSrv.getScroll(this.getContainer());
    const elOffsetTop = getOffsetTop(el, this.getContainer());
    const targetScrollTop =
      containerScrollTop + elOffsetTop - (this.mpOffsetTop || 0);
    this.scrollSrv.scrollTo(
      this.getContainer(),
      targetScrollTop,
      undefined,
      () => {
        this.animating = false;
        this.handleActive(linkComp);
      }
    );
    this.mpClick.emit(linkComp.mpHref);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpOffsetTop, mpTarget, mpContainer } = changes;
    if (mpOffsetTop) {
      this.wrapperStyle = {
        'max-height': `calc(100vh - ${this.mpOffsetTop}px)`
      };
    }
    if (mpContainer || mpTarget) {
      const container = this.mpContainer || this.mpTarget;
      this.container =
        typeof container === 'string'
          ? this.doc.querySelector(container)
          : container;
      this.registerScrollEvent();
      if (mpTarget) {
        warnDeprecation(
          `'mpTarget' of 'mp-anchor' is deprecated and will be removed in 10.0.0.Please use 'mpContainer' instead.`
        );
      }
    }
  }
}
