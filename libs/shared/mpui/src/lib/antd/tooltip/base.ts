/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  ConnectionPositionPair
} from '@angular/cdk/overlay';
import {
  AfterViewInit,
  ChangeDetectorRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { warnDeprecation } from '../core/logger';
import { MpNoAnimationDirective } from '../core/no-animation';
import {
  DEFAULT_TOOLTIP_POSITIONS,
  getPlacementName,
  POSITION_MAP
} from '../core/overlay';
import {
  NgClassInterface,
  NgStyleInterface,
  MpSafeAny,
  MpTSType
} from '../core/types';
import { isNotNil, toBoolean } from '../core/util';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

export type MpTooltipTrigger = 'click' | 'focus' | 'hover' | null;

export abstract class MpTooltipBaseDirective
  implements OnChanges, OnDestroy, AfterViewInit {
  directiveNameTitle?: MpTSType | null;
  specificTitle?: MpTSType | null;
  directiveNameContent?: MpTSType | null;
  specificContent?: MpTSType | null;
  specificTrigger?: MpTooltipTrigger;
  specificPlacement?: string;
  specificOrigin?: ElementRef<HTMLElement>;

  /**
   * @deprecated 10.0.0. This is deprecated and going to be removed in 10.0.0.
   * Please use a more specific API. Like `mpTooltipTitle`.
   */
  @Input() mpTitle: MpTSType | null;

  /**
   * @deprecated 10.0.0. This is deprecated and going to be removed in 10.0.0.
   * Please use a more specific API. Like `mpPopoverContent`.
   */
  @Input() mpContent: MpTSType | null;

  /**
   * @deprecated 10.0.0. This is deprecated and going to be removed in 10.0.0.
   * Please use a more specific API. Like `mpTooltipTrigger`.
   */
  @Input() mpTrigger: MpTooltipTrigger = 'hover';

  /**
   * @deprecated 10.0.0. This is deprecated and going to be removed in 10.0.0.
   * Please use a more specific API. Like `mpTooltipPlacement`.
   */
  @Input() mpPlacement: string = 'top';

  @Input() mpMouseEnterDelay: number = 0.15;
  @Input() mpMouseLeaveDelay: number = 0.1;
  @Input() mpOverlayClassName: string;
  @Input() mpOverlayStyle: NgStyleInterface;
  @Input() mpVisible: boolean;

  /**
   * For create tooltip dynamically. This should be override for each different component.
   */
  protected componentFactory: ComponentFactory<MpTooltipBaseComponent>;

  /**
   * This true title that would be used in other parts on this component.
   */
  protected get title(): MpTSType | null {
    return this.specificTitle || this.directiveNameTitle || this.mpTitle;
  }

  protected get content(): MpTSType | null {
    return this.specificContent || this.directiveNameContent || this.mpContent;
  }

  protected get placement(): string {
    return this.specificPlacement || this.mpPlacement;
  }

  protected get trigger(): MpTooltipTrigger {
    // MpTooltipTrigger can be null.
    return typeof this.specificTrigger !== 'undefined'
      ? this.specificTrigger
      : this.mpTrigger;
  }

  protected needProxyProperties = [
    'mpOverlayClassName',
    'mpOverlayStyle',
    'mpMouseEnterDelay',
    'mpMouseLeaveDelay',
    'mpVisible',
    'noAnimation'
  ];

  @Output() readonly mpVisibleChange = new EventEmitter<boolean>();

  visible = false;
  component: MpTooltipBaseComponent;

  protected readonly destroy$ = new Subject<void>();
  protected readonly triggerDisposables: Array<() => void> = [];

  private delayTimer?: number;

  constructor(
    public elementRef: ElementRef,
    protected hostView: ViewContainerRef,
    protected resolver: ComponentFactoryResolver,
    protected renderer: Renderer2,
    protected noAnimation?: MpNoAnimationDirective
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { mpTrigger, specificTrigger } = changes;
    const trigger = specificTrigger || mpTrigger;

    if (trigger && !trigger.isFirstChange()) {
      this.registerTriggers();
    }

    if (this.component) {
      this.updateChangedProperties(changes);
    }

    // Warn deprecated things.
    if (changes.mpTitle) {
      warnDeprecation(
        `'mpTitle' of 'mp-tooltip' is deprecated and will be removed in 10.0.0.
Please use 'mpTooltipTitle' instead. The same with 'mp-popover' and 'mp-popconfirm'.`
      );
    }

    if (changes.mpContent) {
      warnDeprecation(
        `'mpContent' of 'mp-popover' is deprecated and will be removed in 10.0.0.
Please use 'mpPopoverContent' instead.`
      );
    }

    if (changes.mpPlacement) {
      warnDeprecation(
        `'mpPlacement' of 'mp-tooltip' is deprecated and will be removed in 10.0.0.
Please use 'mpTooltipContent' instead. The same with 'mp-popover' and 'mp-popconfirm'.`
      );
    }

    if (changes.mpTrigger) {
      warnDeprecation(
        `'mpTrigger' of 'mp-tooltip' is deprecated and will be removed in 10.0.0.
Please use 'mpTooltipTrigger' instead. The same with 'mp-popover' and 'mp-popconfirm'.`
      );
    }
  }

  ngAfterViewInit(): void {
    this.createComponent();
    this.registerTriggers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Clear toggling timer. Issue #3875 #4317 #4386
    this.clearTogglingTimer();
    this.removeTriggerListeners();
  }

  show(): void {
    this.component.show();
  }

  hide(): void {
    this.component.hide();
  }

  /**
   * Force the component to update its position.
   */
  updatePosition(): void {
    if (this.component) {
      this.component.updatePosition();
    }
  }

  /**
   * Create a dynamic tooltip component. This method can be override.
   */
  protected createComponent(): void {
    const componentRef = this.hostView.createComponent(this.componentFactory);

    this.component = componentRef.instance;

    // Remove the component's DOM because it should be in the overlay container.
    this.renderer.removeChild(
      this.renderer.parentNode(this.elementRef.nativeElement),
      componentRef.location.nativeElement
    );
    this.component.setOverlayOrigin({
      elementRef: this.specificOrigin || this.elementRef
    });

    this.updateChangedProperties(this.needProxyProperties);

    this.component.mpVisibleChange
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((visible: boolean) => {
        this.visible = visible;
        this.mpVisibleChange.emit(visible);
      });
  }

  protected registerTriggers(): void {
    // When the method gets invoked, all properties has been synced to the dynamic component.
    // After removing the old API, we can just check the directive's own `mpTrigger`.
    const el = this.elementRef.nativeElement;
    const trigger = this.trigger;

    this.removeTriggerListeners();

    if (trigger === 'hover') {
      let overlayElement: HTMLElement;
      this.triggerDisposables.push(
        this.renderer.listen(el, 'mouseenter', () => {
          this.delayEnterLeave(true, true, this.mpMouseEnterDelay);
        })
      );
      this.triggerDisposables.push(
        this.renderer.listen(el, 'mouseleave', () => {
          this.delayEnterLeave(true, false, this.mpMouseLeaveDelay);
          if (this.component.overlay.overlayRef && !overlayElement) {
            overlayElement = this.component.overlay.overlayRef.overlayElement;
            this.triggerDisposables.push(
              this.renderer.listen(overlayElement, 'mouseenter', () => {
                this.delayEnterLeave(false, true);
              })
            );
            this.triggerDisposables.push(
              this.renderer.listen(overlayElement, 'mouseleave', () => {
                this.delayEnterLeave(false, false);
              })
            );
          }
        })
      );
    } else if (trigger === 'focus') {
      this.triggerDisposables.push(
        this.renderer.listen(el, 'focus', () => this.show())
      );
      this.triggerDisposables.push(
        this.renderer.listen(el, 'blur', () => this.hide())
      );
    } else if (trigger === 'click') {
      this.triggerDisposables.push(
        this.renderer.listen(el, 'click', e => {
          e.preventDefault();
          this.show();
        })
      );
    } // Else do nothing because user wants to control the visibility programmatically.
  }

  /**
   * Sync changed properties to the component and trigger change detection in that component.
   */
  protected updateChangedProperties(
    propertiesOrChanges: string[] | SimpleChanges
  ): void {
    const isArray = Array.isArray(propertiesOrChanges);
    const keys = isArray
      ? (propertiesOrChanges as string[])
      : Object.keys(propertiesOrChanges);

    keys.forEach((property: MpSafeAny) => {
      if (this.needProxyProperties.indexOf(property) !== -1) {
        // @ts-ignore
        this.updateComponentValue(property, this[property]);
      }
    });

    if (isArray) {
      this.updateComponentValue('mpTitle', this.title);
      this.updateComponentValue('mpContent', this.content);
      this.updateComponentValue('mpPlacement', this.placement);
      this.updateComponentValue('mpTrigger', this.trigger);
    } else {
      const c = propertiesOrChanges as SimpleChanges;
      if (c.specificTitle || c.directiveNameTitle || c.mpTitle) {
        this.updateComponentValue('mpTitle', this.title);
      }
      if (c.specificContent || c.directiveNameContent || c.mpContent) {
        this.updateComponentValue('mpContent', this.content);
      }
      if (c.specificTrigger || c.mpTrigger) {
        this.updateComponentValue('mpTrigger', this.trigger);
      }
      if (c.specificPlacement || c.mpPlacement) {
        this.updateComponentValue('mpPlacement', this.placement);
      }
    }

    this.component.updateByDirective();
  }

  private updateComponentValue(key: string, value: MpSafeAny): void {
    if (typeof value !== 'undefined') {
      // @ts-ignore
      this.component[key] = value;
    }
  }

  private delayEnterLeave(
    isOrigin: boolean,
    isEnter: boolean,
    delay: number = -1
  ): void {
    if (this.delayTimer) {
      this.clearTogglingTimer();
    } else if (delay > 0) {
      this.delayTimer = setTimeout(() => {
        this.delayTimer = undefined;
        isEnter ? this.show() : this.hide();
      }, delay * 1000);
    } else {
      // `isOrigin` is used due to the tooltip will not hide immediately
      // (may caused by the fade-out animation).
      isEnter && isOrigin ? this.show() : this.hide();
    }
  }

  private removeTriggerListeners(): void {
    this.triggerDisposables.forEach(dispose => dispose());
    this.triggerDisposables.length = 0;
  }

  private clearTogglingTimer(): void {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = undefined;
    }
  }
}

