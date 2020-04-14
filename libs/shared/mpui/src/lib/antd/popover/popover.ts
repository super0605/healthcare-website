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
  Host,
  Input,
  Optional,
  Renderer2,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { zoomBigMotion } from '../core/animation';
import { MpNoAnimationDirective } from '../core/no-animation';
import { MpTSType } from '../core/types';

import {
  isTooltipEmpty,
  MpTooltipBaseDirective,
  MpToolTipComponent,
  MpTooltipTrigger
} from '../tooltip';

@Directive({
  selector: '[mp-popover]',
  exportAs: 'mpPopover',
  host: {
    '[class.ant-popover-open]': 'visible'
  }
})
export class MpPopoverDirective extends MpTooltipBaseDirective {
  @Input('mpPopoverTitle') specificTitle: MpTSType;
  @Input('mpPopoverContent') specificContent: MpTSType;
  @Input('mp-popover') directiveNameTitle: MpTSType | null;
  @Input('mpPopoverTrigger') specificTrigger: MpTooltipTrigger;
  @Input('mpPopoverPlacement') specificPlacement: string;
  @Input('mpPopoverOrigin') specificOrigin: ElementRef<HTMLElement>;

  componentFactory: ComponentFactory<
    MpPopoverComponent
  > = this.resolver.resolveComponentFactory(MpPopoverComponent);

  constructor(
    elementRef: ElementRef,
    hostView: ViewContainerRef,
    resolver: ComponentFactoryResolver,
    renderer: Renderer2,
    @Host() @Optional() public noAnimation?: MpNoAnimationDirective
  ) {
    super(elementRef, hostView, resolver, renderer, noAnimation);
  }
}

@Component({
  selector: 'mp-popover',
  exportAs: 'mpPopoverComponent',
  animations: [zoomBigMotion],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
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
          <div class="ant-popover-inner" role="tooltip">
            <div>
              <div class="ant-popover-title" *ngIf="mpTitle">
                <ng-container *mpStringTemplateOutlet="mpTitle">{{
                  mpTitle
                }}</ng-container>
              </div>
              <div class="ant-popover-inner-content">
                <ng-container *mpStringTemplateOutlet="mpContent">{{
                  mpContent
                }}</ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `
})
export class MpPopoverComponent extends MpToolTipComponent {
  _prefix = 'ant-popover-placement';

  constructor(
    cdr: ChangeDetectorRef,
    @Host() @Optional() public noAnimation?: MpNoAnimationDirective
  ) {
    super(cdr, noAnimation);
  }

  protected isEmpty(): boolean {
    return isTooltipEmpty(this.mpTitle) && isTooltipEmpty(this.mpContent);
  }
}
