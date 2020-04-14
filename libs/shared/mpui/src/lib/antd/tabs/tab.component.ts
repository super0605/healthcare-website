/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
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
  ViewEncapsulation
} from '@angular/core';

import { InputBoolean } from '../core/util';
import { Subject } from 'rxjs';

import { MpTabLinkDirective } from './tab-link.directive';
import { MpTabDirective } from './tab.directive';

@Component({
  selector: 'mp-tab',
  exportAs: 'mpTab',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #titleTpl>
      <ng-content select="[mp-tab-link]"></ng-content>
    </ng-template>
    <ng-template #bodyTpl>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class MpTabComponent implements OnChanges, OnDestroy {
  position: number | null = null;
  origin: number | null = null;
  isActive = false;
  readonly stateChanges = new Subject<void>();
  @ViewChild('bodyTpl', { static: true }) content: TemplateRef<void>;
  @ViewChild('titleTpl', { static: true }) title: TemplateRef<void>;
  @ContentChild(MpTabDirective, { static: false, read: TemplateRef })
  template: TemplateRef<void>;
  @ContentChild(MpTabLinkDirective, { static: false })
  linkDirective: MpTabLinkDirective;
  @Input() mpTitle: string | TemplateRef<void>;
  @Input() mpRouterIdentifier: string;
  @Input() @InputBoolean() mpForceRender = false;
  @Input() @InputBoolean() mpDisabled = false;
  @Output() readonly mpClick = new EventEmitter<void>();
  @Output() readonly mpSelect = new EventEmitter<void>();
  @Output() readonly mpDeselect = new EventEmitter<void>();

  constructor(public elementRef: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(elementRef.nativeElement, 'ant-tabs-tabpane');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mpTitle || changes.mpForceRender || changes.mpDisabled) {
      this.stateChanges.next();
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }
}
