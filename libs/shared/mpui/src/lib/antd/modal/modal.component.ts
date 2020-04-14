/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayRef } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { MpButtonType } from '../button';
import { MpConfigService, WithConfig } from '../core/config';
import { MpSafeAny } from '../core/types';
import { InputBoolean } from '../core/util';
import { Observable } from 'rxjs';

import { MpModalFooterDirective } from './modal-footer.directive';
import { MpModalLegacyAPI } from './modal-legacy-api';
import { MpModalRef } from './modal-ref';
import {
  ModalButtonOptions,
  ModalOptions,
  ModalTypes,
  OnClickCallback,
  StyleObjectLike
} from './modal-types';
import { MpModalService } from './modal.service';
import { getConfigFromComponent } from './utils';

const NZ_CONFIG_COMPONENT_NAME = 'modal';

@Component({
  selector: 'mp-modal',
  exportAs: 'mpModal',
  template: `
    <ng-template><ng-content></ng-content></ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MpModalComponent<T = MpSafeAny, R = MpSafeAny>
  implements OnChanges, MpModalLegacyAPI<T, R> {
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, true)
  @InputBoolean()
  mpMask: boolean;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, true)
  @InputBoolean()
  mpMaskClosable: boolean;
  @Input() @InputBoolean() mpVisible: boolean = false;
  @Input() @InputBoolean() mpClosable: boolean = true;
  @Input() @InputBoolean() mpOkLoading: boolean = false;
  @Input() @InputBoolean() mpOkDisabled: boolean = false;
  @Input() @InputBoolean() mpCancelDisabled: boolean = false;
  @Input() @InputBoolean() mpCancelLoading: boolean = false;
  @Input() @InputBoolean() mpKeyboard: boolean = true;
  @Input() @InputBoolean() mpNoAnimation = false;
  @Input() mpContent: string | TemplateRef<{}> | Type<T>;
  @Input() mpComponentParams: T;
  @Input() mpFooter:
    | string
    | TemplateRef<{}>
    | Array<ModalButtonOptions<T>>
    | null;
  @Input() mpGetContainer:
    | HTMLElement
    | OverlayRef
    | (() => HTMLElement | OverlayRef);
  @Input() mpZIndex: number = 1000;
  @Input() mpWidth: number | string = 520;
  @Input() mpWrapClassName: string;
  @Input() mpClassName: string;
  @Input() mpStyle: object;
  @Input() mpTitle: string | TemplateRef<{}>;
  @Input() mpCloseIcon: string | TemplateRef<void> = 'close';
  @Input() mpMaskStyle: StyleObjectLike;
  @Input() mpBodyStyle: StyleObjectLike;
  @Input() mpOkText: string | null;
  @Input() mpCancelText: string | null;
  @Input() mpOkType: MpButtonType = 'primary';
  @Input() mpIconType: string = 'question-circle'; // Confirm Modal ONLY
  @Input() mpModalType: ModalTypes = 'default';

  @Input()
  @Output()
  readonly mpOnOk: EventEmitter<T> | OnClickCallback<T> = new EventEmitter<T>();
  @Input()
  @Output()
  readonly mpOnCancel: EventEmitter<T> | OnClickCallback<T> = new EventEmitter<
    T
  >();

  @Output() readonly mpAfterOpen = new EventEmitter<void>();
  @Output() readonly mpAfterClose = new EventEmitter<R>();
  @Output() readonly mpVisibleChange = new EventEmitter<boolean>();

  @ViewChild(TemplateRef, { static: true }) contentTemplateRef: TemplateRef<{}>;
  @ContentChild(MpModalFooterDirective)
  set modalFooter(value: MpModalFooterDirective) {
    if (value && value.templateRef) {
      this.setFooterWithTemplate(value.templateRef);
    }
  }
  private modalRef: MpModalRef | null = null;

  get afterOpen(): Observable<void> {
    // Observable alias for mpAfterOpen
    return this.mpAfterOpen.asObservable();
  }

  get afterClose(): Observable<R> {
    // Observable alias for mpAfterClose
    return this.mpAfterClose.asObservable();
  }

  constructor(
    public mpConfigService: MpConfigService,
    private cdr: ChangeDetectorRef,
    private modal: MpModalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  open(): void {
    if (!this.mpVisible) {
      this.mpVisible = true;
      this.mpVisibleChange.emit(true);
    }

    if (!this.modalRef) {
      const config = this.getConfig();
      this.modalRef = this.modal.create(config);
    }
  }

  close(result?: R): void {
    if (this.mpVisible) {
      this.mpVisible = false;
      this.mpVisibleChange.emit(false);
    }

    if (this.modalRef) {
      this.modalRef.close(result);
      this.modalRef = null;
    }
  }

  destroy(result?: R): void {
    this.close(result);
  }

  triggerOk(): void {
    this.modalRef && this.modalRef.triggerOk();
  }

  triggerCancel(): void {
    this.modalRef && this.modalRef.triggerCancel();
  }

  getContentComponent(): T | void {
    return this.modalRef && this.modalRef.getContentComponent();
  }

  getElement(): HTMLElement | void {
    return this.modalRef && this.modalRef.getElement();
  }

  getModalRef(): MpModalRef | null {
    return this.modalRef;
  }

  private setFooterWithTemplate(templateRef: TemplateRef<{}>): void {
    this.mpFooter = templateRef;
    if (this.modalRef) {
      // If modalRef already created, set the footer in next tick
      Promise.resolve().then(() => {
        this.modalRef!.updateConfig({
          mpFooter: this.mpFooter
        });
      });
    }

    this.cdr.markForCheck();
  }

  private getConfig(): ModalOptions {
    const componentConfig = getConfigFromComponent(this);
    componentConfig.mpViewContainerRef = this.viewContainerRef;
    if (!this.mpContent) {
      componentConfig.mpContent = this.contentTemplateRef;
    }
    return componentConfig;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpVisible, ...otherChanges } = changes;

    if (Object.keys(otherChanges).length && this.modalRef) {
      this.modalRef.updateConfig(getConfigFromComponent(this));
    }

    if (mpVisible) {
      if (this.mpVisible) {
        this.open();
      } else {
        this.close();
      }
    }
  }
}
