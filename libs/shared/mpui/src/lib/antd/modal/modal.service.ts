/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ComponentType,
  Overlay,
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';
import {
  ComponentPortal,
  PortalInjector,
  TemplatePortal
} from '@angular/cdk/portal';
import {
  Injectable,
  Injector,
  OnDestroy,
  Optional,
  SkipSelf,
  TemplateRef
} from '@angular/core';
import { warn } from '../core/logger';
import { IndexableObject, MpSafeAny } from '../core/types';
import { isNotNil } from '../core/util';
import { defer, Observable, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { MpModalConfirmContainerComponent } from './modal-confirm-container.component';
import { BaseModalContainer } from './modal-container';
import { MpModalContainerComponent } from './modal-container.component';
import { MpModalRef } from './modal-ref';
import { ConfirmType, ModalOptions } from './modal-types';
import { applyConfigDefaults, setContentInstanceParams } from './utils';

const MODAL_MASK_CLASS_NAME = 'ant-modal-mask';
type ContentType<T> = ComponentType<T> | TemplateRef<T> | string;

@Injectable()
export class MpModalService implements OnDestroy {
  private openModalsAtThisLevel: MpModalRef[] = [];
  private readonly afterAllClosedAtThisLevel = new Subject<void>();

  get openModals(): MpModalRef[] {
    return this.parentModal
      ? this.parentModal.openModals
      : this.openModalsAtThisLevel;
  }

  get _afterAllClosed(): Subject<void> {
    const parent = this.parentModal;
    return parent ? parent._afterAllClosed : this.afterAllClosedAtThisLevel;
  }

  readonly afterAllClose: Observable<void> = defer(() =>
    this.openModals.length
      ? this._afterAllClosed
      : this._afterAllClosed.pipe(startWith(undefined))
  ) as Observable<void>;

  constructor(
    private overlay: Overlay,
    private injector: Injector,
    @Optional() @SkipSelf() private parentModal: MpModalService
  ) {}

  create<T, R = MpSafeAny>(config: ModalOptions<T, R>): MpModalRef<T, R> {
    return this.open<T, R>(config.mpContent as ComponentType<T>, config);
  }

  closeAll(): void {
    this.closeModals(this.openModals);
  }

  confirm<T>(
    options: ModalOptions<T> = {},
    confirmType: ConfirmType = 'confirm'
  ): MpModalRef<T> {
    if ('mpFooter' in options) {
      warn(
        `The Confirm-Modal doesn't support "mpFooter", this property will be ignored.`
      );
    }
    if (!('mpWidth' in options)) {
      options.mpWidth = 416;
    }
    if (!('mpMaskClosable' in options)) {
      options.mpMaskClosable = false;
    }

    options.mpModalType = 'confirm';
    options.mpClassName = `ant-modal-confirm ant-modal-confirm-${confirmType} ${options.mpClassName ||
      ''}`;
    return this.create(options);
  }

  info<T>(options: ModalOptions<T> = {}): MpModalRef<T> {
    return this.confirmFactory(options, 'info');
  }

  success<T>(options: ModalOptions<T> = {}): MpModalRef<T> {
    return this.confirmFactory(options, 'success');
  }

  error<T>(options: ModalOptions<T> = {}): MpModalRef<T> {
    return this.confirmFactory(options, 'error');
  }

  warning<T>(options: ModalOptions<T> = {}): MpModalRef<T> {
    return this.confirmFactory(options, 'warning');
  }

  private open<T, R>(
    componentOrTemplateRef: ContentType<T>,
    config?: ModalOptions
  ): MpModalRef<T, R> {
    const configMerged = applyConfigDefaults(config || {}, new ModalOptions());
    const overlayRef = this.createOverlay(configMerged);
    const modalContainer = this.attachModalContainer(overlayRef, configMerged);
    const modalRef = this.attachModalContent<T, R>(
      componentOrTemplateRef,
      modalContainer,
      overlayRef,
      configMerged
    );
    modalContainer.modalRef = modalRef;

    this.openModals.push(modalRef);
    modalRef.afterClose.subscribe(() => this.removeOpenModal(modalRef));

    return modalRef;
  }

  private removeOpenModal(modalRef: MpModalRef): void {
    const index = this.openModals.indexOf(modalRef);
    if (index > -1) {
      this.openModals.splice(index, 1);

      if (!this.openModals.length) {
        this._afterAllClosed.next();
      }
    }
  }

  private closeModals(dialogs: MpModalRef[]): void {
    let i = dialogs.length;
    while (i--) {
      dialogs[i].close();
      if (!this.openModals.length) {
        this._afterAllClosed.next();
      }
    }
  }

  private createOverlay(config: ModalOptions): OverlayRef {
    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global(),
      disposeOnNavigation: config.mpCloseOnNavigation
    });

    if (config.mpMask) {
      overlayConfig.backdropClass = MODAL_MASK_CLASS_NAME;
    }

    return this.overlay.create(overlayConfig);
  }

  private attachModalContainer(
    overlayRef: OverlayRef,
    config: ModalOptions
  ): BaseModalContainer {
    const userInjector =
      config && config.mpViewContainerRef && config.mpViewContainerRef.injector;
    const injector = new PortalInjector(
      userInjector || this.injector,
      new WeakMap<MpSafeAny, MpSafeAny>([
        [OverlayRef, overlayRef],
        [ModalOptions, config]
      ])
    );

    const ContainerComponent =
      config.mpModalType === 'confirm'
        ? // If the mode is `confirm`, use `MpModalConfirmContainerComponent`
          MpModalConfirmContainerComponent
        : // If the mode is not `confirm`, use `MpModalContainerComponent`
          MpModalContainerComponent;

    const containerPortal = new ComponentPortal<BaseModalContainer>(
      ContainerComponent,
      config.mpViewContainerRef,
      injector
    );
    const containerRef = overlayRef.attach<BaseModalContainer>(containerPortal);

    return containerRef.instance;
  }

  private attachModalContent<T, R>(
    componentOrTemplateRef: ContentType<T>,
    modalContainer: BaseModalContainer,
    overlayRef: OverlayRef,
    config: ModalOptions<T>
  ): MpModalRef<T, R> {
    const modalRef = new MpModalRef<T, R>(overlayRef, config, modalContainer);

    if (componentOrTemplateRef instanceof TemplateRef) {
      modalContainer.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplateRef, null!, {
          $implicit: config.mpComponentParams,
          modalRef
        } as MpSafeAny)
      );
    } else if (
      isNotNil(componentOrTemplateRef) &&
      typeof componentOrTemplateRef !== 'string'
    ) {
      const injector = this.createInjector<T, R>(modalRef, config);
      const contentRef = modalContainer.attachComponentPortal<T>(
        new ComponentPortal(
          componentOrTemplateRef,
          config.mpViewContainerRef,
          injector
        )
      );
      setContentInstanceParams<T>(
        contentRef.instance,
        config.mpComponentParams
      );
      modalRef.componentInstance = contentRef.instance;
    }
    return modalRef;
  }

  private createInjector<T, R>(
    modalRef: MpModalRef<T, R>,
    config: ModalOptions<T>
  ): PortalInjector {
    const userInjector =
      config && config.mpViewContainerRef && config.mpViewContainerRef.injector;
    const injectionTokens = new WeakMap<MpSafeAny, MpSafeAny>([
      [MpModalRef, modalRef]
    ]);

    return new PortalInjector(userInjector || this.injector, injectionTokens);
  }

  private confirmFactory<T>(
    options: ModalOptions<T> = {},
    confirmType: ConfirmType
  ): MpModalRef<T> {
    const iconMap: IndexableObject = {
      info: 'info-circle',
      success: 'check-circle',
      error: 'close-circle',
      warning: 'exclamation-circle'
    };
    if (!('mpIconType' in options)) {
      options.mpIconType = iconMap[confirmType];
    }
    if (!('mpCancelText' in options)) {
      // Remove the Cancel button if the user not specify a Cancel button
      options.mpCancelText = null;
    }
    return this.confirm(options, confirmType);
  }

  ngOnDestroy(): void {
    this.closeModals(this.openModalsAtThisLevel);
    this.afterAllClosedAtThisLevel.complete();
  }
}
