/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';
import { MpSafeAny } from '../core/types';
import { BehaviorSubject, Subject } from 'rxjs';
import { MpMenuModeType, MpMenuThemeType } from './menu.types';

@Injectable()
export class MenuService {
  /** all descendant menu click **/
  descendantMenuItemClick$ = new Subject<MpSafeAny>();
  /** child menu item click **/
  childMenuItemClick$ = new Subject<MpSafeAny>();
  theme$ = new BehaviorSubject<MpMenuThemeType>('light');
  mode$ = new BehaviorSubject<MpMenuModeType>('vertical');
  inlineIndent$ = new BehaviorSubject<number>(24);
  isChildSubMenuOpen$ = new BehaviorSubject<boolean>(false);

  onDescendantMenuItemClick(menu: MpSafeAny): void {
    this.descendantMenuItemClick$.next(menu);
  }

  onChildMenuItemClick(menu: MpSafeAny): void {
    this.childMenuItemClick$.next(menu);
  }

  setMode(mode: MpMenuModeType): void {
    this.mode$.next(mode);
  }

  setTheme(theme: MpMenuThemeType): void {
    this.theme$.next(theme);
  }

  setInlineIndent(indent: number): void {
    this.inlineIndent$.next(indent);
  }
}
