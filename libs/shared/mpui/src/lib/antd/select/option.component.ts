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
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { MpSafeAny } from '../core/types';
import { InputBoolean } from '../core/util';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { MpOptionGroupComponent } from './option-group.component';

@Component({
  selector: 'mp-option',
  exportAs: 'mpOption',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class MpOptionComponent implements OnChanges, OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  changes = new Subject();
  groupLabel: string | TemplateRef<MpSafeAny> | null = null;
  @ViewChild(TemplateRef, { static: true }) template: TemplateRef<MpSafeAny>;
  @Input() mpLabel: string | null = null;
  @Input() mpValue: MpSafeAny | null = null;
  @Input() @InputBoolean() mpDisabled = false;
  @Input() @InputBoolean() mpHide = false;
  @Input() @InputBoolean() mpCustomContent = false;

  constructor(
    @Optional() private mpOptionGroupComponent: MpOptionGroupComponent
  ) {}

  ngOnInit(): void {
    if (this.mpOptionGroupComponent) {
      this.mpOptionGroupComponent.changes
        .pipe(
          startWith(true),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.groupLabel = this.mpOptionGroupComponent.mpLabel;
        });
    }
  }

  ngOnChanges(): void {
    this.changes.next();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