export abstract class MpTooltipBaseComponent implements OnDestroy {
  @ViewChild('overlay', { static: false }) overlay: CdkConnectedOverlay;

  mpVisibleChange = new Subject<boolean>();
  mpTitle: MpTSType | null;
  mpContent: MpTSType | null;
  mpOverlayClassName: string;
  mpOverlayStyle: NgStyleInterface = {};
  mpMouseEnterDelay: number;
  mpMouseLeaveDelay: number;

  set mpVisible(value: boolean) {
    const visible = toBoolean(value);
    if (this._visible !== visible) {
      this._visible = visible;
    }
  }

  get mpVisible(): boolean {
    return this._visible;
  }

  _visible = false;

  set mpTrigger(value: MpTooltipTrigger) {
    this._trigger = value;
    this._hasBackdrop = this._trigger === 'click';
  }

  get mpTrigger(): MpTooltipTrigger {
    return this._trigger;
  }

  protected _trigger: MpTooltipTrigger = 'hover';

  set mpPlacement(value: string) {
    if (value !== this.preferredPlacement) {
      this.preferredPlacement = value;
      this._positions = [POSITION_MAP[this.mpPlacement], ...this._positions];
    }
  }

  get mpPlacement(): string {
    return this.preferredPlacement;
  }

  origin: CdkOverlayOrigin;
  preferredPlacement = 'top';

