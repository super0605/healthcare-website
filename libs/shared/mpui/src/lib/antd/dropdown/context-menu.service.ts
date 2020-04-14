/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ConnectionPositionPair,
  Overlay,
  OverlayRef
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { MpContextMenuServiceModule } from './context-menu.service.module';
import { MpDropdownMenuComponent } from './dropdown-menu.component';

const listOfPositions = [
  new ConnectionPositionPair(
    { originX: 'start', originY: 'top' },
    { overlayX: 'start', overlayY: 'top' }
  ),
  new ConnectionPositionPair(
    { originX: 'start', originY: 'top' },
    { overlayX: 'start', overlayY: 'bottom' }
  ),
  new ConnectionPositionPair(
    { originX: 'start', originY: 'top' },
    { overlayX: 'end', overlayY: 'bottom' }
  ),
  new ConnectionPositionPair(
    { originX: 'start', originY: 'top' },
    { overlayX: 'end', overlayY: 'top' }
  )
];

@Injectable({
  providedIn: MpContextMenuServiceModule
})
export class MpContextMenuService {
  private overlayRef: OverlayRef | null = null;
  private closeSubscription = Subscription.EMPTY;

  constructor(private overlay: Overlay) {}

  create(
    $event: MouseEvent | { x: number; y: number },
    mpDropdownMenuComponent: MpDropdownMenuComponent
  ): void {
    this.close(true);
    const { x, y } = $event;
    if ($event instanceof MouseEvent) {
      $event.preventDefault();
    }
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo({ x, y })
      .withPositions(listOfPositions);
    this.overlayRef = this.overlay.create({
      positionStrategy,
      disposeOnNavigation: true,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });
    positionStrategy.positionChanges.subscribe(change => {
      mpDropdownMenuComponent.setValue(
        'dropDownPosition',
        change.connectionPair.overlayY === 'bottom' ? 'top' : 'bottom'
      );
    });
    this.closeSubscription = merge(
      mpDropdownMenuComponent.descendantMenuItemClick$,
      fromEvent<MouseEvent>(document, 'click').pipe(
        filter(
          event =>
            !!this.overlayRef &&
            !this.overlayRef.overlayElement.contains(
              event.target as HTMLElement
            )
        ),
        /** handle firefox contextmenu event **/
        filter(event => event.button !== 2),
        take(1)
      )
    ).subscribe(() => {
      this.close();
    });
    this.overlayRef.attach(
      new TemplatePortal(
        mpDropdownMenuComponent.templateRef,
        mpDropdownMenuComponent.viewContainerRef
      )
    );
  }

  close(clear: boolean = false): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      if (clear) {
        this.overlayRef.dispose();
      }
      this.overlayRef = null;
      this.closeSubscription.unsubscribe();
    }
  }
}
