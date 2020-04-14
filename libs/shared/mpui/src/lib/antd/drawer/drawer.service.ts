/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { MpSafeAny } from '../core/types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MpDrawerOptions, MpDrawerOptionsOfComponent } from './drawer-options';
import { MpDrawerRef } from './drawer-ref';
import { MpDrawerComponent } from './drawer.component';
import { MpDrawerServiceModule } from './drawer.service.module';

export class DrawerBuilderForService<R> {
  private drawerRef: ComponentRef<MpDrawerComponent> | null;
  private overlayRef: OverlayRef;
  private unsubscribe$ = new Subject<void>();

  constructor(private overlay: Overlay, private options: MpDrawerOptions) {
    /** pick {@link MpDrawerOptions.mpOnCancel} and omit this option */
    const { mpOnCancel, ...componentOption } = this.options;
    this.createDrawer();
    this.updateOptions(componentOption);
    // Prevent repeatedly open drawer when tap focus element.
    this.drawerRef!.instance.savePreviouslyFocusedElement();
    this.drawerRef!.instance.mpOnViewInit.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.drawerRef!.instance.open();
    });
    this.drawerRef!.instance.mpOnClose.subscribe(() => {
      if (mpOnCancel) {
        mpOnCancel().then(canClose => {
          if (canClose !== false) {
            this.drawerRef!.instance.close();
          }
        });
      } else {
        this.drawerRef!.instance.close();
      }
    });

    this.drawerRef!.instance.afterClose.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.overlayRef.dispose();
      this.drawerRef = null;
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    });
  }

  getInstance(): MpDrawerRef<R> {
    return this.drawerRef! && this.drawerRef!.instance;
  }

  createDrawer(): void {
    this.overlayRef = this.overlay.create();
    this.drawerRef = this.overlayRef.attach(
      new ComponentPortal(MpDrawerComponent)
    );
  }

  updateOptions(options: MpDrawerOptionsOfComponent): void {
    Object.assign(this.drawerRef!.instance, options);
  }
}

@Injectable({ providedIn: MpDrawerServiceModule })
export class MpDrawerService {
  constructor(private overlay: Overlay) {}

  create<T = MpSafeAny, D = MpSafeAny, R = MpSafeAny>(
    options: MpDrawerOptions<T, D>
  ): MpDrawerRef<R> {
    return new DrawerBuilderForService<R>(this.overlay, options).getInstance();
  }
}
