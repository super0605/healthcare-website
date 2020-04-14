/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ModalOptions } from './modal-types';
import { MpModalComponent } from './modal.component';

export function applyConfigDefaults(
  config: ModalOptions,
  defaultOptions: ModalOptions
): ModalOptions {
  return { ...defaultOptions, ...config };
}

/**
 * Assign the params into the content component instance.
 * @deprecated Should use dependency injection to get the params for user
 * @breaking-change 10.0.0
 */
export function setContentInstanceParams<T>(
  instance: T,
  params: Partial<T> | undefined
): void {
  Object.assign(instance, params);
}

export function getConfigFromComponent(
  component: MpModalComponent
): ModalOptions {
  const {
    mpMask,
    mpMaskClosable,
    mpClosable,
    mpOkLoading,
    mpOkDisabled,
    mpCancelDisabled,
    mpCancelLoading,
    mpKeyboard,
    mpNoAnimation,
    mpContent,
    mpComponentParams,
    mpFooter,
    mpGetContainer,
    mpZIndex,
    mpWidth,
    mpWrapClassName,
    mpClassName,
    mpStyle,
    mpTitle,
    mpCloseIcon,
    mpMaskStyle,
    mpBodyStyle,
    mpOkText,
    mpCancelText,
    mpOkType,
    mpIconType,
    mpModalType,
    mpOnOk,
    mpOnCancel,
    mpAfterOpen,
    mpAfterClose
  } = component;
  return {
    mpMask,
    mpMaskClosable,
    mpClosable,
    mpOkLoading,
    mpOkDisabled,
    mpCancelDisabled,
    mpCancelLoading,
    mpKeyboard,
    mpNoAnimation,
    mpContent,
    mpComponentParams,
    mpFooter,
    mpGetContainer,
    mpZIndex,
    mpWidth,
    mpWrapClassName,
    mpClassName,
    mpStyle,
    mpTitle,
    mpCloseIcon,
    mpMaskStyle,
    mpBodyStyle,
    mpOkText,
    mpCancelText,
    mpOkType,
    mpIconType,
    mpModalType,
    mpOnOk,
    mpOnCancel,
    mpAfterOpen,
    mpAfterClose
  };
}
