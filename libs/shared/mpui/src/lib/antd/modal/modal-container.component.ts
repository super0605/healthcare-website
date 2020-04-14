/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusTrapFactory } from '@angular/cdk/a11y';
import { OverlayRef } from '@angular/cdk/overlay';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NgZone,
  Optional,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { MpSafeAny } from '../core/types';

import { mpModalAnimations } from './modal-animations';
import { BaseModalContainer } from './modal-container';
import { ModalOptions } from './modal-types';

@Component({
  selector: 'mp-modal-container',
  exportAs: 'mpModalContainer',
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
        <div *ngIf="config.mpTitle" mp-modal-title></div>
        <div class="ant-modal-body" [ngStyle]="config.mpBodyStyle">
          <ng-template cdkPortalOutlet></ng-template>
          <div *ngIf="isStringContent" [innerHTML]="config.mpContent"></div>
        </div>
        <div
          *ngIf="config.mpFooter !== null"
          mp-modal-footer
          [modalRef]="modalRef"
          (cancelTriggered)="onCloseClick()"
          (okTriggered)="onOkClick()"
        ></div>
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
export class MpModalContainerComponent extends BaseModalContainer {
  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet: CdkPortalOutlet;
  @ViewChild('modalElement', { static: true }) modalElementRef: ElementRef<
    HTMLDivElement
  >;
  constructor(
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
  }
}
