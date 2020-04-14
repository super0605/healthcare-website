/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { MpConfigService, WithConfig } from '../core/config';
import { InputBoolean } from '../core/util';

import { MpIconDirective } from '../icon';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

export type MpButtonType = 'primary' | 'dashed' | 'danger' | 'link' | null;
export type MpButtonShape = 'circle' | 'round' | null;
export type MpButtonSize = 'large' | 'default' | 'small';

const NZ_CONFIG_COMPONENT_NAME = 'button';

@Component({
  selector: 'button[mp-button], a[mp-button]',
  exportAs: 'mpButton',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <i mp-icon mpType="loading" *ngIf="mpLoading"></i>
    <ng-content></ng-content>
  `,
  host: {
    '[class.ant-btn]': `true`,
    '[class.ant-btn-primary]': `mpType === 'primary'`,
    '[class.ant-btn-dashed]': `mpType === 'dashed'`,
    '[class.ant-btn-link]': `mpType === 'link'`,
    '[class.ant-btn-danger]': `mpType === 'danger'`,
    '[class.ant-btn-circle]': `mpShape === 'circle'`,
    '[class.ant-btn-round]': `mpShape === 'round'`,
    '[class.ant-btn-lg]': `mpSize === 'large'`,
    '[class.ant-btn-sm]': `mpSize === 'small'`,
    '[class.ant-btn-dangerous]': `mpDanger`,
    '[class.ant-btn-loading]': `mpLoading`,
    '[class.ant-btn-background-ghost]': `mpGhost`,
    '[class.ant-btn-block]': `mpBlock`,
    '[class.ant-input-search-button]': `mpSearch`
  }
})
export class MpButtonComponent
  implements OnDestroy, OnChanges, AfterViewInit, AfterContentInit {
  @ContentChild(MpIconDirective, { read: ElementRef })
  mpIconDirectiveElement: ElementRef;
  @Input() @InputBoolean() mpBlock: boolean = false;
  @Input() @InputBoolean() mpGhost: boolean = false;
  @Input() @InputBoolean() mpSearch: boolean = false;
  @Input() @InputBoolean() mpLoading: boolean = false;
  @Input() @InputBoolean() mpDanger: boolean = false;
  @Input() mpType: MpButtonType = null;
  @Input() mpShape: MpButtonShape = null;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'default')
  mpSize: MpButtonSize;
  private destroy$ = new Subject<void>();
  private loading$ = new Subject<boolean>();

  insertSpan(nodes: NodeList, renderer: Renderer2): void {
    nodes.forEach(node => {
      if (node.nodeName === '#text') {
        const span = renderer.createElement('span');
        const parent = renderer.parentNode(node);
        renderer.insertBefore(parent, span, node);
        renderer.appendChild(span, node);
      }
    });
  }

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    public mpConfigService: MpConfigService
  ) {
    this.mpConfigService
      .getConfigChangeEventForComponent(NZ_CONFIG_COMPONENT_NAME)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpLoading } = changes;
    if (mpLoading) {
      this.loading$.next(this.mpLoading);
    }
  }

  ngAfterViewInit(): void {
    this.insertSpan(this.elementRef.nativeElement.childNodes, this.renderer);
  }

  ngAfterContentInit(): void {
    this.loading$
      .pipe(
        startWith(this.mpLoading),
        filter(() => !!this.mpIconDirectiveElement),
        takeUntil(this.destroy$)
      )
      .subscribe(loading => {
        const nativeElement = this.mpIconDirectiveElement.nativeElement;
        if (loading) {
          this.renderer.setStyle(nativeElement, 'display', 'none');
        } else {
          this.renderer.removeStyle(nativeElement, 'display');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
