/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { ESCAPE } from '@angular/cdk/keycodes';
import {
  Overlay,
  OverlayConfig,
  OverlayKeyboardDispatcher,
  OverlayRef
} from '@angular/cdk/overlay';
import {
  CdkPortalOutlet,
  ComponentPortal,
  PortalInjector,
  TemplatePortal
} from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { MpConfigService, WithConfig } from '../core/config';
import { MpSafeAny } from '../core/types';
import { InputBoolean, toCssPixel } from '../core/util';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  MpDrawerOptionsOfComponent,
  MpDrawerPlacement
} from './drawer-options';
import { MpDrawerRef } from './drawer-ref';

export const DRAWER_ANIMATE_DURATION = 300;

const NZ_CONFIG_COMPONENT_NAME = 'drawer';

@Component({
  selector: 'mp-drawer',
  exportAs: 'mpDrawer',
  template: `
    <ng-template #drawerTemplate>
      <div
        class="ant-drawer"
        [mpNoAnimation]="mpNoAnimation"
        [class.ant-drawer-open]="isOpen"
        [class.ant-drawer-top]="mpPlacement === 'top'"
        [class.ant-drawer-bottom]="mpPlacement === 'bottom'"
        [class.ant-drawer-right]="mpPlacement === 'right'"
        [class.ant-drawer-left]="mpPlacement === 'left'"
        [style.transform]="offsetTransform"
        [style.transition]="placementChanging ? 'none' : null"
        [style.zIndex]="mpZIndex"
      >
        <div
          class="ant-drawer-mask"
          (click)="maskClick()"
          *ngIf="mpMask"
          [ngStyle]="mpMaskStyle"
        ></div>
        <div
          class="ant-drawer-content-wrapper {{ mpWrapClassName }}"
          [style.width]="width"
          [style.height]="height"
          [style.transform]="transform"
          [style.transition]="placementChanging ? 'none' : null"
        >
          <div class="ant-drawer-content">
            <div
              class="ant-drawer-wrapper-body"
              [style.height]="isLeftOrRight ? '100%' : null"
            >
              <div
                *ngIf="mpTitle || mpClosable"
                [class.ant-drawer-header]="!!mpTitle"
                [class.ant-drawer-header-no-title]="!!mpTitle"
              >
                <div *ngIf="mpTitle" class="ant-drawer-title">
                  <ng-container *mpStringTemplateOutlet="mpTitle"
                    ><div [innerHTML]="mpTitle"></div
                  ></ng-container>
                </div>
                <button
                  *ngIf="mpClosable"
                  (click)="closeClick()"
                  aria-label="Close"
                  class="ant-drawer-close"
                >
                  <i mp-icon mpType="close"></i>
                </button>
              </div>
              <div class="ant-drawer-body" [ngStyle]="mpBodyStyle">
                <ng-template cdkPortalOutlet></ng-template>
                <ng-container *ngIf="isTemplateRef(mpContent)">
                  <ng-container
                    *ngTemplateOutlet="mpContent; context: templateContext"
                  ></ng-container>
                </ng-container>
                <ng-content *ngIf="!mpContent"></ng-content>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MpDrawerComponent<T = MpSafeAny, R = MpSafeAny, D = MpSafeAny>
  extends MpDrawerRef<R>
  implements
    OnInit,
    OnDestroy,
    AfterViewInit,
    OnChanges,
    MpDrawerOptionsOfComponent {
  @Input() mpContent:
    | TemplateRef<{ $implicit: D; drawerRef: MpDrawerRef<R> }>
    | Type<T>;
  @Input() @InputBoolean() mpClosable: boolean = true;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, true)
  @InputBoolean()
  mpMaskClosable: boolean;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, true)
  @InputBoolean()
  mpMask: boolean;
  @Input() @InputBoolean() mpNoAnimation = false;
  @Input() @InputBoolean() mpKeyboard: boolean = true;
  @Input() mpTitle: string | TemplateRef<{}>;
  @Input() mpPlacement: MpDrawerPlacement = 'right';
  @Input() mpMaskStyle: object = {};
  @Input() mpBodyStyle: object = {};
  @Input() mpWrapClassName: string;
  @Input() mpWidth: number | string = 256;
  @Input() mpHeight: number | string = 256;
  @Input() mpZIndex = 1000;
  @Input() mpOffsetX = 0;
  @Input() mpOffsetY = 0;

  @Input()
  set mpVisible(value: boolean) {
    this.isOpen = value;
  }

  get mpVisible(): boolean {
    return this.isOpen;
  }

  @Output() readonly mpOnViewInit = new EventEmitter<void>();
  @Output() readonly mpOnClose = new EventEmitter<MouseEvent>();

  @ViewChild('drawerTemplate', { static: true }) drawerTemplate: TemplateRef<
    void
  >;
  @ViewChild(CdkPortalOutlet, { static: false })
  bodyPortalOutlet: CdkPortalOutlet;

  destroy$ = new Subject<void>();
  previouslyFocusedElement: HTMLElement;
  placementChanging = false;
  placementChangeTimeoutId = -1;
  mpContentParams: D; // only service
  overlayRef: OverlayRef | null;
  portal: TemplatePortal;
  focusTrap: FocusTrap;
  isOpen = false;
  templateContext: { $implicit: D | undefined; drawerRef: MpDrawerRef<R> } = {
    $implicit: undefined,
    drawerRef: this as MpDrawerRef<R>
  };

  get offsetTransform(): string | null {
    if (!this.isOpen || this.mpOffsetX + this.mpOffsetY === 0) {
      return null;
    }
    switch (this.mpPlacement) {
      case 'left':
        return `translateX(${this.mpOffsetX}px)`;
      case 'right':
        return `translateX(-${this.mpOffsetX}px)`;
      case 'top':
        return `translateY(${this.mpOffsetY}px)`;
      case 'bottom':
        return `translateY(-${this.mpOffsetY}px)`;
    }
  }

  get transform(): string | null {
    if (this.isOpen) {
      return null;
    }

    switch (this.mpPlacement) {
      case 'left':
        return `translateX(-100%)`;
      case 'right':
        return `translateX(100%)`;
      case 'top':
        return `translateY(-100%)`;
      case 'bottom':
        return `translateY(100%)`;
    }
  }

  get width(): string | null {
    return this.isLeftOrRight ? toCssPixel(this.mpWidth) : null;
  }

  get height(): string | null {
    return !this.isLeftOrRight ? toCssPixel(this.mpHeight) : null;
  }

  get isLeftOrRight(): boolean {
    return this.mpPlacement === 'left' || this.mpPlacement === 'right';
  }

  mpAfterOpen = new Subject<void>();
  mpAfterClose = new Subject<R>();

  get afterOpen(): Observable<void> {
    return this.mpAfterOpen.asObservable();
  }

  get afterClose(): Observable<R> {
    return this.mpAfterClose.asObservable();
  }

  isTemplateRef(value: {}): boolean {
    return value instanceof TemplateRef;
  }

  constructor(
    @Optional() @Inject(DOCUMENT) private document: MpSafeAny,
    public mpConfigService: MpConfigService,
    private renderer: Renderer2,
    private overlay: Overlay,
    private injector: Injector,
    private changeDetectorRef: ChangeDetectorRef,
    private focusTrapFactory: FocusTrapFactory,
    private viewContainerRef: ViewContainerRef,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher
  ) {
    super();
  }

  ngOnInit(): void {
    this.attachOverlay();
    this.updateOverlayStyle();
    this.updateBodyOverflow();
    this.templateContext = {
      $implicit: this.mpContentParams,
      drawerRef: this as MpDrawerRef<R>
    };
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.attachBodyContent();
    setTimeout(() => {
      this.mpOnViewInit.emit();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpPlacement, mpVisible } = changes;
    if (mpVisible) {
      const value = changes.mpVisible.currentValue;
      if (value) {
        this.open();
      } else {
        this.close();
      }
    }
    if (mpPlacement && !mpPlacement.isFirstChange()) {
      this.triggerPlacementChangeCycleOnce();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.placementChangeTimeoutId);
    this.disposeOverlay();
  }

  private getAnimationDuration(): number {
    return this.mpNoAnimation ? 0 : DRAWER_ANIMATE_DURATION;
  }

  // Disable the transition animation temporarily when the placement changing
  private triggerPlacementChangeCycleOnce(): void {
    if (!this.mpNoAnimation) {
      this.placementChanging = true;
      this.changeDetectorRef.markForCheck();
      clearTimeout(this.placementChangeTimeoutId);
      this.placementChangeTimeoutId = setTimeout(() => {
        this.placementChanging = false;
        this.changeDetectorRef.markForCheck();
      }, this.getAnimationDuration());
    }
  }

  close(result?: R): void {
    this.isOpen = false;
    this.updateOverlayStyle();
    this.overlayKeyboardDispatcher.remove(this.overlayRef!);
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.updateBodyOverflow();
      this.restoreFocus();
      this.mpAfterClose.next(result);
      this.mpAfterClose.complete();
    }, this.getAnimationDuration());
  }

  open(): void {
    this.isOpen = true;
    this.overlayKeyboardDispatcher.add(this.overlayRef!);
    this.updateOverlayStyle();
    this.updateBodyOverflow();
    this.savePreviouslyFocusedElement();
    this.trapFocus();
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.mpAfterOpen.next();
    }, this.getAnimationDuration());
  }

  closeClick(): void {
    this.mpOnClose.emit();
  }

  maskClick(): void {
    if (this.mpMaskClosable && this.mpMask) {
      this.mpOnClose.emit();
    }
  }

  private attachBodyContent(): void {
    this.bodyPortalOutlet.dispose();

    if (this.mpContent instanceof Type) {
      const childInjector = new PortalInjector(
        this.injector,
        new WeakMap([[MpDrawerRef, this]])
      );
      const componentPortal = new ComponentPortal<T>(
        this.mpContent,
        null,
        childInjector
      );
      const componentRef = this.bodyPortalOutlet.attachComponentPortal(
        componentPortal
      );
      Object.assign(componentRef.instance, this.mpContentParams);
      componentRef.changeDetectorRef.detectChanges();
    }
  }

  private attachOverlay(): void {
    if (!this.overlayRef) {
      this.portal = new TemplatePortal(
        this.drawerTemplate,
        this.viewContainerRef
      );
      this.overlayRef = this.overlay.create(this.getOverlayConfig());
    }

    if (this.overlayRef && !this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.portal);
      this.overlayRef!.keydownEvents()
        .pipe(takeUntil(this.destroy$))
        .subscribe((event: KeyboardEvent) => {
          if (event.keyCode === ESCAPE && this.isOpen && this.mpKeyboard) {
            this.mpOnClose.emit();
          }
        });
    }
  }

  private disposeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
    this.overlayRef = null;
  }

  private getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      disposeOnNavigation: true,
      positionStrategy: this.overlay.position().global(),
      scrollStrategy: this.overlay.scrollStrategies.block()
    });
  }

  private updateOverlayStyle(): void {
    if (this.overlayRef && this.overlayRef.overlayElement) {
      this.renderer.setStyle(
        this.overlayRef.overlayElement,
        'pointer-events',
        this.isOpen ? 'auto' : 'none'
      );
    }
  }

  private updateBodyOverflow(): void {
    if (this.overlayRef) {
      if (this.isOpen) {
        this.overlayRef.getConfig().scrollStrategy!.enable();
      } else {
        this.overlayRef.getConfig().scrollStrategy!.disable();
      }
    }
  }

  savePreviouslyFocusedElement(): void {
    if (this.document && !this.previouslyFocusedElement) {
      this.previouslyFocusedElement = this.document
        .activeElement as HTMLElement;
      // We need the extra check, because IE's svg element has no blur method.
      if (
        this.previouslyFocusedElement &&
        typeof this.previouslyFocusedElement.blur === 'function'
      ) {
        this.previouslyFocusedElement.blur();
      }
    }
  }

  private trapFocus(): void {
    if (!this.focusTrap && this.overlayRef && this.overlayRef.overlayElement) {
      this.focusTrap = this.focusTrapFactory.create(
        this.overlayRef!.overlayElement
      );
      this.focusTrap.focusInitialElement();
    }
  }

  private restoreFocus(): void {
    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (
      this.previouslyFocusedElement &&
      typeof this.previouslyFocusedElement.focus === 'function'
    ) {
      this.previouslyFocusedElement.focus();
    }
    if (this.focusTrap) {
      this.focusTrap.destroy();
    }
  }
}
