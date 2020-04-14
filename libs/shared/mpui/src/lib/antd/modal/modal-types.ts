/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayRef } from '@angular/cdk/overlay';
import {
  EventEmitter,
  TemplateRef,
  Type,
  ViewContainerRef
} from '@angular/core';
import { MpButtonShape, MpButtonSize, MpButtonType } from '../button';
import { MpSafeAny } from '../core/types';

export type OnClickCallback<T> = (
  instance: T
) => (false | void | {}) | Promise<false | void | {}>;

export type ModalTypes = 'default' | 'confirm'; // Different modal styles we have supported

export type ConfirmType = 'confirm' | 'info' | 'success' | 'error' | 'warning'; // Subtypes of Confirm Modal

export interface StyleObjectLike {
  [key: string]: string;
}

const noopFun = () => void 0;

export class ModalOptions<T = MpSafeAny, R = MpSafeAny> {
  mpClosable?: boolean = true;
  mpOkLoading?: boolean = false;
  mpOkDisabled?: boolean = false;
  mpCancelDisabled?: boolean = false;
  mpCancelLoading?: boolean = false;
  mpNoAnimation?: boolean = false;
  mpAutofocus?: 'ok' | 'cancel' | 'auto' | null = 'auto';
  mpMask?: boolean = true;
  mpMaskClosable?: boolean = true;
  mpKeyboard?: boolean = true;
  mpZIndex?: number = 1000;
  mpWidth?: number | string = 520;
  mpCloseIcon?: string | TemplateRef<void> = 'close';
  mpOkType?: MpButtonType = 'primary';
  mpModalType?: ModalTypes = 'default';
  mpOnCancel?: EventEmitter<T> | OnClickCallback<T> = noopFun;
  mpOnOk?: EventEmitter<T> | OnClickCallback<T> = noopFun;
  mpComponentParams?: Partial<T>;
  mpMaskStyle?: StyleObjectLike;
  mpBodyStyle?: StyleObjectLike;
  mpWrapClassName?: string;
  mpClassName?: string;
  mpStyle?: object;
  mpTitle?: string | TemplateRef<{}>;
  mpFooter?: string | TemplateRef<{}> | Array<ModalButtonOptions<T>> | null; // Default Modal ONLY
  mpCancelText?: string | null;
  mpOkText?: string | null;
  mpContent?: string | TemplateRef<MpSafeAny> | Type<T>;
  mpCloseOnNavigation?: boolean = true;
  mpViewContainerRef?: ViewContainerRef;

  /**
   * Reset the container element.
   * @deprecated Not supported.
   * @breaking-change 10.0.0
   */
  mpGetContainer?: HTMLElement | OverlayRef | (() => HTMLElement | OverlayRef);

  // Template use only
  mpAfterOpen?: EventEmitter<void>;
  mpAfterClose?: EventEmitter<R>;

  // Confirm
  mpIconType?: string = 'question-circle';
}

export interface ModalButtonOptions<T = MpSafeAny> {
  label: string;
  type?: MpButtonType;
  shape?: MpButtonShape;
  ghost?: boolean;
  size?: MpButtonSize;
  autoLoading?: boolean; // Default: true, indicate whether show loading automatically while onClick returned a Promise

  // [NOTE] "componentInstance" will refer to the component's instance when using Component
  show?:
    | boolean
    | ((this: ModalButtonOptions<T>, contentComponentInstance?: T) => boolean);
  loading?:
    | boolean
    | ((this: ModalButtonOptions<T>, contentComponentInstance?: T) => boolean); // This prop CAN'T use with autoLoading=true
  disabled?:
    | boolean
    | ((this: ModalButtonOptions<T>, contentComponentInstance?: T) => boolean);
  onClick?(
    this: ModalButtonOptions<T>,
    contentComponentInstance?: T
  ): MpSafeAny | Promise<MpSafeAny>;
  [key: string]: MpSafeAny;
}
