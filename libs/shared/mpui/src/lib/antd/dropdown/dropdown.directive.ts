/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import { POSITION_MAP } from '../core/overlay';
import { IndexableObject } from '../core/types';
import { InputBoolean } from '../core/util';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  fromEvent,
  merge,
  Subject
} from 'rxjs';
import {
  auditTime,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import {
  MpDropdownMenuComponent,
  MpPlacementType
} from './dropdown-menu.component';

const listOfPositions = [
  POSITION_MAP.bottomLeft,
  POSITION_MAP.bottomRight,
  POSITION_MAP.topRight,
  POSITION_MAP.topLeft
];

@Directive({
  selector: '[mp-dropdown]',
  exportAs: 'mpDropdown',
  host: {
    '[attr.disabled]': `mpDisabled ? '' : null`,
    '[class.ant-dropdown-trigger]': 'true'
  }
})
export class MpDropDownDirective
  implements AfterViewInit, OnDestroy, OnChanges, OnInit {
  private portal: TemplatePortal;
  private overlayRef: OverlayRef | null = null;
  private destroy$ = new Subject();
  private positionStrategy = this.overlay
    .position()
    .flexibleConnectedTo(this.elementRef.nativeElement)
    .withLockedPosition();
  private inputVisible$ = new BehaviorSubject<boolean>(false);
  private mpTrigger$ = new BehaviorSubject<'click' | 'hover'>('hover');
  private overlayClose$ = new Subject<boolean>();
  @Input() mpDropdownMenu: MpDropdownMenuComponent | null = null;
  @Input() mpTrigger: 'click' | 'hover' = 'hover';
  @Input() mpMatchWidthElement: ElementRef | null = null;
  @Input() @InputBoolean() mpBackdrop = true;
  @Input() @InputBoolean() mpClickHide = true;
  @Input() @InputBoolean() mpDisabled = false;
  @Input() @InputBoolean() mpVisible = false;
  @Input() mpOverlayClassName: string | null = null;
  @Input() mpOverlayStyle: IndexableObject = {};
  @Input() mpPlacement: MpPlacementType = 'bottomLeft';
  @Output() readonly mpVisibleChange: EventEmitter<
    boolean
  > = new EventEmitter();

  setDropdownMenuValue<T extends keyof MpDropdownMenuComponent>(
    key: T,
    value: MpDropdownMenuComponent[T]
  ): void {
    if (this.mpDropdownMenu) {
      this.mpDropdownMenu.setValue(key, value);
    }
  }

  constructor(
    public elementRef: ElementRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.positionStrategy.positionChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(change => {
        this.setDropdownMenuValue(
          'dropDownPosition',
          change.connectionPair.originY
        );
      });
  }

  ngAfterViewInit(): void {
    if (this.mpDropdownMenu) {
      const nativeElement: HTMLElement = this.elementRef.nativeElement;
      /** host mouse state **/
      const hostMouseState$ = merge(
        fromEvent(nativeElement, 'mouseenter').pipe(mapTo(true)),
        fromEvent(nativeElement, 'mouseleave').pipe(mapTo(false))
      );
      /** menu mouse state **/
      const menuMouseState$ = this.mpDropdownMenu.mouseState$;
      /** merged mouse state **/
      const mergedMouseState$ = merge(menuMouseState$, hostMouseState$);
      /** host click state **/
      const hostClickState$ = fromEvent(nativeElement, 'click').pipe(
        mapTo(true)
      );
      /** visible state switch by mpTrigger **/
      const visibleStateByTrigger$ = this.mpTrigger$.pipe(
        switchMap(trigger => {
          if (trigger === 'hover') {
            return mergedMouseState$;
          } else if (trigger === 'click') {
            return hostClickState$;
          } else {
            return EMPTY;
          }
        })
      );
      const descendantMenuItemClick$ = this.mpDropdownMenu.descendantMenuItemClick$.pipe(
        filter(() => this.mpClickHide),
        mapTo(false)
      );
      const domTriggerVisible$ = merge(
        visibleStateByTrigger$,
        descendantMenuItemClick$,
        this.overlayClose$
      ).pipe(filter(() => !this.mpDisabled));
      const visible$ = merge(this.inputVisible$, domTriggerVisible$);
      combineLatest([visible$, this.mpDropdownMenu.isChildSubMenuOpen$])
        .pipe(
          map(([visible, sub]) => visible || sub),
          auditTime(150),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe((visible: boolean) => {
          const element = this.mpMatchWidthElement
            ? this.mpMatchWidthElement.nativeElement
            : nativeElement;
          const triggerWidth = element.getBoundingClientRect().width;
          if (this.mpVisible !== visible) {
            this.mpVisibleChange.emit(visible);
          }
          this.mpVisible = visible;
          if (visible) {
            /** set up overlayRef **/
            if (!this.overlayRef) {
              /** new overlay **/
              this.overlayRef = this.overlay.create({
                positionStrategy: this.positionStrategy,
                minWidth: triggerWidth,
                disposeOnNavigation: true,
                hasBackdrop: this.mpTrigger === 'click',
                backdropClass: this.mpBackdrop
                  ? undefined
                  : 'mp-overlay-transparent-backdrop',
                scrollStrategy: this.overlay.scrollStrategies.reposition()
              });
              merge(
                this.overlayRef.backdropClick(),
                this.overlayRef.detachments(),
                this.overlayRef
                  .keydownEvents()
                  .pipe(filter(e => e.keyCode === ESCAPE && !hasModifierKey(e)))
              )
                .pipe(
                  mapTo(false),
                  takeUntil(this.destroy$)
                )
                .subscribe(this.overlayClose$);
            } else {
              /** update overlay config **/
              const overlayConfig = this.overlayRef.getConfig();
              overlayConfig.minWidth = triggerWidth;
              overlayConfig.hasBackdrop = this.mpTrigger === 'click';
            }
            /** open dropdown with animation **/
            this.positionStrategy.withPositions([
              POSITION_MAP[this.mpPlacement],
              ...listOfPositions
            ]);
            /** reset portal if needed **/
            if (
              !this.portal ||
              this.portal.templateRef !== this.mpDropdownMenu!.templateRef
            ) {
              this.portal = new TemplatePortal(
                this.mpDropdownMenu!.templateRef,
                this.viewContainerRef
              );
            }
            this.overlayRef.attach(this.portal);
          } else {
            /** detach overlayRef if needed **/
            if (this.overlayRef) {
              this.overlayRef.detach();
            }
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {
      mpVisible,
      mpPlacement,
      mpDisabled,
      mpOverlayClassName,
      mpOverlayStyle,
      mpTrigger
    } = changes;
    if (mpTrigger) {
      this.mpTrigger$.next(this.mpTrigger);
    }
    if (mpVisible) {
      this.inputVisible$.next(this.mpVisible);
    }
    if (mpDisabled && this.mpDisabled) {
      this.inputVisible$.next(false);
    }
    if (mpOverlayClassName) {
      this.setDropdownMenuValue('mpOverlayClassName', this.mpOverlayClassName);
    }
    if (mpOverlayStyle) {
      this.setDropdownMenuValue('mpOverlayStyle', this.mpOverlayStyle);
    }
    if (mpPlacement) {
      this.setDropdownMenuValue(
        'dropDownPosition',
        this.mpPlacement.indexOf('top') !== -1 ? 'top' : 'bottom'
      );
    }
  }
}
