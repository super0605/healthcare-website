/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';
import { EventEmitter } from '@angular/core';
import { MpSafeAny } from '../core/types';
import { isPromise } from '../core/util';
import { Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { BaseModalContainer } from './modal-container';
import { MpModalLegacyAPI } from './modal-legacy-api';
import { ModalOptions } from './modal-types';

export const enum MpModalState {
  OPEN,
  CLOSING,
  CLOSED
}

export const enum MpTriggerAction {
  CANCEL = 'cancel',
  OK = 'ok'
}

export class MpModalRef<T = MpSafeAny, R = MpSafeAny>
  implements MpModalLegacyAPI<T, R> {
  componentInstance: T | null;
  result?: R;
  state: MpModalState = MpModalState.OPEN;
  afterClose: Subject<R> = new Subject();
  afterOpen: Subject<void> = new Subject();

  private closeTimeout: number;

  constructor(
    private overlayRef: OverlayRef,
    private config: ModalOptions,
    public containerInstance: BaseModalContainer
  ) {
    containerInstance.animationStateChanged
      .pipe(
        filter(
          event => event.phaseName === 'done' && event.toState === 'enter'
        ),
        take(1)
      )
      .subscribe(() => {
        this.afterOpen.next();
        this.afterOpen.complete();
        if (config.mpAfterOpen instanceof EventEmitter) {
          config.mpAfterOpen.emit();
        }
      });

    containerInstance.animationStateChanged
      .pipe(
        filter(event => event.phaseName === 'done' && event.toState === 'exit'),
        take(1)
      )
      .subscribe(() => {
        clearTimeout(this.closeTimeout);
        this.overlayRef.dispose();
      });

    containerInstance.containerClick.pipe(take(1)).subscribe(() => {
      const cancelable =
        !this.config.mpCancelLoading &&
        !this.config.mpOkLoading &&
        config.mpMask &&
        config.mpMaskClosable;
      if (cancelable) {
        this.trigger(MpTriggerAction.CANCEL);
      }
    });

    overlayRef
      .keydownEvents()
      .pipe(
        filter(event => {
          return (
            (this.config.mpKeyboard as boolean) &&
            !this.config.mpCancelLoading &&
            !this.config.mpOkLoading &&
            event.keyCode === ESCAPE &&
            !hasModifierKey(event)
          );
        })
      )
      .subscribe(event => {
        event.preventDefault();
        this.trigger(MpTriggerAction.CANCEL);
      });

    containerInstance.cancelTriggered.subscribe(() =>
      this.trigger(MpTriggerAction.CANCEL)
    );

    containerInstance.okTriggered.subscribe(() =>
      this.trigger(MpTriggerAction.OK)
    );

    overlayRef.detachments().subscribe(() => {
      this.afterClose.next(this.result);
      this.afterClose.complete();
      if (config.mpAfterClose instanceof EventEmitter) {
        config.mpAfterClose.emit(this.result);
      }
      this.componentInstance = null;
      this.overlayRef.dispose();
    });
  }

  getContentComponent(): T {
    return this.componentInstance as T;
  }

  getElement(): HTMLElement {
    return this.containerInstance.getNativeElement();
  }

  destroy(result?: R): void {
    this.close(result);
  }

  triggerOk(): void {
    this.trigger(MpTriggerAction.OK);
  }

  triggerCancel(): void {
    this.trigger(MpTriggerAction.CANCEL);
  }

  /**
   * Open the modal.
   * @deprecated Opened when create, this method is useless.
   * @breaking-change 10.0.0
   */
  open(): void {
    // noop
  }

  close(result?: R): void {
    this.result = result;
    this.containerInstance.animationStateChanged
      .pipe(
        filter(event => event.phaseName === 'start'),
        take(1)
      )
      .subscribe(event => {
        this.state = MpModalState.CLOSED;
        this.overlayRef.detachBackdrop();
        this.closeTimeout = setTimeout(() => {
          this.overlayRef.dispose();
        }, event.totalTime + 100);
      });

    this.containerInstance.startExitAnimation();
    this.state = MpModalState.CLOSING;
  }

  updateConfig(config: ModalOptions): void {
    Object.assign(this.config, config);
    this.containerInstance.cdr.markForCheck();
  }

  getState(): MpModalState {
    return this.state;
  }

  getConfig(): ModalOptions {
    return this.config;
  }

  getBackdropElement(): HTMLElement | null {
    return this.overlayRef.backdropElement;
  }

  private trigger(action: MpTriggerAction): void {
    const trigger = { ok: this.config.mpOnOk, cancel: this.config.mpOnCancel }[
      action
    ];
    const loadingKey = { ok: 'mpOkLoading', cancel: 'mpCancelLoading' }[
      action
    ] as 'mpOkLoading' | 'mpCancelLoading';
    const loading = this.config[loadingKey];
    if (loading) {
      return;
    }
    if (trigger instanceof EventEmitter) {
      trigger.emit(this.getContentComponent());
    } else if (typeof trigger === 'function') {
      const result = trigger(this.getContentComponent());
      const caseClose = (doClose: boolean | void | {}) =>
        doClose !== false && this.close(doClose as R);
      if (isPromise(result)) {
        this.config[loadingKey] = true;
        const handleThen = (doClose: boolean | void | {}) => {
          this.config[loadingKey] = false;
          this.closeWhitResult(doClose);
        };
        result.then(handleThen).catch(handleThen);
      } else {
        caseClose(result);
      }
    }
  }

  private closeWhitResult(result: MpSafeAny): void {
    if (result !== false) {
      this.close(result);
    }
  }
}
