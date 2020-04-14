/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, TemplateRef } from '@angular/core';
import { MpSingletonService } from '../core/services';

import { MpNotificationContainerComponent } from './notification-container.component';
import { MpNotificationServiceModule } from './notification.service.module';
import {
  MpNotificationData,
  MpNotificationDataFilled,
  MpNotificationDataOptions
} from './typings';

let globalCounter = 0;

@Injectable({
  providedIn: MpNotificationServiceModule
})
export class MpNotificationService {
  private name = 'notification-';
  protected container: MpNotificationContainerComponent;
  remove(messageId?: string): void {
    if (messageId) {
      this.container.removeMessage(messageId);
    } else {
      this.container.removeMessageAll();
    }
  }

  createMessage(
    message: MpNotificationData,
    options?: MpNotificationDataOptions
  ): MpNotificationDataFilled {
    this.container = this.withContainer();
    this.mpSingletonService.registerSingletonWithKey(this.name, this.container);
    const resultMessage: MpNotificationDataFilled = {
      ...(message as MpNotificationData),
      ...{
        createdAt: new Date(),
        messageId: this.generateMessageId(),
        options
      }
    };
    this.container.createMessage(resultMessage);

    return resultMessage;
  }

  protected generateMessageId(): string {
    return `${this.name}-${globalCounter++}`;
  }

  // Manually creating container for overlay to avoid multi-checking error, see: https://github.com/NG-ZORRO/ng-zorro-antd/issues/391
  // NOTE: we never clean up the container component and it's overlay resources, if we should, we need to do it by our own codes.
  private withContainer(): MpNotificationContainerComponent {
    const containerInstance = this.mpSingletonService.getSingletonWithKey(
      this.name
    );

    if (containerInstance) {
      return containerInstance as MpNotificationContainerComponent;
    }
    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay.position().global()
    });
    const componentPortal = new ComponentPortal(
      MpNotificationContainerComponent,
      null,
      this.injector
    );
    const componentRef = overlayRef.attach(componentPortal);
    const overlayPane = overlayRef.overlayElement;
    overlayPane.style.zIndex = '1010'; // Patching: assign the same zIndex of ant-message to it's parent overlay panel, to the ant-message's zindex work.
    return componentRef.instance;
  }
  constructor(
    private mpSingletonService: MpSingletonService,
    private overlay: Overlay,
    private injector: Injector
  ) {}

  // Shortcut methods
  success(
    title: string,
    content: string,
    options?: MpNotificationDataOptions
  ): MpNotificationDataFilled {
    return this.createMessage(
      { type: 'success', title, content },
      options
    ) as MpNotificationDataFilled;
  }

  error(
    title: string,
    content: string,
    options?: MpNotificationDataOptions
  ): MpNotificationDataFilled {
    return this.createMessage(
      { type: 'error', title, content },
      options
    ) as MpNotificationDataFilled;
  }

  info(
    title: string,
    content: string,
    options?: MpNotificationDataOptions
  ): MpNotificationDataFilled {
    return this.createMessage(
      { type: 'info', title, content },
      options
    ) as MpNotificationDataFilled;
  }

  warning(
    title: string,
    content: string,
    options?: MpNotificationDataOptions
  ): MpNotificationDataFilled {
    return this.createMessage(
      { type: 'warning', title, content },
      options
    ) as MpNotificationDataFilled;
  }

  blank(
    title: string,
    content: string,
    options?: MpNotificationDataOptions
  ): MpNotificationDataFilled {
    return this.createMessage(
      { type: 'blank', title, content },
      options
    ) as MpNotificationDataFilled;
  }

  create(
    type: 'success' | 'info' | 'warning' | 'error' | 'blank' | string,
    title: string,
    content: string,
    options?: MpNotificationDataOptions
  ): MpNotificationDataFilled {
    return this.createMessage(
      { type, title, content },
      options
    ) as MpNotificationDataFilled;
  }

  // For content with template
  template(
    template: TemplateRef<{}>,
    options?: MpNotificationDataOptions
  ): MpNotificationDataFilled {
    return this.createMessage(
      { template },
      options
    ) as MpNotificationDataFilled;
  }
}
