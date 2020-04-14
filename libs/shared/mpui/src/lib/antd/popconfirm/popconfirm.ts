/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  EventEmitter,
  Host,
  Input,
  OnDestroy,
  Optional,
  Output,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { zoomBigMotion } from '../core/animation';
import { MpNoAnimationDirective } from '../core/no-animation';
import { MpTSType } from '../core/types';

import { InputBoolean } from '../core/util';
import {
  MpTooltipBaseDirective,
  MpToolTipComponent,
  MpTooltipTrigger
} from '../tooltip';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[mp-popconfirm]',
  exportAs: 'mpPopconfirm',
  host: {
    '[class.ant-popover-open]': 'visible'
  }
})
export class MpPopconfirmDirective extends MpTooltipBaseDirective {
  @Input('mpPopconfirmTitle') specificTitle: MpTSType;
  @Input('mp-popconfirm') directiveNameTitle: MpTSType | null;
  @Input('mpPopconfirmTrigger') specificTrigger: MpTooltipTrigger;
  @Input('mpPopconfirmPlacement') specificPlacement: string;
  @Input('mpPopconfirmOrigin') specificOrigin: ElementRef<HTMLElement>;
  @Input() mpOkText: string;
  @Input() mpOkType: string;
  @Input() mpCancelText: string;
  @Input() mpIcon: string | TemplateRef<void>;
  @Input() @InputBoolean() mpCondition: boolean;

  /**
   * @deprecated 10.0.0. This is deprecated and going to be removed in 10.0.0.
   * Please use a more specific API. Like `mpTooltipTrigger`.
   */
  @Input() mpTrigger: MpTooltipTrigger = 'click';

  @Output() readonly mpOnCancel = new EventEmitter<void>();
  @Output() readonly mpOnConfirm = new EventEmitter<void>();

  protected readonly componentFactory: ComponentFactory<
    MpPopconfirmComponent
  > = this.resolver.resolveComponentFactory(MpPopconfirmComponent);

  protected readonly needProxyProperties = [
    'mpOverlayClassName',
    'mpOverlayStyle',
    'mpMouseEnterDelay',
    'mpMouseLeaveDelay',
    'mpVisible',
    'mpOkText',
    'mpOkType',
    'mpCancelText',
    'mpCondition',
    'mpIcon'
  ];

  constructor(
    elementRef: ElementRef,
    hostView: ViewContainerRef,
    resolver: ComponentFactoryResolver,
    renderer: Renderer2,
    @Host() @Optional() noAnimation?: MpNoAnimationDirective
  ) {
    super(elementRef, hostView, resolver, renderer, noAnimation);
  }

  /**
   * @override
   */
  protected createComponent(): void {
    super.createComponent();

    (this.component as MpPopconfirmComponent).mpOnCancel
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.mpOnCancel.emit();
      });
    (this.component as MpPopconfirmComponent).mpOnConfirm
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.mpOnConfirm.emit();
      });
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-popconfirm',
  exportAs: 'mpPopconfirmComponent',
  preserveWhitespaces: false,
  animations: [zoomBigMotion],
  template: `
    <ng-template
      #overlay="cdkConnectedOverlay"
      cdkConnectedOverlay
      mpConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayHasBackdrop]="_hasBackdrop"
      (backdropClick)="hide()"
      (detach)="hide()"
      (positionChange)="onPositionChange($event)"
      [cdkConnectedOverlayPositions]="_positions"
      [cdkConnectedOverlayOpen]="_visible"
    >
      <div
        class="ant-popover"
        [ngClass]="_classMap"
        [ngStyle]="mpOverlayStyle"
        [@.disabled]="noAnimation?.mpNoAnimation"
        [mpNoAnimation]="noAnimation?.mpNoAnimation"
        [@zoomBigMotion]="'active'"
      >
        <div class="ant-popover-content">
          <div class="ant-popover-arrow"></div>
          <div class="ant-popover-inner">
            <div>
              <div class="ant-popover-inner-content">
                <div class="ant-popover-message">
                  <ng-container *mpStringTemplateOutlet="mpTitle">
                    <ng-container *mpStringTemplateOutlet="mpIcon">
                      <i
                        mp-icon
                        [mpType]="mpIcon || 'exclamation-circle'"
                        mpTheme="fill"
                      ></i>
                    </ng-container>
                    <div class="ant-popover-message-title">{{ mpTitle }}</div>
                  </ng-container>
                </div>
                <div class="ant-popover-buttons">
                  <button mp-button [mpSize]="'small'" (click)="onCancel()">
                    <ng-container *ngIf="mpCancelText">{{
                      mpCancelText
                    }}</ng-container>
                    <ng-container *ngIf="!mpCancelText">{{
                      'Modal.cancelText' | mpI18n
                    }}</ng-container>
                  </button>
                  <button
                    mp-button
                    [mpSize]="'small'"
                    [mpType]="mpOkType"
                    (click)="onConfirm()"
                  >
                    <ng-container *ngIf="mpOkText">{{ mpOkText }}</ng-container>
                    <ng-container *ngIf="!mpOkText">{{
                      'Modal.okText' | mpI18n
                    }}</ng-container>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `
})
export class MpPopconfirmComponent extends MpToolTipComponent
  implements OnDestroy {
  mpCancelText: string;
  mpCondition = false;
  mpIcon: string | TemplateRef<void>;
  mpOkText: string;
  mpOkType: string = 'primary';

  readonly mpOnCancel = new Subject<void>();
  readonly mpOnConfirm = new Subject<void>();

  protected _trigger: MpTooltipTrigger = 'click';

  _prefix = 'ant-popover-placement';
  _hasBackdrop = true;

  constructor(
    cdr: ChangeDetectorRef,
    @Host() @Optional() public noAnimation?: MpNoAnimationDirective
  ) {
    super(cdr, noAnimation);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.mpOnCancel.complete();
    this.mpOnConfirm.complete();
  }

  /**
   * @override
   */
  show(): void {
    if (!this.mpCondition) {
      super.show();
    } else {
      this.onConfirm();
    }
  }

  onCancel(): void {
    this.mpOnCancel.next();
    super.hide();
  }

  onConfirm(): void {
    this.mpOnConfirm.next();
    super.hide();
  }
}
