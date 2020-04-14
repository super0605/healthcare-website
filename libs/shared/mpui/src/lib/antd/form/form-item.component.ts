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
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';

import { warnDeprecation } from '../core/logger';
import { Subject } from 'rxjs';

export type MpFormControlStatusType =
  | 'success'
  | 'error'
  | 'warning'
  | 'validating'
  | null;

/** should add mp-row directive to host, track https://github.com/angular/angular/issues/8785 **/
@Component({
  selector: 'mp-form-item',
  exportAs: 'mpFormItem',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ant-form-item-has-success]': 'status === "success"',
    '[class.ant-form-item-has-warning]': 'status === "warning"',
    '[class.ant-form-item-has-error]': 'status === "error"',
    '[class.ant-form-item-is-validating]': 'status === "validating"',
    '[class.ant-form-item-has-feedback]': 'hasFeedback && status',
    '[class.ant-form-item-with-help]': 'withHelpClass'
  },
  template: `
    <ng-content></ng-content>
  `
})
export class MpFormItemComponent implements OnDestroy, OnDestroy {
  /**
   * @deprecated 10.0.0. 'mpFlex' is deprecated and going to be removed in 10.0.0.
   */
  @Input() set mpFlex(_: boolean) {
    warnDeprecation(
      `'mpFlex' is deprecated and going to be removed in 10.0.0.`
    );
  }

  status: MpFormControlStatusType = null;
  hasFeedback = false;
  withHelpClass = false;

  private destroy$ = new Subject();

  setWithHelpViaTips(value: boolean): void {
    this.withHelpClass = value;
    this.cdr.markForCheck();
  }

  setStatus(status: MpFormControlStatusType): void {
    this.status = status;
    this.cdr.markForCheck();
  }

  setHasFeedback(hasFeedback: boolean): void {
    this.hasFeedback = hasFeedback;
    this.cdr.markForCheck();
  }

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    renderer.addClass(elementRef.nativeElement, 'ant-form-item');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
