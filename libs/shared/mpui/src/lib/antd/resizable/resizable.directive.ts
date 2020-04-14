/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  Renderer2
} from '@angular/core';

import { ensureInBounds, InputBoolean } from '../core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { getEventWithPoint } from './resizable-utils';
import { MpResizableService } from './resizable.service';
import { MpResizeHandleMouseDownEvent } from './resize-handle.component';

export interface MpResizeEvent {
  width?: number;
  height?: number;
  col?: number;
  mouseEvent?: MouseEvent | TouchEvent;
}

@Directive({
  selector: '[mp-resizable]',
  exportAs: 'mpResizable',
  providers: [MpResizableService],
  host: {
    '[class.mp-resizable]': 'true',
    '[class.mp-resizable-resizing]': 'resizing',
    '(mouseenter)': 'onMouseenter()',
    '(mouseleave)': 'onMouseleave()'
  }
})
export class MpResizableDirective implements AfterViewInit, OnDestroy {
  @Input() mpBounds: 'window' | 'parent' | ElementRef<HTMLElement> = 'parent';
  @Input() mpMaxHeight: number;
  @Input() mpMaxWidth: number;
  @Input() mpMinHeight: number = 40;
  @Input() mpMinWidth: number = 40;
  @Input() mpGridColumnCount: number = -1;
  @Input() mpMaxColumn: number = -1;
  @Input() mpMinColumn: number = -1;
  @Input() @InputBoolean() mpLockAspectRatio: boolean = false;
  @Input() @InputBoolean() mpPreview: boolean = false;
  @Output() readonly mpResize = new EventEmitter<MpResizeEvent>();
  @Output() readonly mpResizeEnd = new EventEmitter<MpResizeEvent>();
  @Output() readonly mpResizeStart = new EventEmitter<MpResizeEvent>();

