/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  SimpleChanges,
  SkipSelf
} from '@angular/core';
import { InputBoolean } from '../core/util';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MpMenuItemDirective } from './menu-item.directive';
import { MenuService } from './menu.service';
import {
  MpIsMenuInsideDropDownToken,
  MpMenuServiceLocalToken
} from './menu.token';
import { MpMenuModeType, MpMenuThemeType } from './menu.types';
import { MpSubMenuComponent } from './submenu.component';

export function MenuServiceFactory(
  serviceInsideDropDown: MenuService,
  serviceOutsideDropDown: MenuService
): MenuService {
  return serviceInsideDropDown ? serviceInsideDropDown : serviceOutsideDropDown;
}
export function MenuDropDownTokenFactory(
  isMenuInsideDropDownToken: boolean
): boolean {
  return isMenuInsideDropDownToken ? isMenuInsideDropDownToken : false;
}

@Directive({
  selector: '[mp-menu]',
  exportAs: 'mpMenu',
  providers: [
    {
      provide: MpMenuServiceLocalToken,
      useClass: MenuService
    },
    /** use the top level service **/
    {
      provide: MenuService,
      useFactory: MenuServiceFactory,
      deps: [
        [new SkipSelf(), new Optional(), MenuService],
        MpMenuServiceLocalToken
      ]
    },
    /** check if menu inside dropdown-menu component **/
    {
      provide: MpIsMenuInsideDropDownToken,
      useFactory: MenuDropDownTokenFactory,
      deps: [[new SkipSelf(), new Optional(), MpIsMenuInsideDropDownToken]]
    }
  ],
  host: {
    '[class.ant-dropdown-menu]': `isMenuInsideDropDown`,
    '[class.ant-dropdown-menu-root]': `isMenuInsideDropDown`,
    '[class.ant-dropdown-menu-light]': `isMenuInsideDropDown && mpTheme === 'light'`,
    '[class.ant-dropdown-menu-dark]': `isMenuInsideDropDown && mpTheme === 'dark'`,
    '[class.ant-dropdown-menu-vertical]': `isMenuInsideDropDown && actualMode === 'vertical'`,
    '[class.ant-dropdown-menu-horizontal]': `isMenuInsideDropDown && actualMode === 'horizontal'`,
    '[class.ant-dropdown-menu-inline]': `isMenuInsideDropDown && actualMode === 'inline'`,
    '[class.ant-dropdown-menu-inline-collapsed]': `isMenuInsideDropDown && mpInlineCollapsed`,
    '[class.ant-menu]': `!isMenuInsideDropDown`,
    '[class.ant-menu-root]': `!isMenuInsideDropDown`,
    '[class.ant-menu-light]': `!isMenuInsideDropDown && mpTheme === 'light'`,
    '[class.ant-menu-dark]': `!isMenuInsideDropDown && mpTheme === 'dark'`,
    '[class.ant-menu-vertical]': `!isMenuInsideDropDown && actualMode === 'vertical'`,
    '[class.ant-menu-horizontal]': `!isMenuInsideDropDown && actualMode === 'horizontal'`,
    '[class.ant-menu-inline]': `!isMenuInsideDropDown && actualMode === 'inline'`,
    '[class.ant-menu-inline-collapsed]': `!isMenuInsideDropDown && mpInlineCollapsed`
  }
})
export class MpMenuDirective
  implements AfterContentInit, OnInit, OnChanges, OnDestroy {
  @ContentChildren(MpMenuItemDirective, { descendants: true })
  listOfMpMenuItemDirective: QueryList<MpMenuItemDirective>;
  @ContentChildren(MpSubMenuComponent, { descendants: true })
  listOfMpSubMenuComponent: QueryList<MpSubMenuComponent>;
  @Input() mpInlineIndent = 24;
  @Input() mpTheme: MpMenuThemeType = 'light';
  @Input() mpMode: MpMenuModeType = 'vertical';
  @Input() @InputBoolean() mpInlineCollapsed = false;
  @Input() @InputBoolean() mpSelectable = !this.isMenuInsideDropDown;
  @Output() readonly mpClick = new EventEmitter<MpMenuItemDirective>();
  actualMode: MpMenuModeType = 'vertical';
  private inlineCollapsed$ = new BehaviorSubject<boolean>(
    this.mpInlineCollapsed
  );
  private mode$ = new BehaviorSubject<MpMenuModeType>(this.mpMode);
  private destroy$ = new Subject();
  private listOfOpenedMpSubMenuComponent: MpSubMenuComponent[] = [];

  setInlineCollapsed(inlineCollapsed: boolean): void {
    this.mpInlineCollapsed = inlineCollapsed;
    this.inlineCollapsed$.next(inlineCollapsed);
  }

  updateInlineCollapse(): void {
    if (this.listOfMpMenuItemDirective) {
      if (this.mpInlineCollapsed) {
        this.listOfOpenedMpSubMenuComponent = this.listOfMpSubMenuComponent.filter(
          submenu => submenu.mpOpen
        );
        this.listOfMpSubMenuComponent.forEach(submenu =>
          submenu.setOpenStateWithoutDebounce(false)
        );
      } else {
        this.listOfOpenedMpSubMenuComponent.forEach(submenu =>
          submenu.setOpenStateWithoutDebounce(true)
        );
        this.listOfOpenedMpSubMenuComponent = [];
      }
    }
  }

  constructor(
    private mpMenuService: MenuService,
    @Inject(MpIsMenuInsideDropDownToken) public isMenuInsideDropDown: boolean,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    combineLatest([this.inlineCollapsed$, this.mode$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([inlineCollapsed, mode]) => {
        this.actualMode = inlineCollapsed ? 'vertical' : mode;
        this.mpMenuService.setMode(this.actualMode);
        this.cdr.markForCheck();
      });
    this.mpMenuService.descendantMenuItemClick$
      .pipe(takeUntil(this.destroy$))
      .subscribe(menu => {
        this.mpClick.emit(menu);
        if (this.mpSelectable && !menu.mpMatchRouter) {
          this.listOfMpMenuItemDirective.forEach(item =>
            item.setSelectedState(item === menu)
          );
        }
      });
  }

  ngAfterContentInit(): void {
    this.inlineCollapsed$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateInlineCollapse();
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpInlineCollapsed, mpInlineIndent, mpTheme, mpMode } = changes;
    if (mpInlineCollapsed) {
      this.inlineCollapsed$.next(this.mpInlineCollapsed);
    }
    if (mpInlineIndent) {
      this.mpMenuService.setInlineIndent(this.mpInlineIndent);
    }
    if (mpTheme) {
      this.mpMenuService.setTheme(this.mpTheme);
    }
    if (mpMode) {
      this.mode$.next(this.mpMode);
      if (!changes.mpMode.isFirstChange() && this.listOfMpSubMenuComponent) {
        this.listOfMpSubMenuComponent.forEach(submenu =>
          submenu.setOpenStateWithoutDebounce(false)
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
