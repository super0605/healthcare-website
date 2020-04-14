/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterContentInit,
  ContentChildren,
  Directive,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  SimpleChanges
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkWithHref
} from '@angular/router';
import { InputBoolean } from '../core/util';
import { combineLatest, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MenuService } from './menu.service';
import { MpIsMenuInsideDropDownToken } from './menu.token';
import { MpSubmenuService } from './submenu.service';

@Directive({
  selector: '[mp-menu-item]',
  exportAs: 'mpMenuItem',
  host: {
    '[class.ant-dropdown-menu-item]': `isMenuInsideDropDown`,
    '[class.ant-dropdown-menu-item-selected]': `isMenuInsideDropDown && mpSelected`,
    '[class.ant-dropdown-menu-item-disabled]': `isMenuInsideDropDown && mpDisabled`,
    '[class.ant-menu-item]': `!isMenuInsideDropDown`,
    '[class.ant-menu-item-selected]': `!isMenuInsideDropDown && mpSelected`,
    '[class.ant-menu-item-disabled]': `!isMenuInsideDropDown && mpDisabled`,
    '[style.paddingLeft.px]': 'mpPaddingLeft || inlinePaddingLeft',
    '(click)': 'clickMenuItem($event)'
  }
})
export class MpMenuItemDirective
  implements OnInit, OnChanges, OnDestroy, AfterContentInit {
  private destroy$ = new Subject();
  level = this.mpSubmenuService ? this.mpSubmenuService.level + 1 : 1;
  selected$ = new Subject<boolean>();
  inlinePaddingLeft: number | null = null;
  @Input() mpPaddingLeft: number;
  @Input() @InputBoolean() mpDisabled = false;
  @Input() @InputBoolean() mpSelected = false;
  @Input() @InputBoolean() mpMatchRouterExact = false;
  @Input() @InputBoolean() mpMatchRouter = false;
  @ContentChildren(RouterLink, { descendants: true })
  listOfRouterLink: QueryList<RouterLink>;
  @ContentChildren(RouterLinkWithHref, { descendants: true })
  listOfRouterLinkWithHref: QueryList<RouterLinkWithHref>;

  /** clear all item selected status except this */
  clickMenuItem(e: MouseEvent): void {
    if (this.mpDisabled) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      this.mpMenuService.onDescendantMenuItemClick(this);
      if (this.mpSubmenuService) {
        /** menu item inside the submenu **/
        this.mpSubmenuService.onChildMenuItemClick(this);
      } else {
        /** menu item inside the root menu **/
        this.mpMenuService.onChildMenuItemClick(this);
      }
    }
  }

  setSelectedState(value: boolean): void {
    this.mpSelected = value;
    this.selected$.next(value);
  }

  private updateRouterActive(): void {
    if (
      !this.listOfRouterLink ||
      !this.listOfRouterLinkWithHref ||
      !this.router ||
      !this.router.navigated ||
      !this.mpMatchRouter
    ) {
      return;
    }
    Promise.resolve().then(() => {
      const hasActiveLinks = this.hasActiveLinks();
      if (this.mpSelected !== hasActiveLinks) {
        this.mpSelected = hasActiveLinks;
        this.setSelectedState(this.mpSelected);
      }
    });
  }

  private hasActiveLinks(): boolean {
    const isActiveCheckFn = this.isLinkActive(this.router!);
    return (
      (this.routerLink && isActiveCheckFn(this.routerLink)) ||
      (this.routerLinkWithHref && isActiveCheckFn(this.routerLinkWithHref)) ||
      this.listOfRouterLink.some(isActiveCheckFn) ||
      this.listOfRouterLinkWithHref.some(isActiveCheckFn)
    );
  }

  private isLinkActive(
    router: Router
  ): (link: RouterLink | RouterLinkWithHref) => boolean {
    return (link: RouterLink | RouterLinkWithHref) =>
      router.isActive(link.urlTree, this.mpMatchRouterExact);
  }

  constructor(
    private mpMenuService: MenuService,
    @Optional() private mpSubmenuService: MpSubmenuService,
    @Inject(MpIsMenuInsideDropDownToken) public isMenuInsideDropDown: boolean,
    @Optional() private routerLink?: RouterLink,
    @Optional() private routerLinkWithHref?: RouterLinkWithHref,
    @Optional() private router?: Router
  ) {
    if (router) {
      this.router!.events.pipe(
        takeUntil(this.destroy$),
        filter(e => e instanceof NavigationEnd)
      ).subscribe(() => {
        this.updateRouterActive();
      });
    }
  }

  ngOnInit(): void {
    /** store origin padding in padding */
    combineLatest([this.mpMenuService.mode$, this.mpMenuService.inlineIndent$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([mode, inlineIndent]) => {
        this.inlinePaddingLeft =
          mode === 'inline' ? this.level * inlineIndent : null;
      });
  }

  ngAfterContentInit(): void {
    this.listOfRouterLink.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateRouterActive());
    this.listOfRouterLinkWithHref.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateRouterActive());
    this.updateRouterActive();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mpSelected) {
      this.setSelectedState(this.mpSelected);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
