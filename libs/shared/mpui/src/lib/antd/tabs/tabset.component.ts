/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

/** get some code from https://github.com/angular/material2 */

import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkWithHref
} from '@angular/router';
import { MpConfigService, WithConfig } from '../core/config';
import { PREFIX } from '../core/logger';
import { MpSizeLDSType } from '../core/types';
import { InputBoolean, toNumber, wrapIntoObservable } from '../core/util';

import { merge, Subject, Subscription } from 'rxjs';
import { filter, first, startWith, takeUntil } from 'rxjs/operators';
import { MpTabComponent } from './tab.component';
import {
  MpAnimatedInterface,
  MpTabChangeEvent,
  MpTabPosition,
  MpTabPositionMode,
  MpTabsCanDeactivateFn,
  MpTabType
} from './table.types';
import { MpTabsNavComponent } from './tabs-nav.component';

const NZ_CONFIG_COMPONENT_NAME = 'tabs';

@Component({
  selector: 'mp-tabset',
  exportAs: 'mpTabset',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="listOfMpTabComponent">
      <mp-tabs-nav
        role="tablist"
        tabindex="0"
        [mpSize]="mpSize"
        [mpTabPosition]="mpTabPosition"
        [mpType]="mpType"
        [mpShowPagination]="mpShowPagination"
        [mpPositionMode]="tabPositionMode"
        [mpAnimated]="inkBarAnimated"
        [ngStyle]="mpTabBarStyle"
        [mpHideBar]="mpHideAll"
        [mpTabBarExtraContent]="mpTabBarExtraContent"
        [selectedIndex]="mpSelectedIndex"
        (mpOnNextClick)="mpOnNextClick.emit()"
        (mpOnPrevClick)="mpOnPrevClick.emit()"
      >
        <div
          mp-tab-label
          role="tab"
          [style.margin-right.px]="mpTabBarGutter"
          [class.ant-tabs-tab-active]="mpSelectedIndex == i && !mpHideAll"
          [disabled]="tab.mpDisabled"
          (click)="clickLabel(i, tab.mpDisabled)"
          *ngFor="let tab of listOfMpTabComponent; let i = index"
        >
          <ng-container *mpStringTemplateOutlet="tab.mpTitle || tab.title">{{
            tab.mpTitle
          }}</ng-container>
        </div>
      </mp-tabs-nav>
      <div
        #tabContent
        class="ant-tabs-content"
        [class.ant-tabs-top-content]="mpTabPosition === 'top'"
        [class.ant-tabs-bottom-content]="mpTabPosition === 'bottom'"
        [class.ant-tabs-left-content]="mpTabPosition === 'left'"
        [class.ant-tabs-right-content]="mpTabPosition === 'right'"
        [class.ant-tabs-content-animated]="tabPaneAnimated"
        [class.ant-tabs-card-content]="mpType === 'card'"
        [class.ant-tabs-content-no-animated]="!tabPaneAnimated"
        [style.margin-left.%]="
          tabPositionMode === 'horizontal' &&
          tabPaneAnimated &&
          -(mpSelectedIndex || 0) * 100
        "
      >
        <div
          mp-tab-body
          class="ant-tabs-tabpane"
          *ngFor="let tab of listOfMpTabComponent; let i = index"
          [active]="mpSelectedIndex == i && !mpHideAll"
          [forceRender]="tab.mpForceRender"
          [content]="tab.template || tab.content"
        ></div>
      </div>
    </ng-container>
  `,
  host: {
    '[class]': 'hostClassMap'
  }
})
export class MpTabSetComponent
  implements
    AfterContentChecked,
    OnInit,
    OnChanges,
    AfterContentInit,
    OnDestroy {
  private indexToSelect: number | null = 0;
  private el: HTMLElement = this.elementRef.nativeElement;
  private _selectedIndex: number | null = null;
  /** Subscription to tabs being added/removed. */
  private tabsSubscription = Subscription.EMPTY;
  /** Subscription to changes in the tab labels. */
  private tabLabelSubscription = Subscription.EMPTY;
  private destroy$ = new Subject<void>();
  tabPositionMode: MpTabPositionMode = 'horizontal';
  hostClassMap = {};
  @ContentChildren(MpTabComponent) listOfMpTabComponent: QueryList<
    MpTabComponent
  >;
  @ViewChild(MpTabsNavComponent, { static: false })
  mpTabsNavComponent: MpTabsNavComponent;
  @ViewChild('tabContent', { static: false }) tabContent: ElementRef;

  @Input() mpTabBarExtraContent: TemplateRef<void>;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, true)
  mpShowPagination: boolean;
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME, true) mpAnimated:
    | MpAnimatedInterface
    | boolean;
  @Input() mpHideAll = false;
  @Input() mpTabPosition: MpTabPosition = 'top';
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'default')
  mpSize: MpSizeLDSType;
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME) mpTabBarGutter: number;
  @Input() mpTabBarStyle: { [key: string]: string };
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'line') mpType: MpTabType;

  @Input() @InputBoolean() mpLinkRouter = false;
  @Input() @InputBoolean() mpLinkExact = true;
  @Input() mpCanDeactivate: MpTabsCanDeactivateFn | null = null;

  @Output() readonly mpOnNextClick = new EventEmitter<void>();
  @Output() readonly mpOnPrevClick = new EventEmitter<void>();
  @Output() readonly mpSelectChange: EventEmitter<
    MpTabChangeEvent
  > = new EventEmitter<MpTabChangeEvent>(true);
  @Output() readonly mpSelectedIndexChange: EventEmitter<
    number
  > = new EventEmitter<number>();

  @Input()
  set mpSelectedIndex(value: number | null) {
    this.indexToSelect = value ? toNumber(value, null) : null;
  }

  get mpSelectedIndex(): number | null {
    return this._selectedIndex;
  }

  get inkBarAnimated(): boolean {
    return (
      this.mpAnimated === true ||
      (this.mpAnimated as MpAnimatedInterface).inkBar === true
    );
  }

  get tabPaneAnimated(): boolean {
    return (
      this.mpAnimated === true ||
      (this.mpAnimated as MpAnimatedInterface).tabPane === true
    );
  }

  setPosition(value: MpTabPosition): void {
    if (this.tabContent) {
      if (value === 'bottom') {
        this.renderer.insertBefore(
          this.el,
          this.tabContent.nativeElement,
          this.mpTabsNavComponent.elementRef.nativeElement
        );
      } else {
        this.renderer.insertBefore(
          this.el,
          this.mpTabsNavComponent.elementRef.nativeElement,
          this.tabContent.nativeElement
        );
      }
    }
  }

  setClassMap(): void {
    this.hostClassMap = {
      [`ant-tabs`]: true,
      [`ant-tabs-vertical`]:
        this.mpTabPosition === 'left' || this.mpTabPosition === 'right',
      [`ant-tabs-${this.mpTabPosition}`]: this.mpTabPosition,
      [`ant-tabs-no-animation`]:
        this.mpAnimated === false ||
        (this.mpAnimated as MpAnimatedInterface).tabPane === false,
      [`ant-tabs-${this.mpType}`]: this.mpType,
      [`ant-tabs-large`]: this.mpSize === 'large',
      [`ant-tabs-small`]: this.mpSize === 'small'
    };
  }

  clickLabel(index: number, disabled: boolean): void {
    if (!disabled) {
      if (
        this.mpSelectedIndex !== null &&
        this.mpSelectedIndex !== index &&
        typeof this.mpCanDeactivate === 'function'
      ) {
        const observable = wrapIntoObservable(
          this.mpCanDeactivate(this.mpSelectedIndex, index)
        );
        observable
          .pipe(
            first(),
            takeUntil(this.destroy$)
          )
          .subscribe(canChange => canChange && this.emitClickEvent(index));
      } else {
        this.emitClickEvent(index);
      }
    }
  }

  private emitClickEvent(index: number): void {
    const tabs = this.listOfMpTabComponent.toArray();
    this.mpSelectedIndex = index;
    tabs[index].mpClick.emit();
    this.cdr.markForCheck();
  }

  createChangeEvent(index: number): MpTabChangeEvent {
    const event = new MpTabChangeEvent();
    event.index = index;
    if (this.listOfMpTabComponent && this.listOfMpTabComponent.length) {
      event.tab = this.listOfMpTabComponent.toArray()[index];
      this.listOfMpTabComponent.forEach((item, i) => {
        if (i !== index) {
          item.mpDeselect.emit();
        }
      });
      event.tab.mpSelect.emit();
    }
    return event;
  }

  /** Clamps the given index to the bounds of 0 and the tabs length. */
  private clampTabIndex(index: number | null): number {
    // Note the `|| 0`, which ensures that values like NaN can't get through
    // and which would otherwise throw the component into an infinite loop
    // (since Math.max(NaN, 0) === NaN).
    return Math.min(
      this.listOfMpTabComponent.length - 1,
      Math.max(index || 0, 0)
    );
  }

  private subscribeToTabLabels(): void {
    if (this.tabLabelSubscription) {
      this.tabLabelSubscription.unsubscribe();
    }
    this.tabLabelSubscription = merge(
      ...this.listOfMpTabComponent.map(tab => tab.stateChanges)
    ).subscribe(() => this.cdr.markForCheck());
  }

  constructor(
    public mpConfigService: MpConfigService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    @Optional() private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mpTabPosition) {
      if (this.mpTabPosition === 'top' || this.mpTabPosition === 'bottom') {
        this.tabPositionMode = 'horizontal';
      } else {
        this.tabPositionMode = 'vertical';
      }
      this.setPosition(this.mpTabPosition);
    }
    if (changes.mpType) {
      if (this.mpType === 'card') {
        this.mpAnimated = false;
      }
    }
    if (
      changes.mpSize ||
      changes.mpAnimated ||
      changes.mpTabPosition ||
      changes.mpType
    ) {
      this.setClassMap();
    }
  }

  ngOnInit(): void {
    this.setClassMap();
  }

  ngAfterContentChecked(): void {
    if (this.listOfMpTabComponent && this.listOfMpTabComponent.length) {
      // Don't clamp the `indexToSelect` immediately in the setter because it can happen that
      // the amount of tabs changes before the actual change detection runs.
      const indexToSelect = (this.indexToSelect = this.clampTabIndex(
        this.indexToSelect
      ));
      // If there is a change in selected index, emit a change event. Should not trigger if
      // the selected index has not yet been initialized.
      if (this._selectedIndex !== indexToSelect) {
        const isFirstRun = this._selectedIndex == null;
        if (!isFirstRun) {
          this.mpSelectChange.emit(this.createChangeEvent(indexToSelect));
        }

        // Changing these values after change detection has run
        // since the checked content may contain references to them.
        Promise.resolve().then(() => {
          this.listOfMpTabComponent.forEach(
            (tab, index) => (tab.isActive = index === indexToSelect)
          );

          if (!isFirstRun) {
            this.mpSelectedIndexChange.emit(indexToSelect);
          }
        });
      }

      // Setup the position for each tab and optionally setup an origin on the next selected tab.
      this.listOfMpTabComponent.forEach(
        (tab: MpTabComponent, index: number) => {
          tab.position = index - indexToSelect;

          // If there is already a selected tab, then set up an origin for the next selected tab
          // if it doesn't have one already.
          if (
            this._selectedIndex != null &&
            tab.position === 0 &&
            !tab.origin
          ) {
            tab.origin = indexToSelect - this._selectedIndex;
          }
        }
      );

      if (this._selectedIndex !== indexToSelect) {
        this._selectedIndex = indexToSelect;
        this.cdr.markForCheck();
      }
    }
  }

  ngAfterContentInit(): void {
    this.subscribeToTabLabels();
    this.setPosition(this.mpTabPosition);

    if (this.mpLinkRouter) {
      if (!this.router) {
        throw new Error(
          `${PREFIX} you should import 'RouterModule' if you want to use 'mpLinkRouter'!`
        );
      }

      this.router.events
        .pipe(
          takeUntil(this.destroy$),
          filter(e => e instanceof NavigationEnd),
          startWith(true)
        )
        .subscribe(() => {
          this.updateRouterActive();
          this.cdr.markForCheck();
        });
    }
    // Subscribe to changes in the amount of tabs, in order to be
    // able to re-render the content as new tabs are added or removed.
    this.tabsSubscription = this.listOfMpTabComponent.changes.subscribe(() => {
      const indexToSelect = this.clampTabIndex(this.indexToSelect);

      // Maintain the previously-selected tab if a new tab is added or removed and there is no
      // explicit change that selects a different tab.
      if (indexToSelect === this._selectedIndex) {
        const tabs = this.listOfMpTabComponent.toArray();

        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].isActive) {
            // Assign both to the `_indexToSelect` and `_selectedIndex` so we don't fire a changed
            // event, otherwise the consumer may end up in an infinite loop in some edge cases like
            // adding a tab within the `selectedIndexChange` event.
            this.indexToSelect = this._selectedIndex = i;
            break;
          }
        }
      }

      this.subscribeToTabLabels();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.tabsSubscription.unsubscribe();
    this.tabLabelSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateRouterActive(): void {
    if (this.router.navigated) {
      const index = this.findShouldActiveTabIndex();
      if (index !== this._selectedIndex) {
        this.mpSelectedIndex = index;
        this.mpSelectedIndexChange.emit(index);
      }
      this.mpHideAll = index === -1;
    }
  }

  private findShouldActiveTabIndex(): number {
    const tabs = this.listOfMpTabComponent.toArray();
    const isActive = this.isLinkActive(this.router);

    return tabs.findIndex(tab => {
      const c = tab.linkDirective;
      return c
        ? isActive(c.routerLink) || isActive(c.routerLinkWithHref)
        : false;
    });
  }

  private isLinkActive(
    router: Router
  ): (link?: RouterLink | RouterLinkWithHref) => boolean {
    return (link?: RouterLink | RouterLinkWithHref) =>
      link ? router.isActive(link.urlTree, this.mpLinkExact) : false;
  }
}
