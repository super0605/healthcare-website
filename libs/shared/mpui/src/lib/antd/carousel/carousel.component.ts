/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MpConfigService, WithConfig } from '../core/config';
import { MpDragService, MpResizeService } from '../core/services';
import { MpSafeAny } from '../core/types';
import { InputBoolean, InputNumber } from '../core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MpCarouselContentDirective } from './carousel-content.directive';
import { MpCarouselBaseStrategy } from './strategies/base-strategy';
import { MpCarouselOpacityStrategy } from './strategies/opacity-strategy';
import { MpCarouselTransformStrategy } from './strategies/transform-strategy';
import {
  FromToInterface,
  NZ_CAROUSEL_CUSTOM_STRATEGIES,
  MpCarouselDotPosition,
  MpCarouselEffects,
  MpCarouselStrategyRegistryItem,
  PointerVector
} from './typings';

const NZ_CONFIG_COMPONENT_NAME = 'carousel';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-carousel',
  exportAs: 'mpCarousel',
  preserveWhitespaces: false,
  template: `
    <div
      class="slick-initialized slick-slider"
      [class.slick-vertical]="
        mpDotPosition === 'left' || mpDotPosition === 'right'
      "
    >
      <div
        #slickList
        class="slick-list"
        tabindex="-1"
        (keydown)="onKeyDown($event)"
        (mousedown)="pointerDown($event)"
        (touchstart)="pointerDown($event)"
      >
        <!-- Render carousel items. -->
        <div class="slick-track" #slickTrack>
          <ng-content></ng-content>
        </div>
      </div>
      <!-- Render dots. -->
      <ul
        class="slick-dots"
        *ngIf="mpDots"
        [class.slick-dots-top]="mpDotPosition === 'top'"
        [class.slick-dots-bottom]="mpDotPosition === 'bottom'"
        [class.slick-dots-left]="mpDotPosition === 'left'"
        [class.slick-dots-right]="mpDotPosition === 'right'"
      >
        <li
          *ngFor="let content of carouselContents; let i = index"
          [class.slick-active]="content.isActive"
          (click)="goTo(i)"
        >
          <ng-template
            [ngTemplateOutlet]="mpDotRender || renderDotTemplate"
            [ngTemplateOutletContext]="{ $implicit: i }"
          >
          </ng-template>
        </li>
      </ul>
    </div>

    <ng-template #renderDotTemplate let-index>
      <button>{{ index + 1 }}</button>
    </ng-template>
  `,
  host: {
    '[class.ant-carousel-vertical]': 'vertical'
  }
})
export class MpCarouselComponent
  implements AfterContentInit, AfterViewInit, OnDestroy, OnChanges {
  @ContentChildren(MpCarouselContentDirective) carouselContents: QueryList<
    MpCarouselContentDirective
  >;

  @ViewChild('slickList', { static: false }) slickList: ElementRef;
  @ViewChild('slickTrack', { static: false }) slickTrack: ElementRef;

  @Input() mpDotRender: TemplateRef<{ $implicit: number }>;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'scrollx')
  mpEffect: MpCarouselEffects;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, true)
  @InputBoolean()
  mpEnableSwipe: boolean;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, true)
  @InputBoolean()
  mpDots: boolean;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  @InputBoolean()
  mpAutoPlay: boolean;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 3000)
  @InputNumber()
  mpAutoPlaySpeed: number;
  @Input() @InputNumber() mpTransitionSpeed = 500;

  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'bottom')
  set mpDotPosition(value: MpCarouselDotPosition) {
    this._dotPosition = value;
    if (value === 'left' || value === 'right') {
      this.vertical = true;
    } else {
      this.vertical = false;
    }
  }

  get mpDotPosition(): MpCarouselDotPosition {
    return this._dotPosition;
  }

  private _dotPosition: MpCarouselDotPosition;

  @Output() readonly mpBeforeChange = new EventEmitter<FromToInterface>();
  @Output() readonly mpAfterChange = new EventEmitter<number>();

  activeIndex = 0;
  el: HTMLElement;
  slickListEl: HTMLElement;
  slickTrackEl: HTMLElement;
  strategy: MpCarouselBaseStrategy;
  vertical = false;
  transitionInProgress: number | null;

  private destroy$ = new Subject<void>();
  private gestureRect: ClientRect | null = null;
  private pointerDelta: PointerVector | null = null;
  private isTransiting = false;
  private isDragging = false;

  constructor(
    elementRef: ElementRef,
    public readonly mpConfigService: MpConfigService,
    private readonly renderer: Renderer2,
    private readonly cdr: ChangeDetectorRef,
    private readonly platform: Platform,
    private readonly resizeService: MpResizeService,
    private readonly mpDragService: MpDragService,
    @Optional()
    @Inject(NZ_CAROUSEL_CUSTOM_STRATEGIES)
    private customStrategies: MpCarouselStrategyRegistryItem[]
  ) {
    this.renderer.addClass(elementRef.nativeElement, 'ant-carousel');
    this.el = elementRef.nativeElement;
  }

  ngAfterContentInit(): void {
    this.markContentActive(0);
  }

  ngAfterViewInit(): void {
    if (!this.platform.isBrowser) {
      return;
    }
    this.slickListEl = this.slickList.nativeElement;
    this.slickTrackEl = this.slickTrack.nativeElement;

    this.carouselContents.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.markContentActive(0);
        this.syncStrategy();
      });

    this.resizeService
      .subscribe()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.syncStrategy();
      });

    this.switchStrategy();
    this.markContentActive(0);
    this.syncStrategy();

    // If embedded in an entry component, it may do initial render at a inappropriate time.
    // ngZone.onStable won't do this trick
    Promise.resolve().then(() => {
      this.syncStrategy();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpEffect, mpDotPosition } = changes;

    if (mpEffect && !mpEffect.isFirstChange()) {
      this.switchStrategy();
      this.markContentActive(0);
      this.syncStrategy();
    }

    if (mpDotPosition && !mpDotPosition.isFirstChange()) {
      this.switchStrategy();
      this.markContentActive(0);
      this.syncStrategy();
    }

    if (!this.mpAutoPlay || !this.mpAutoPlaySpeed) {
      this.clearScheduledTransition();
    } else {
      this.scheduleNextTransition();
    }
  }

  ngOnDestroy(): void {
    this.clearScheduledTransition();
    if (this.strategy) {
      this.strategy.dispose();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.keyCode === LEFT_ARROW) {
      e.preventDefault();
      this.pre();
    } else if (e.keyCode === RIGHT_ARROW) {
      this.next();
      e.preventDefault();
    }
  }

  next(): void {
    this.goTo(this.activeIndex + 1);
  }

  pre(): void {
    this.goTo(this.activeIndex - 1);
  }

  goTo(index: number): void {
    if (
      this.carouselContents &&
      this.carouselContents.length &&
      !this.isTransiting
    ) {
      const length = this.carouselContents.length;
      const from = this.activeIndex;
      const to = (index + length) % length;
      this.isTransiting = true;
      this.mpBeforeChange.emit({ from, to });
      this.strategy.switch(this.activeIndex, index).subscribe(() => {
        this.scheduleNextTransition();
        this.mpAfterChange.emit(index);
        this.isTransiting = false;
      });
      this.markContentActive(to);
      this.cdr.markForCheck();
    }
  }

  private switchStrategy(): void {
    if (this.strategy) {
      this.strategy.dispose();
    }

    // Load custom strategies first.
    const customStrategy = this.customStrategies
      ? this.customStrategies.find(s => s.name === this.mpEffect)
      : null;
    if (customStrategy) {
      this.strategy = new (customStrategy.strategy as MpSafeAny)(
        this,
        this.cdr,
        this.renderer
      );
      return;
    }

    this.strategy =
      this.mpEffect === 'scrollx'
        ? new MpCarouselTransformStrategy(this, this.cdr, this.renderer)
        : new MpCarouselOpacityStrategy(this, this.cdr, this.renderer);
  }

  private scheduleNextTransition(): void {
    this.clearScheduledTransition();
    if (
      this.mpAutoPlay &&
      this.mpAutoPlaySpeed > 0 &&
      this.platform.isBrowser
    ) {
      this.transitionInProgress = setTimeout(() => {
        this.goTo(this.activeIndex + 1);
      }, this.mpAutoPlaySpeed);
    }
  }

  private clearScheduledTransition(): void {
    if (this.transitionInProgress) {
      clearTimeout(this.transitionInProgress);
      this.transitionInProgress = null;
    }
  }

  private markContentActive(index: number): void {
    this.activeIndex = index;

    if (this.carouselContents) {
      this.carouselContents.forEach((slide, i) => {
        slide.isActive = index === i;
      });
    }

    this.cdr.markForCheck();
  }

  /**
   * Drag carousel.
   */
  pointerDown = (event: TouchEvent | MouseEvent) => {
    if (!this.isDragging && !this.isTransiting && this.mpEnableSwipe) {
      this.clearScheduledTransition();
      this.gestureRect = this.slickListEl.getBoundingClientRect();

      this.mpDragService.requestDraggingSequence(event).subscribe(
        delta => {
          this.pointerDelta = delta;
          this.isDragging = true;
          this.strategy.dragging(this.pointerDelta);
        },
        () => {},
        () => {
          if (this.mpEnableSwipe && this.isDragging) {
            const xDelta = this.pointerDelta ? this.pointerDelta.x : 0;

            // Switch to another slide if delta is bigger than third of the width.
            if (Math.abs(xDelta) > this.gestureRect!.width / 3) {
              this.goTo(
                xDelta > 0 ? this.activeIndex - 1 : this.activeIndex + 1
              );
            } else {
              this.goTo(this.activeIndex);
            }

            this.gestureRect = null;
            this.pointerDelta = null;
          }

          this.isDragging = false;
        }
      );
    }
  };

  private syncStrategy(): void {
    if (this.strategy) {
      this.strategy.withCarouselContents(this.carouselContents);
    }
  }
}
