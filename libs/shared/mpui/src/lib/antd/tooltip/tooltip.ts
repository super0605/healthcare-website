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
  MpTooltipBaseComponent,
  MpTooltipBaseDirective,
  MpTooltipTrigger
} from './base';

@Directive({
  selector: '[mp-tooltip]',
  exportAs: 'mpTooltip',
  host: {
    '[class.ant-tooltip-open]': 'visible'
  }
})
export class MpTooltipDirective extends MpTooltipBaseDirective {
  @Input('mpTooltipTitle') specificTitle: MpTSType;
  @Input('mp-tooltip') directiveNameTitle: MpTSType | null;
  @Input('mpTooltipTrigger') specificTrigger: MpTooltipTrigger;
  @Input('mpTooltipPlacement') specificPlacement: string;
  @Input('mpTooltipOrigin') specificOrigin?: ElementRef<HTMLElement>;

  componentFactory: ComponentFactory<
    MpToolTipComponent
  > = this.resolver.resolveComponentFactory(MpToolTipComponent);

  constructor(
    elementRef: ElementRef,
    hostView: ViewContainerRef,
    resolver: ComponentFactoryResolver,
    renderer: Renderer2,
    @Host() @Optional() noAnimation?: MpNoAnimationDirective
  ) {
    super(elementRef, hostView, resolver, renderer, noAnimation);
  }
}

@Component({
  selector: 'mp-tooltip',
  exportAs: 'mpTooltipComponent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [zoomBigMotion],
  template: `
    <ng-template
      #overlay="cdkConnectedOverlay"
      cdkConnectedOverlay
      mpConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="_visible"
      [cdkConnectedOverlayHasBackdrop]="_hasBackdrop"
      [cdkConnectedOverlayPositions]="_positions"
      (backdropClick)="hide()"
      (detach)="hide()"
      (positionChange)="onPositionChange($event)"
    >
      <div
        class="ant-tooltip"
        [ngClass]="_classMap"
        [ngStyle]="mpOverlayStyle"
        [@.disabled]="noAnimation?.mpNoAnimation"
        [mpNoAnimation]="noAnimation?.mpNoAnimation"
        [@zoomBigMotion]="'active'"
      >
        <div class="ant-tooltip-content">
          <div class="ant-tooltip-arrow"></div>
          <div class="ant-tooltip-inner">
            <ng-container *mpStringTemplateOutlet="mpTitle">{{
              mpTitle
            }}</ng-container>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  preserveWhitespaces: false
})
export class MpToolTipComponent extends MpTooltipBaseComponent {
  @Input() mpTitle: MpTSType | null;

  constructor(
    cdr: ChangeDetectorRef,
    @Host() @Optional() public noAnimation?: MpNoAnimationDirective
  ) {
    super(cdr, noAnimation);
  }

  protected isEmpty(): boolean {
    return isTooltipEmpty(this.mpTitle);
  }
}
