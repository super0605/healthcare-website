/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusTrapFactory } from '@angular/cdk/a11y';
import { OverlayRef } from '@angular/cdk/overlay';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { MpSafeAny } from '../core/types';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MpI18nService } from '../i18n';

import { mpModalAnimations } from './modal-animations';
import { BaseModalContainer } from './modal-container';
import { ModalOptions } from './modal-types';

@Component({
  selector: 'mp-modal-confirm-container',
  exportAs: 'mpModalConfirmContainer',
  template: `
    <div
      #modalElement
      role="document"
      class="ant-modal"
      [class]="config.mpClassName"
      [ngStyle]="config.mpStyle"
      [style.width]="config?.mpWidth | mpToCssUnit"
    >
      <div class="ant-modal-content">
        <button
          *ngIf="config.mpClosable"
          mp-modal-close
          (click)="onCloseClick()"
        ></button>
        <div class="ant-modal-body" [ngStyle]="config.mpBodyStyle">
          <div class="ant-modal-confirm-body-wrapper">
            <div class="ant-modal-confirm-body">
              <i mp-icon [mpType]="config.mpIconType"></i>
              <span class="ant-modal-confirm-title">
                <ng-container *mpStringTemplateOutlet="config.mpTitle">
                  <span [innerHTML]="config.mpTitle"></span>
                </ng-container>
              </span>
              <div class="ant-modal-confirm-content">
                <ng-template cdkPortalOutlet></ng-template>
                <div
                  *ngIf="isStringContent"
                  [innerHTML]="config.mpContent"
                ></div>
              </div>
            </div>
            <div class="ant-modal-confirm-btns">
              <button
                *ngIf="config.mpCancelText !== null"
                [attr.cdkFocusInitial]="config.mpAutofocus === 'cancel'"
                mp-button
                (click)="onCancel()"
                [mpLoading]="config.mpCancelLoading"
                [disabled]="config.mpCancelDisabled"
              >
                {{ config.mpCancelText || locale.cancelText }}
              </button>
              <button
                *ngIf="config.mpOkText !== null"
                [attr.cdkFocusInitial]="config.mpAutofocus === 'ok'"
                mp-button
                [mpType]="config.mpOkType"
                (click)="onOk()"
                [mpLoading]="config.mpOkLoading"
                [disabled]="config.mpOkDisabled"
              >
                {{ config.mpOkText || locale.okText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  animations: [mpModalAnimations.modalContainer],
  // Using OnPush for modal caused footer can not to detect changes. we can fix it when 8.x.
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    tabindex: '-1',
    role: 'dialog',
    class: 'ant-modal-wrap',
    '[class]': 'config.mpWrapClassName',
    '[style.zIndex]': 'config.mpZIndex',
    '[@.disabled]': 'config.mpNoAnimation',
    '[@modalContainer]': 'state',
    '(@modalContainer.start)': 'onAnimationStart($event)',
    '(@modalContainer.done)': 'onAnimationDone($event)',
    '(mousedown)': 'onMousedown($event)',
    '(mouseup)': 'onMouseup($event)'
  }
})
export class MpModalConfirmContainerComponent extends BaseModalContainer
  implements OnDestroy {
  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet: CdkPortalOutlet;
  @ViewChild('modalElement', { static: true }) modalElementRef: ElementRef<
    HTMLDivElement
  >;
  @Output() readonly cancelTriggered = new EventEmitter<void>();
  @Output() readonly okTriggered = new EventEmitter<void>();
  locale: { okText?: string; cancelText?: string } = {};
  private destroy$ = new Subject<void>();

  constructor(
    private i18n: MpI18nService,
    elementRef: ElementRef,
    focusTrapFactory: FocusTrapFactory,
    cdr: ChangeDetectorRef,
    render: Renderer2,
    zone: NgZone,
    overlayRef: OverlayRef,
    public config: ModalOptions,
    @Optional() @Inject(DOCUMENT) document: MpSafeAny,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationType: string
  ) {
    super(
      elementRef,
      focusTrapFactory,
      cdr,
      render,
      zone,
      overlayRef,
      config,
      document,
      animationType
    );
    this.i18n.localeChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Modal');
    });
  }

  onCancel(): void {
    this.cancelTriggered.emit();
  }

  onOk(): void {
    this.okTriggered.emit();
  }

  attachComponentPortal<T>(_portal: ComponentPortal<T>): never {
    throw new Error(
      'The confirm mode does not support using component as content'
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
