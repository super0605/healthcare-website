/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Clipboard } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../core/types';

import { MpI18nService } from '../i18n';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mp-text-copy',
  exportAs: 'mpTextCopy',
  template: `
    <button
      mp-tooltip
      mp-trans-button
      [mpTooltipTitle]="copied ? locale?.copied : locale?.copy"
      class="ant-typography-copy"
      [class.ant-typography-copy-success]="copied"
      (click)="onClick()"
    >
      <i mp-icon [mpType]="copied ? 'check' : 'copy'"></i>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class MpTextCopyComponent implements OnInit, OnDestroy {
  copied = false;
  copyId: number;
  locale: MpSafeAny = {};
  nativeElement = this.host.nativeElement;
  private destroy$ = new Subject();

  @Input() text: string;
  @Output() readonly textCopy = new EventEmitter<string>();

  constructor(
    private host: ElementRef,
    private cdr: ChangeDetectorRef,
    private clipboard: Clipboard,
    private i18n: MpI18nService
  ) {}

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Text');
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.copyId);
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClick(): void {
    if (this.copied) {
      return;
    }
    this.copied = true;
    this.cdr.detectChanges();
    const text = this.text;
    this.textCopy.emit(text);
    this.clipboard.copy(text);
    this.onCopied();
  }

  onCopied(): void {
    clearTimeout(this.copyId);
    this.copyId = setTimeout(() => {
      this.copied = false;
      this.cdr.detectChanges();
    }, 3000);
  }
}
