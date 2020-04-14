/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Host,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MpNoAnimationDirective } from '../core/no-animation';
import { getPlacementName, POSITION_MAP } from '../core/overlay';
import { InputBoolean } from '../core/util';
import { combineLatest, merge, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { MpMenuItemDirective } from './menu-item.directive';
import { MenuService } from './menu.service';
import { MpIsMenuInsideDropDownToken } from './menu.token';
import { MpMenuModeType, MpMenuThemeType } from './menu.types';
import { MpSubmenuService } from './submenu.service';

const listOfVerticalPositions = [
  POSITION_MAP.rightTop,
  POSITION_MAP.rightBottom,
  POSITION_MAP.leftTop,
  POSITION_MAP.leftBottom
];
const listOfHorizontalPositions = [POSITION_MAP.bottomLeft];

@Component({
  selector: '[mp-submenu]',
  exportAs: 'mpSubmenu',
  providers: [MpSubmenuService],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  template: `
    <div
      mp-submenu-title
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      [mpIcon]="mpIcon"
      [mpTitle]="mpTitle"
      [mode]="mode"
      [mpDisabled]="mpDisabled"
      [isMenuInsideDropDown]="isMenuInsideDropDown"
      [paddingLeft]="mpPaddingLeft || inlinePaddingLeft"
      (subMenuMouseState)="setMouseEnterState($event)"
      (toggleSubMenu)="toggleSubMenu()"
    >
      <ng-content select="[title]" *ngIf="!mpTitle"></ng-content>
    </div>
    <div
      *ngIf="mode === 'inline'; else nonInlineTemplate"
      mp-submenu-inline-child
      [mode]="mode"
      [mpOpen]="mpOpen"
      [@.disabled]="noAnimation?.mpNoAnimation"
      [mpNoAnimation]="noAnimation?.mpNoAnimation"
      [menuClass]="mpMenuClassName"
      [templateOutlet]="subMenuTemplate"
    ></div>
    <ng-template #nonInlineTemplate>
      <ng-template
        cdkConnectedOverlay
        (positionChange)="onPositionChange($event)"
        [cdkConnectedOverlayPositions]="overlayPositions"
        [cdkConnectedOverlayOrigin]="origin"
        [cdkConnectedOverlayWidth]="triggerWidth"
        [cdkConnectedOverlayOpen]="mpOpen"
      >
        <div
          mp-submenu-none-inline-child
          [theme]="theme"
          [mode]="mode"
          [mpOpen]="mpOpen"
          [position]="position"
          [mpDisabled]="mpDisabled"
          [isMenuInsideDropDown]="isMenuInsideDropDown"
          [templateOutlet]="subMenuTemplate"
          [menuClass]="mpMenuClassName"
          [@.disabled]="noAnimation?.mpNoAnimation"
          [mpNoAnimation]="noAnimation?.mpNoAnimation"
          (subMenuMouseState)="setMouseEnterState($event)"
        ></div>
      </ng-template>
    </ng-template>

    <ng-template #subMenuTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
  host: {
    '[class.ant-dropdown-menu-submenu]': `isMenuInsideDropDown`,
    '[class.ant-dropdown-menu-submenu-disabled]': `isMenuInsideDropDown && mpDisabled`,
    '[class.ant-dropdown-menu-submenu-open]': `isMenuInsideDropDown && mpOpen`,
    '[class.ant-dropdown-menu-submenu-selected]': `isMenuInsideDropDown && isSelected`,
    '[class.ant-dropdown-menu-submenu-vertical]': `isMenuInsideDropDown && mode === 'vertical'`,
    '[class.ant-dropdown-menu-submenu-horizontal]': `isMenuInsideDropDown && mode === 'horizontal'`,
    '[class.ant-dropdown-menu-submenu-inline]': `isMenuInsideDropDown && mode === 'inline'`,
    '[class.ant-dropdown-menu-submenu-active]': `isMenuInsideDropDown && isActive`,
    '[class.ant-menu-submenu]': `!isMenuInsideDropDown`,
    '[class.ant-menu-submenu-disabled]': `!isMenuInsideDropDown && mpDisabled`,
    '[class.ant-menu-submenu-open]': `!isMenuInsideDropDown && mpOpen`,
    '[class.ant-menu-submenu-selected]': `!isMenuInsideDropDown && isSelected`,
    '[class.ant-menu-submenu-vertical]': `!isMenuInsideDropDown && mode === 'vertical'`,
    '[class.ant-menu-submenu-horizontal]': `!isMenuInsideDropDown && mode === 'horizontal'`,
    '[class.ant-menu-submenu-inline]': `!isMenuInsideDropDown && mode === 'inline'`,
    '[class.ant-menu-submenu-active]': `!isMenuInsideDropDown && isActive`
  }
})
export class MpSubMenuComponent
  implements OnInit, OnDestroy, AfterContentInit, OnChanges {
  @Input() mpMenuClassName: string | null = null;
  @Input() mpPaddingLeft: number | null = null;
  @Input() mpTitle: string | TemplateRef<void> | null = null;
  @Input() mpIcon: string | null = null;
  @Input() @InputBoolean() mpOpen = false;
  @Input() @InputBoolean() mpDisabled = false;
  @Output() readonly mpOpenChange: EventEmitter<boolean> = new EventEmitter();
  @ViewChild(CdkOverlayOrigin, { static: true, read: ElementRef })
  cdkOverlayOrigin: ElementRef | null = null;
  @ContentChildren(MpSubMenuComponent, { descendants: true })
  listOfMpSubMenuComponent: QueryList<MpSubMenuComponent> | null = null;
  @ContentChildren(MpMenuItemDirective, { descendants: true })
  listOfMpMenuItemDirective: QueryList<MpMenuItemDirective> | null = null;
  private level = this.mpSubmenuService.level;
  private destroy$ = new Subject<void>();
  position = 'right';
  triggerWidth: number | null = null;
  theme: MpMenuThemeType = 'light';
  mode: MpMenuModeType = 'vertical';
  inlinePaddingLeft: number | null = null;
  overlayPositions = listOfVerticalPositions;
  isSelected = false;
  isActive = false;

  /** set the submenu host open status directly **/
  setOpenStateWithoutDebounce(open: boolean): void {
    this.mpSubmenuService.setOpenStateWithoutDebounce(open);
  }

  toggleSubMenu(): void {
    this.setOpenStateWithoutDebounce(!this.mpOpen);
  }

  setMouseEnterState(value: boolean): void {
    this.isActive = value;
    if (this.mode !== 'inline') {
      this.mpSubmenuService.setMouseEnterTitleOrOverlayState(value);
    }
  }

  setTriggerWidth(): void {
    if (
      this.mode === 'horizontal' &&
      this.platform.isBrowser &&
      this.cdkOverlayOrigin
    ) {
      /** TODO: fast dom **/
      this.triggerWidth = this.cdkOverlayOrigin!.nativeElement.getBoundingClientRect().width;
    }
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    const placement = getPlacementName(position);
    if (placement === 'rightTop' || placement === 'rightBottom') {
      this.position = 'right';
    } else if (placement === 'leftTop' || placement === 'leftBottom') {
      this.position = 'left';
    }
    this.cdr.markForCheck();
  }

  constructor(
    public mpMenuService: MenuService,
    private cdr: ChangeDetectorRef,
    public mpSubmenuService: MpSubmenuService,
    private platform: Platform,
    @Inject(MpIsMenuInsideDropDownToken) public isMenuInsideDropDown: boolean,
    @Host() @Optional() public noAnimation?: MpNoAnimationDirective
  ) {}

  ngOnInit(): void {
    /** submenu theme update **/
    this.mpMenuService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.theme = theme;
        this.cdr.markForCheck();
      });
    /** submenu mode update **/
    this.mpSubmenuService.mode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(mode => {
        this.mode = mode;
        if (mode === 'horizontal') {
          this.overlayPositions = listOfHorizontalPositions;
        } else if (mode === 'vertical') {
          this.overlayPositions = listOfVerticalPositions;
        }
        this.cdr.markForCheck();
      });
    /** inlineIndent update **/
    combineLatest([
      this.mpSubmenuService.mode$,
      this.mpMenuService.inlineIndent$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([mode, inlineIndent]) => {
        this.inlinePaddingLeft =
          mode === 'inline' ? this.level * inlineIndent : null;
        this.cdr.markForCheck();
      });
    /** current submenu open status **/
    this.mpSubmenuService.isCurrentSubMenuOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(open => {
        this.isActive = open;
        if (open !== this.mpOpen) {
          this.setTriggerWidth();
          this.mpOpen = open;
          this.mpOpenChange.emit(this.mpOpen);
          this.cdr.markForCheck();
        }
      });
  }

  ngAfterContentInit(): void {
    this.setTriggerWidth();
    const listOfMpMenuItemDirective = this.listOfMpMenuItemDirective;
    const changes = listOfMpMenuItemDirective!.changes;
    const mergedObservable = merge(
      ...[changes, ...listOfMpMenuItemDirective!.map(menu => menu.selected$)]
    );
    changes
      .pipe(
        startWith(listOfMpMenuItemDirective),
        switchMap(() => mergedObservable),
        startWith(true),
        map(() => listOfMpMenuItemDirective!.some(e => e.mpSelected)),
        takeUntil(this.destroy$)
      )
      .subscribe(selected => {
        this.isSelected = selected;
        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpOpen } = changes;
    if (mpOpen) {
      this.mpSubmenuService.setOpenStateWithoutDebounce(this.mpOpen);
      this.setTriggerWidth();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
