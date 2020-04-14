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
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { isPromise } from '../core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MpI18nService } from '../i18n';

import { MpModalRef } from './modal-ref';
import { ModalButtonOptions, ModalOptions } from './modal-types';

@Component({
  selector: 'div[mp-modal-footer]',
  exportAs: 'MpModalFooterBuiltin',
  template: `
    <ng-container *ngIf="config.mpFooter; else defaultFooterButtons">
      <ng-container *mpStringTemplateOutlet="config.mpFooter">
        <div *ngIf="!buttonsFooter" [innerHTML]="config.mpTitle"></div>
        <ng-container *ngIf="buttonsFooter">
          <button
            *ngFor="let button of buttons"
            mp-button
            (click)="onButtonClick(button)"
            [hidden]="!getButtonCallableProp(button, 'show')"
            [mpLoading]="getButtonCallableProp(button, 'loading')"
            [disabled]="getButtonCallableProp(button, 'disabled')"
            [mpType]="button.type"
            [mpShape]="button.shape"
            [mpSize]="button.size"
            [mpGhost]="button.ghost"
          >
            {{ button.label }}
          </button>
        </ng-container>
      </ng-container>
    </ng-container>
    <ng-template #defaultFooterButtons>
      <button
        *ngIf="config.mpCancelText !== null"
        [attr.cdkFocusInitial]="config.mpAutofocus === 'cancel'"
        mp-button
        (click)="onCancel()"
        [mpLoading]="config.mpCancelLoading"
        [disabled]="config.mpCancelDisabled"
      >
        {{ config.mpCancelText || locale.cancelText }}
      </button>
      <button
        *ngIf="config.mpOkText !== null"
        [attr.cdkFocusInitial]="config.mpAutofocus === 'ok'"
        mp-button
        [mpType]="config.mpOkType"
        (click)="onOk()"
        [mpLoading]="config.mpOkLoading"
        [disabled]="config.mpOkDisabled"
      >
        {{ config.mpOkText || locale.okText }}
      </button>
    </ng-template>
  `,
  host: {
    class: 'ant-modal-footer'
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class MpModalFooterComponent implements OnDestroy {
  buttonsFooter = false;
  buttons: ModalButtonOptions[] = [];
  locale: { okText?: string; cancelText?: string } = {};
  @Output() readonly cancelTriggered = new EventEmitter<void>();
  @Output() readonly okTriggered = new EventEmitter<void>();
  @Input() modalRef: MpModalRef;
  private destroy$ = new Subject<void>();

  constructor(private i18n: MpI18nService, public config: ModalOptions) {
    if (Array.isArray(config.mpFooter)) {
      this.buttonsFooter = true;
      this.buttons = (config.mpFooter as ModalButtonOptions[]).map(
        mergeDefaultOption
      );
    }
    this.i18n.localeChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Modal');
    });
  }

  onCancel(): void {
    this.cancelTriggered.emit();
  }

  onOk(): void {
    this.okTriggered.emit();
  }

  /**
   * Returns the value of the specified key.
   * If it is a function, run and return the return value of the function.
   * @deprecated Not support use function type.
   * @breaking-change 10.0.0
   */
  getButtonCallableProp(
    options: ModalButtonOptions,
    prop: keyof ModalButtonOptions
  ): boolean {
    const value = options[prop];
    const componentInstance = this.modalRef.getContentComponent();
    return typeof value === 'function'
      ? value.apply(options, componentInstance && [componentInstance])
      : value;
  }

  /**
   * Run function based on the type and set its `loading` prop if needed.
   * @deprecated Should be set options' value by the user, not library.
   * @breaking-change 10.0.0
   */
  onButtonClick(options: ModalButtonOptions): void {
    const loading = this.getButtonCallableProp(options, 'loading');
    if (!loading) {
      const result = this.getButtonCallableProp(options, 'onClick');
      if (options.autoLoading && isPromise(result)) {
        options.loading = true;
        result
          .then(() => (options.loading = false))
          .catch(() => (options.loading = false));
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

function mergeDefaultOption(options: ModalButtonOptions): ModalButtonOptions {
  return {
    type: null,
    size: 'default',
    autoLoading: true,
    show: true,
    loading: false,
    disabled: false,
    ...options
  };
}