  _classMap: NgClassInterface = {};
  _hasBackdrop = false;
  _prefix = 'ant-tooltip-placement';
  _positions: ConnectionPositionPair[] = [...DEFAULT_TOOLTIP_POSITIONS];

  constructor(
    public cdr: ChangeDetectorRef,
    public noAnimation?: MpNoAnimationDirective
  ) {}

  ngOnDestroy(): void {
    this.mpVisibleChange.complete();
  }

  show(): void {
    if (this.mpVisible) {
      return;
    }

    if (!this.isEmpty()) {
      this.mpVisible = true;
      this.mpVisibleChange.next(true);
      this.cdr.detectChanges();
    }
  }

  hide(): void {
    if (!this.mpVisible) {
      return;
    }

    this.mpVisible = false;
    this.mpVisibleChange.next(false);
    this.cdr.detectChanges();
  }

  updateByDirective(): void {
    this.setClassMap();
    this.cdr.detectChanges();

    Promise.resolve().then(() => {
      this.updatePosition();
      this.updateVisibilityByTitle();
    });
  }

  /**
   * Force the component to update its position.
   */
  updatePosition(): void {
    if (this.origin && this.overlay && this.overlay.overlayRef) {
      this.overlay.overlayRef.updatePosition();
    }
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    this.preferredPlacement = getPlacementName(position)!;
    this.setClassMap();
    this.cdr.detectChanges();
  }

  setClassMap(): void {
    this._classMap = {
      [this.mpOverlayClassName]: true,
      [`${this._prefix}-${this.preferredPlacement}`]: true
    };
  }

  setOverlayOrigin(origin: CdkOverlayOrigin): void {
    this.origin = origin;
    this.cdr.markForCheck();
  }

  /**
   * Hide the component while the content is empty.
   */
  private updateVisibilityByTitle(): void {
    if (this.isEmpty()) {
      this.hide();
    }
  }

  /**
   * Empty component cannot be opened.
   */
  protected abstract isEmpty(): boolean;
}

export function isTooltipEmpty(
  value: string | TemplateRef<void> | null
): boolean {
  return value instanceof TemplateRef
    ? false
    : value === '' || !isNotNil(value);
}
