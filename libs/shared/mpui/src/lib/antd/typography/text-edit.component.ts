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
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../core/types';

import { MpI18nService } from '../i18n';
import { MpAutosizeDirective } from '../input';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mp-text-edit',
  exportAs: 'mpTextEdit',
  template: `
    <button
      *ngIf="!editing"
      [mpTooltipTitle]="locale?.edit"
      mp-tooltip
      mp-trans-button
      class="ant-typography-edit"
      (click)="onClick()"
    >
      <i mp-icon mpType="edit"></i>
    </button>
    <ng-container *ngIf="editing">
      <textarea
        #textarea
        mp-input
        mpAutosize
        (input)="onInput($event)"
        (blur)="confirm()"
        (keydown.esc)="onCancel()"
        (keydown.enter)="onEnter($event)"
      >
      </textarea>
      <button
        mp-trans-button
        class="ant-typography-edit-content-confirm"
        (click)="confirm()"
      >
        <i mp-icon mpType="enter"></i>
      </button>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class MpTextEditComponent implements OnInit, OnDestroy {
  editing = false;
  locale: MpSafeAny = {};
  private destroy$ = new Subject();

  @Input() text: string;
  @Output() readonly startEditing = new EventEmitter<void>();
  @Output() readonly endEditing = new EventEmitter<string>();
  @ViewChild('textarea', { static: false }) textarea: ElementRef<
    HTMLTextAreaElement
  >;
  @ViewChild(MpAutosizeDirective, { static: false })
  autosizeDirective: MpAutosizeDirective;

  beforeText: string;
  currentText: string;
  nativeElement = this.host.nativeElement;
  constructor(
    private host: ElementRef,
    private cdr: ChangeDetectorRef,
    private i18n: MpI18nService
  ) {}

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Text');
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClick(): void {
    this.beforeText = this.text;
    this.currentText = this.beforeText;
    this.editing = true;
    this.startEditing.emit();
    this.focusAndSetValue();
  }

  confirm(): void {
    this.editing = false;
    this.endEditing.emit(this.currentText);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.currentText = target.value;
  }

  onEnter(event: KeyboardEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.confirm();
  }

  onCancel(): void {
    this.currentText = this.beforeText;
    this.confirm();
  }

  focusAndSetValue(): void {
    setTimeout(() => {
      if (this.textarea && this.textarea.nativeElement) {
        this.textarea.nativeElement.focus();
        this.textarea.nativeElement.value = this.currentText;
        this.autosizeDirective.resizeToFitContent();
      }
    });
  }
}
