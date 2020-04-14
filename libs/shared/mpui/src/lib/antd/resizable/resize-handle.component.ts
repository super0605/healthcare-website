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
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MpResizableService } from './resizable.service';

export type MpResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topRight'
  | 'bottomRight'
  | 'bottomLeft'
  | 'topLeft';

export class MpResizeHandleMouseDownEvent {
  constructor(
    public direction: MpResizeDirection,
    public mouseEvent: MouseEvent | TouchEvent
  ) {}
}

@Component({
  selector: 'mp-resize-handle, [mp-resize-handle]',
  exportAs: 'mpResizeHandle',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"mp-resizable-handle mp-resizable-handle-" + mpDirection',
    '[class.mp-resizable-handle-box-hover]': 'entered',
    '(mousedown)': 'onMousedown($event)',
    '(touchstart)': 'onMousedown($event)'
  }
})
export class MpResizeHandleComponent implements OnInit, OnDestroy {
  @Input() mpDirection: MpResizeDirection = 'bottomRight';
  @Output() readonly mpMouseDown = new EventEmitter<
    MpResizeHandleMouseDownEvent
  >();

  entered = false;
  private destroy$ = new Subject<void>();

  constructor(
    private mpResizableService: MpResizableService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.mpResizableService.mouseEntered$
      .pipe(takeUntil(this.destroy$))
      .subscribe(entered => {
        this.entered = entered;
        this.cdr.markForCheck();
      });
  }

  onMousedown(event: MouseEvent | TouchEvent): void {
    this.mpResizableService.handleMouseDown$.next(
      new MpResizeHandleMouseDownEvent(this.mpDirection, event)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
