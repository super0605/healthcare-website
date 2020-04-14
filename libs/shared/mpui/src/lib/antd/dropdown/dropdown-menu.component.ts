/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  Optional,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { slideMotion } from '../core/animation';
import { MpNoAnimationDirective } from '../core/no-animation';
import { IndexableObject, MpSafeAny } from '../core/types';
import { MenuService, MpIsMenuInsideDropDownToken } from '../menu';
import { BehaviorSubject } from 'rxjs';

export type MpPlacementType =
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'topLeft'
  | 'topCenter'
  | 'topRight';

@Component({
  selector: `mp-dropdown-menu`,
  exportAs: `mpDropdownMenu`,
  animations: [slideMotion],
  providers: [
    MenuService,
    /** menu is inside dropdown-menu component **/
    {
      provide: MpIsMenuInsideDropDownToken,
      useValue: true
    }
  ],
  template: `
    <ng-template>
      <div
        class="ant-dropdown"
        [class]="mpOverlayClassName"
        [ngStyle]="mpOverlayStyle"
        [@slideMotion]="dropDownPosition"
        [@.disabled]="noAnimation?.mpNoAnimation"
        [mpNoAnimation]="noAnimation?.mpNoAnimation"
        (mouseenter)="setMouseState(true)"
        (mouseleave)="setMouseState(false)"
      >
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MpDropdownMenuComponent implements AfterContentInit {
  dropDownPosition: 'top' | 'center' | 'bottom' = 'bottom';
  mouseState$ = new BehaviorSubject<boolean>(false);
  isChildSubMenuOpen$ = this.mpMenuService.isChildSubMenuOpen$;
  descendantMenuItemClick$ = this.mpMenuService.descendantMenuItemClick$;
  mpOverlayClassName: string | null = null;
  mpOverlayStyle: IndexableObject = {};
  @ViewChild(TemplateRef, { static: true }) templateRef: TemplateRef<MpSafeAny>;

  setMouseState(visible: boolean): void {
    this.mouseState$.next(visible);
  }

  setValue<T extends keyof MpDropdownMenuComponent>(
    key: T,
    value: this[T]
  ): void {
    this[key] = value;
    this.cdr.markForCheck();
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public viewContainerRef: ViewContainerRef,
    public mpMenuService: MenuService,
    @Host() @Optional() public noAnimation?: MpNoAnimationDirective
  ) {}

  ngAfterContentInit(): void {
    this.renderer.removeChild(
      this.renderer.parentNode(this.elementRef.nativeElement),
      this.elementRef.nativeElement
    );
  }
}