  resizing = false;
  private elRect: ClientRect | DOMRect;
  private currentHandleEvent: MpResizeHandleMouseDownEvent | null;
  private ghostElement: HTMLDivElement | null;
  private el: HTMLElement;
  private sizeCache: MpResizeEvent | null;
  private destroy$ = new Subject<void>();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private mpResizableService: MpResizableService,
    private platform: Platform,
    private ngZone: NgZone
  ) {
    this.mpResizableService.handleMouseDown$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.resizing = true;
        this.mpResizableService.startResizing(event.mouseEvent);
        this.currentHandleEvent = event;
        this.setCursor();
        this.mpResizeStart.emit({
          mouseEvent: event.mouseEvent
        });
        this.elRect = this.el.getBoundingClientRect();
      });

    this.mpResizableService.documentMouseUp$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (this.resizing) {
          this.resizing = false;
          this.mpResizableService.documentMouseUp$.next();
          this.endResize(event);
        }
      });

    this.mpResizableService.documentMouseMove$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (this.resizing) {
          this.resize(event);
        }
      });
  }

  onMouseenter(): void {
    this.mpResizableService.mouseEntered$.next(true);
  }

  onMouseleave(): void {
    this.mpResizableService.mouseEntered$.next(false);
  }

  setPosition(): void {
    const position = getComputedStyle(this.el).position;
    if (position === 'static' || !position) {
      this.renderer.setStyle(this.el, 'position', 'relative');
    }
  }

  calcSize(width: number, height: number, ratio: number): MpResizeEvent {
    let newWidth: number;
    let newHeight: number;
    let maxWidth: number;
    let maxHeight: number;
    let col = 0;
    let spanWidth = 0;
    let minWidth = this.mpMinWidth;
    let boundWidth = Infinity;
    let boundHeight = Infinity;
    if (this.mpBounds === 'parent') {
      const parent = this.renderer.parentNode(this.el);
      if (parent instanceof HTMLElement) {
        const parentRect = parent.getBoundingClientRect();
        boundWidth = parentRect.width;
        boundHeight = parentRect.height;
      }
    } else if (this.mpBounds === 'window') {
      if (typeof window !== 'undefined') {
        boundWidth = window.innerWidth;
        boundHeight = window.innerHeight;
      }
    } else if (
      this.mpBounds &&
      this.mpBounds.nativeElement &&
      this.mpBounds.nativeElement instanceof HTMLElement
    ) {
      const boundsRect = this.mpBounds.nativeElement.getBoundingClientRect();
      boundWidth = boundsRect.width;
      boundHeight = boundsRect.height;
    }

    maxWidth = ensureInBounds(this.mpMaxWidth, boundWidth);
    maxHeight = ensureInBounds(this.mpMaxHeight, boundHeight);

    if (this.mpGridColumnCount !== -1) {
      spanWidth = maxWidth / this.mpGridColumnCount;
      minWidth =
        this.mpMinColumn !== -1 ? spanWidth * this.mpMinColumn : minWidth;
      maxWidth =
        this.mpMaxColumn !== -1 ? spanWidth * this.mpMaxColumn : maxWidth;
    }

    if (ratio !== -1) {
      if (/(left|right)/i.test(this.currentHandleEvent!.direction)) {
        newWidth = Math.min(Math.max(width, minWidth), maxWidth);
        newHeight = Math.min(
          Math.max(newWidth / ratio, this.mpMinHeight),
          maxHeight
        );
        if (newHeight >= maxHeight || newHeight <= this.mpMinHeight) {
          newWidth = Math.min(Math.max(newHeight * ratio, minWidth), maxWidth);
        }
      } else {
        newHeight = Math.min(Math.max(height, this.mpMinHeight), maxHeight);
        newWidth = Math.min(Math.max(newHeight * ratio, minWidth), maxWidth);
        if (newWidth >= maxWidth || newWidth <= minWidth) {
          newHeight = Math.min(
            Math.max(newWidth / ratio, this.mpMinHeight),
            maxHeight
          );
        }
      }
    } else {
      newWidth = Math.min(Math.max(width, minWidth), maxWidth);
      newHeight = Math.min(Math.max(height, this.mpMinHeight), maxHeight);
    }

    if (this.mpGridColumnCount !== -1) {
      col = Math.round(newWidth / spanWidth);
      newWidth = col * spanWidth;
    }

    return {
      col,
      width: newWidth,
      height: newHeight
    };
  }

  setCursor(): void {
    switch (this.currentHandleEvent!.direction) {
      case 'left':
      case 'right':
        this.renderer.setStyle(document.body, 'cursor', 'ew-resize');
        break;
      case 'top':
      case 'bottom':
        this.renderer.setStyle(document.body, 'cursor', 'ns-resize');
        break;
      case 'topLeft':
      case 'bottomRight':
        this.renderer.setStyle(document.body, 'cursor', 'nwse-resize');
        break;
      case 'topRight':
      case 'bottomLeft':
        this.renderer.setStyle(document.body, 'cursor', 'nesw-resize');
        break;
    }
    this.renderer.setStyle(document.body, 'user-select', 'none');
  }

  resize(event: MouseEvent | TouchEvent): void {
    const elRect = this.elRect;
    const resizeEvent = getEventWithPoint(event);
    const handleEvent = getEventWithPoint(this.currentHandleEvent!.mouseEvent);
    let width = elRect.width;
    let height = elRect.height;
    const ratio = this.mpLockAspectRatio ? width / height : -1;
    switch (this.currentHandleEvent!.direction) {
      case 'bottomRight':
        width = resizeEvent.clientX - elRect.left;
        height = resizeEvent.clientY - elRect.top;
        break;
      case 'bottomLeft':
        width = elRect.width + handleEvent.clientX - resizeEvent.clientX;
        height = resizeEvent.clientY - elRect.top;
        break;
      case 'topRight':
        width = resizeEvent.clientX - elRect.left;
        height = elRect.height + handleEvent.clientY - resizeEvent.clientY;
        break;
      case 'topLeft':
        width = elRect.width + handleEvent.clientX - resizeEvent.clientX;
        height = elRect.height + handleEvent.clientY - resizeEvent.clientY;
        break;
      case 'top':
        height = elRect.height + handleEvent.clientY - resizeEvent.clientY;
        break;
      case 'right':
        width = resizeEvent.clientX - elRect.left;
        break;
      case 'bottom':
        height = resizeEvent.clientY - elRect.top;
        break;
      case 'left':
        width = elRect.width + handleEvent.clientX - resizeEvent.clientX;
    }
    const size = this.calcSize(width, height, ratio);
    this.sizeCache = { ...size };
    this.ngZone.run(() => {
      this.mpResize.emit({
        ...size,
        mouseEvent: event
      });
    });
    if (this.mpPreview) {
      this.previewResize(size);
    }
  }

  endResize(event: MouseEvent | TouchEvent): void {
    this.renderer.setStyle(document.body, 'cursor', '');
    this.renderer.setStyle(document.body, 'user-select', '');
    this.removeGhostElement();
    const size = this.sizeCache
      ? { ...this.sizeCache }
      : {
          width: this.elRect.width,
          height: this.elRect.height
        };
    this.ngZone.run(() => {
      this.mpResizeEnd.emit({
        ...size,
        mouseEvent: event
      });
    });
    this.sizeCache = null;
    this.currentHandleEvent = null;
  }

  previewResize({ width, height }: MpResizeEvent): void {
    this.createGhostElement();
    this.renderer.setStyle(this.ghostElement, 'width', `${width}px`);
    this.renderer.setStyle(this.ghostElement, 'height', `${height}px`);
  }

  createGhostElement(): void {
    if (!this.ghostElement) {
      this.ghostElement = this.renderer.createElement('div');
      this.renderer.setAttribute(
        this.ghostElement,
        'class',
        'mp-resizable-preview'
      );
    }
    this.renderer.appendChild(this.el, this.ghostElement);
  }

  removeGhostElement(): void {
    if (this.ghostElement) {
      this.renderer.removeChild(this.el, this.ghostElement);
    }
  }

  ngAfterViewInit(): void {
    if (this.platform.isBrowser) {
      this.el = this.elementRef.nativeElement;
      this.setPosition();
    }
  }

  ngOnDestroy(): void {
    this.ghostElement = null;
    this.sizeCache = null;
    this.destroy$.next();
    this.destroy$.complete();
  }
}
