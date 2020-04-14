/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Inject, Injectable, Optional, SkipSelf } from '@angular/core';
import { MpSafeAny } from '../core/types';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  Subject
} from 'rxjs';
import {
  auditTime,
  distinctUntilChanged,
  filter,
  flatMap,
  map,
  mapTo
} from 'rxjs/operators';
import { MenuService } from './menu.service';
import { MpIsMenuInsideDropDownToken } from './menu.token';
import { MpMenuModeType } from './menu.types';

@Injectable()
export class MpSubmenuService {
  mode$: Observable<MpMenuModeType> = this.mpMenuService.mode$.pipe(
    map(mode => {
      if (mode === 'inline') {
        return 'inline';
        /** if inside another submenu, set the mode to vertical **/
      } else if (mode === 'vertical' || this.mpHostSubmenuService) {
        return 'vertical';
      } else {
        return 'horizontal';
      }
    })
  );
  level = 1;
  isCurrentSubMenuOpen$ = new BehaviorSubject<boolean>(false);
  private isChildSubMenuOpen$ = new BehaviorSubject<boolean>(false);
  /** submenu title & overlay mouse enter status **/
  private isMouseEnterTitleOrOverlay$ = new Subject<boolean>();
  private childMenuItemClick$ = new Subject<MpSafeAny>();
  /**
   * menu item inside submenu clicked
   * @param menu
   */
  onChildMenuItemClick(menu: MpSafeAny): void {
    this.childMenuItemClick$.next(menu);
  }
  setOpenStateWithoutDebounce(value: boolean): void {
    this.isCurrentSubMenuOpen$.next(value);
  }
  setMouseEnterTitleOrOverlayState(value: boolean): void {
    this.isMouseEnterTitleOrOverlay$.next(value);
  }

  constructor(
    @SkipSelf() @Optional() private mpHostSubmenuService: MpSubmenuService,
    public mpMenuService: MenuService,
    @Inject(MpIsMenuInsideDropDownToken) public isMenuInsideDropDown: boolean
  ) {
    if (this.mpHostSubmenuService) {
      this.level = this.mpHostSubmenuService.level + 1;
    }
    /** close if menu item clicked **/
    const isClosedByMenuItemClick = this.childMenuItemClick$.pipe(
      flatMap(() => this.mode$),
      filter(mode => mode !== 'inline' || this.isMenuInsideDropDown),
      mapTo(false)
    );
    const isCurrentSubmenuOpen$ = merge(
      this.isMouseEnterTitleOrOverlay$,
      isClosedByMenuItemClick
    );
    /** combine the child submenu status with current submenu status to calculate host submenu open **/
    const isSubMenuOpenWithDebounce$ = combineLatest([
      this.isChildSubMenuOpen$,
      isCurrentSubmenuOpen$
    ]).pipe(
      map(
        ([isChildSubMenuOpen, isCurrentSubmenuOpen]) =>
          isChildSubMenuOpen || isCurrentSubmenuOpen
      ),
      auditTime(150),
      distinctUntilChanged()
    );
    isSubMenuOpenWithDebounce$.pipe(distinctUntilChanged()).subscribe(data => {
      this.setOpenStateWithoutDebounce(data);
      if (this.mpHostSubmenuService) {
        /** set parent submenu's child submenu open status **/
        this.mpHostSubmenuService.isChildSubMenuOpen$.next(data);
      } else {
        this.mpMenuService.isChildSubMenuOpen$.next(data);
      }
    });
  }
}
