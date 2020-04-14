/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ComponentPortal,
  Portal,
  PortalInjector,
  TemplatePortal
} from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../core/types';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { MpConfigService } from '../core/config';
import {
  NZ_EMPTY_COMPONENT_NAME,
  MpEmptyCustomContent,
  MpEmptySize
} from './config';

function getEmptySize(componentName: string): MpEmptySize {
  switch (componentName) {
    case 'table':
    case 'list':
      return 'normal';
    case 'select':
    case 'tree-select':
    case 'cascader':
    case 'transfer':
      return 'small';
    default:
      return '';
  }
}

type MpEmptyContentType = 'component' | 'template' | 'string';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-embed-empty',
  exportAs: 'mpEmbedEmpty',
  template: `
    <ng-container
      *ngIf="!content && specificContent !== null"
      [ngSwitch]="size"
    >
      <mp-empty
        *ngSwitchCase="'normal'"
        class="ant-empty-normal"
        [mpNotFoundImage]="'simple'"
      ></mp-empty>
      <mp-empty
        *ngSwitchCase="'small'"
        class="ant-empty-small"
        [mpNotFoundImage]="'simple'"
      ></mp-empty>
      <mp-empty *ngSwitchDefault></mp-empty>
    </ng-container>
    <ng-container *ngIf="content">
      <ng-template
        *ngIf="contentType !== 'string'"
        [cdkPortalOutlet]="contentPortal"
      ></ng-template>
      <ng-container *ngIf="contentType === 'string'">
        {{ content }}
      </ng-container>
    </ng-container>
  `
})
export class MpEmbedEmptyComponent implements OnChanges, OnInit, OnDestroy {
  @Input() mpComponentName: string;
  @Input() specificContent: MpEmptyCustomContent;

  content?: MpEmptyCustomContent;
  contentType: MpEmptyContentType = 'string';
  contentPortal?: Portal<MpSafeAny>;
  size: MpEmptySize = '';

  private destroy$ = new Subject<void>();

  constructor(
    private configService: MpConfigService,
    private viewContainerRef: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private injector: Injector
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mpComponentName) {
      this.size = getEmptySize(changes.mpComponentName.currentValue);
    }

    if (changes.specificContent && !changes.specificContent.isFirstChange()) {
      this.content = changes.specificContent.currentValue;
      this.renderEmpty();
    }
  }

  ngOnInit(): void {
    this.subscribeDefaultEmptyContentChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private renderEmpty(): void {
    const content = this.content;

    if (typeof content === 'string') {
      this.contentType = 'string';
    } else if (content instanceof TemplateRef) {
      const context = { $implicit: this.mpComponentName } as MpSafeAny;
      this.contentType = 'template';
      this.contentPortal = new TemplatePortal(
        content,
        this.viewContainerRef,
        context
      );
    } else if (content instanceof Type) {
      const context = new WeakMap([
        [NZ_EMPTY_COMPONENT_NAME, this.mpComponentName]
      ]);
      const injector = new PortalInjector(this.injector, context);
      this.contentType = 'component';
      this.contentPortal = new ComponentPortal(
        content,
        this.viewContainerRef,
        injector
      );
    } else {
      this.contentType = 'string';
      this.contentPortal = undefined;
    }

    this.cdr.detectChanges();
  }

  private subscribeDefaultEmptyContentChange(): void {
    this.configService
      .getConfigChangeEventForComponent('empty')
      .pipe(
        startWith(true),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.content =
          this.specificContent || this.getUserDefaultEmptyContent();
        this.renderEmpty();
      });
  }

  private getUserDefaultEmptyContent():
    | Type<MpSafeAny>
    | TemplateRef<string>
    | string
    | undefined {
    return (this.configService.getConfigForComponent('empty') || {})
      .mpDefaultEmptyContent;
  }
}
