/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
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
import {
  MpBreakpointKey,
  MpBreakpointService,
  siderResponsiveMap
} from '../core/services';
import { inNextTick, InputBoolean, toCssPixel } from '../core/util';
import { MpMenuDirective } from '../menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mp-sider',
  exportAs: 'mpSider',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ant-layout-sider-children">
      <ng-content></ng-content>
    </div>
    <div
      *ngIf="mpCollapsible && mpTrigger !== null"
      mp-sider-trigger
      [matchBreakPoint]="matchBreakPoint"
      [mpCollapsedWidth]="mpCollapsedWidth"
      [mpCollapsed]="mpCollapsed"
      [mpBreakpoint]="mpBreakpoint"
      [mpReverseArrow]="mpReverseArrow"
      [mpTrigger]="mpTrigger"
      [mpZeroTrigger]="mpZeroTrigger"
      [siderWidth]="widthSetting"
      (click)="setCollapsed(!mpCollapsed)"
    ></div>
  `,
  host: {
    '[class.ant-layout-sider]': 'true',
    '[class.ant-layout-sider-zero-width]': `mpCollapsed && mpCollapsedWidth === 0`,
    '[class.ant-layout-sider-light]': `mpTheme === 'light'`,
    '[class.ant-layout-sider-dark]': `mpTheme === 'dark'`,
    '[class.ant-layout-sider-collapsed]': `mpCollapsed`,
    '[style.flex]': 'flexSetting',
    '[style.maxWidth]': 'widthSetting',
    '[style.minWidth]': 'widthSetting',
    '[style.width]': 'widthSetting'
  }
})
export class MpSiderComponent
  implements OnInit, OnDestroy, OnChanges, AfterContentInit {
  private destroy$ = new Subject();
  @ContentChild(MpMenuDirective) mpMenuDirective: MpMenuDirective | null = null;
  @Output() readonly mpCollapsedChange = new EventEmitter();
  @Input() mpWidth: string | number = 200;
  @Input() mpTheme: 'light' | 'dark' = 'dark';
  @Input() mpCollapsedWidth = 80;
  @Input() mpBreakpoint: MpBreakpointKey | null = null;
  @Input() mpZeroTrigger: TemplateRef<void> | null = null;
  @Input() mpTrigger: TemplateRef<void> | undefined | null = undefined;
  @Input() @InputBoolean() mpReverseArrow = false;
  @Input() @InputBoolean() mpCollapsible = false;
  @Input() @InputBoolean() mpCollapsed = false;
  matchBreakPoint = false;
  flexSetting: string | null = null;
  widthSetting: string | null = null;

  updateStyleMap(): void {
    this.widthSetting = this.mpCollapsed
      ? `${this.mpCollapsedWidth}px`
      : toCssPixel(this.mpWidth);
    this.flexSetting = `0 0 ${this.widthSetting}`;
    this.cdr.markForCheck();
  }

  updateMenuInlineCollapsed(): void {
    if (
      this.mpMenuDirective &&
      this.mpMenuDirective.mpMode === 'inline' &&
      this.mpCollapsedWidth !== 0
    ) {
      this.mpMenuDirective.setInlineCollapsed(this.mpCollapsed);
    }
  }

  setCollapsed(collapsed: boolean): void {
    if (collapsed !== this.mpCollapsed) {
      this.mpCollapsed = collapsed;
      this.mpCollapsedChange.emit(collapsed);
      this.updateMenuInlineCollapsed();
      this.updateStyleMap();
      this.cdr.markForCheck();
    }
  }

  constructor(
    private platform: Platform,
    private cdr: ChangeDetectorRef,
    private breakpointService: MpBreakpointService
  ) {}

  ngOnInit(): void {
    this.updateStyleMap();

    if (this.platform.isBrowser) {
      this.breakpointService
        .subscribe(siderResponsiveMap, true)
        .pipe(takeUntil(this.destroy$))
        .subscribe(map => {
          const breakpoint = this.mpBreakpoint;
          if (breakpoint) {
            inNextTick().subscribe(() => {
              this.matchBreakPoint = !map[breakpoint];
              this.setCollapsed(this.matchBreakPoint);
              this.cdr.markForCheck();
            });
          }
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpCollapsed, mpCollapsedWidth, mpWidth } = changes;
    if (mpCollapsed || mpCollapsedWidth || mpWidth) {
      this.updateStyleMap();
    }
    if (mpCollapsed) {
      this.updateMenuInlineCollapsed();
    }
  }

  ngAfterContentInit(): void {
    this.updateMenuInlineCollapsed();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
