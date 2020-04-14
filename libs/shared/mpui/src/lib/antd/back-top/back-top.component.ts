/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { fadeMotion } from '../core/animation';
import { MpConfigService, WithConfig } from '../core/config';
import { MpScrollService } from '../core/services';
import { MpSafeAny } from '../core/types';
import { InputNumber } from '../core/util';

import { fromEvent, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

const NZ_CONFIG_COMPONENT_NAME = 'backTop';

@Component({
  selector: 'mp-back-top',
  exportAs: 'mpBackTop',
  animations: [fadeMotion],
  template: `
    <div
      class="ant-back-top"
      (click)="clickBackTop()"
      @fadeMotion
      *ngIf="visible"
    >
      <ng-template #defaultContent>
        <div class="ant-back-top-content">
          <div class="ant-back-top-icon"></div>
        </div>
      </ng-template>
      <ng-template
        [ngTemplateOutlet]="mpTemplate || defaultContent"
      ></ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class MpBackTopComponent implements OnInit, OnDestroy, OnChanges {
  private scrollListenerDestroy$ = new Subject();
  private target: HTMLElement | null = null;

  visible: boolean = false;

  @Input() mpTemplate: TemplateRef<void>;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 400)
  @InputNumber()
  mpVisibilityHeight: number;
  @Input() mpTarget: string | HTMLElement;
  @Output() readonly mpClick: EventEmitter<boolean> = new EventEmitter();

  constructor(
    @Inject(DOCUMENT) private doc: MpSafeAny,
    public mpConfigService: MpConfigService,
    private scrollSrv: MpScrollService,
    private platform: Platform,
    private cd: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.registerScrollEvent();
  }

  clickBackTop(): void {
    this.scrollSrv.scrollTo(this.getTarget(), 0);
    this.mpClick.emit(true);
  }

  private getTarget(): HTMLElement | Window {
    return this.target || window;
  }

  private handleScroll(): void {
    if (
      this.visible ===
      this.scrollSrv.getScroll(this.getTarget()) > this.mpVisibilityHeight
    ) {
      return;
    }
    this.visible = !this.visible;
    this.cd.detectChanges();
  }

  private registerScrollEvent(): void {
    if (!this.platform.isBrowser) {
      return;
    }
    this.scrollListenerDestroy$.next();
    this.handleScroll();
    this.zone.runOutsideAngular(() => {
      fromEvent(this.getTarget(), 'scroll')
        .pipe(
          throttleTime(50),
          takeUntil(this.scrollListenerDestroy$)
        )
        .subscribe(() => this.handleScroll());
    });
  }

  ngOnDestroy(): void {
    this.scrollListenerDestroy$.next();
    this.scrollListenerDestroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpTarget } = changes;
    if (mpTarget) {
      this.target =
        typeof this.mpTarget === 'string'
          ? this.doc.querySelector(this.mpTarget)
          : this.mpTarget;
      this.registerScrollEvent();
    }
  }
}
