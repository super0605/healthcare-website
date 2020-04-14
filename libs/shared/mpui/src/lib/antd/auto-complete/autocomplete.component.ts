/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Host,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { slideMotion } from '../core/animation';
import { MpNoAnimationDirective } from '../core/no-animation';
import { CompareWith, MpDropDownPosition, MpSafeAny } from '../core/types';
import { InputBoolean } from '../core/util';
import { defer, merge, Observable, Subscription } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import {
  MpAutocompleteOptionComponent,
  MpOptionSelectionChange
} from './autocomplete-option.component';

export interface AutocompleteDataSourceItem {
  value: string;
  label: string;
}

export type AutocompleteDataSource =
  | AutocompleteDataSourceItem[]
  | string[]
  | number[];

@Component({
  selector: 'mp-autocomplete',
  exportAs: 'mpAutocomplete',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template>
      <div
        #panel
        class="ant-select-dropdown ant-select-dropdown-placement-bottomLeft"
        [class.ant-select-dropdown-hidden]="!showPanel"
        [ngClass]="mpOverlayClassName"
        [ngStyle]="mpOverlayStyle"
        [mpNoAnimation]="noAnimation?.mpNoAnimation"
        [@slideMotion]="dropDownPosition"
        [@.disabled]="noAnimation?.mpNoAnimation"
      >
        <div
          style="max-height: 256px; overflow-y: auto; overflow-anchor: none;"
        >
          <div style="display: flex; flex-direction: column;">
            <ng-template
              *ngTemplateOutlet="
                mpDataSource ? optionsTemplate : contentTemplate
              "
            ></ng-template>
          </div>
        </div>
      </div>
      <ng-template #contentTemplate>
        <ng-content></ng-content>
      </ng-template>
      <ng-template #optionsTemplate>
        <mp-auto-option
          *ngFor="let option of mpDataSource"
          [mpValue]="option"
          >{{ option }}</mp-auto-option
        >
      </ng-template>
    </ng-template>
  `,
  animations: [slideMotion]
})
export class MpAutocompleteComponent
  implements AfterContentInit, AfterViewInit, OnDestroy {
  @Input() mpWidth: number;
  @Input() mpOverlayClassName = '';
  @Input() mpOverlayStyle: { [key: string]: string } = {};
  @Input() @InputBoolean() mpDefaultActiveFirstOption = true;
  @Input() @InputBoolean() mpBackfill = false;
  @Input() compareWith: CompareWith = (o1, o2) => o1 === o2;
  @Input() mpDataSource: AutocompleteDataSource;
  @Output()
  readonly selectionChange: EventEmitter<
    MpAutocompleteOptionComponent
  > = new EventEmitter<MpAutocompleteOptionComponent>();

  showPanel: boolean = true;
  isOpen: boolean = false;
  activeItem: MpAutocompleteOptionComponent;
  dropDownPosition: MpDropDownPosition = 'bottom';

  /**
   * Options accessor, its source may be content or dataSource
   */
  get options(): QueryList<MpAutocompleteOptionComponent> {
    // first dataSource
    if (this.mpDataSource) {
      return this.fromDataSourceOptions;
    } else {
      return this.fromContentOptions;
    }
  }

  /** Provided by content */
  @ContentChildren(MpAutocompleteOptionComponent, { descendants: true })
  fromContentOptions: QueryList<MpAutocompleteOptionComponent>;
  /** Provided by dataSource */
  @ViewChildren(MpAutocompleteOptionComponent) fromDataSourceOptions: QueryList<
    MpAutocompleteOptionComponent
  >;

  /** cdk-overlay */
  @ViewChild(TemplateRef, { static: false }) template: TemplateRef<{}>;
  @ViewChild('panel', { static: false }) panel: ElementRef;
  @ViewChild('content', { static: false }) content: ElementRef;

  private activeItemIndex: number = -1;
  private selectionChangeSubscription = Subscription.EMPTY;
  private optionMouseEnterSubscription = Subscription.EMPTY;
  private dataSourceChangeSubscription = Subscription.EMPTY;
  /** Options changes listener */
  readonly optionSelectionChanges: Observable<MpOptionSelectionChange> = defer(
    () => {
      if (this.options) {
        return merge<MpOptionSelectionChange>(
          ...this.options.map(option => option.selectionChange)
        );
      }
      return this.ngZone.onStable.asObservable().pipe(
        take(1),
        switchMap(() => this.optionSelectionChanges)
      );
    }
  );
  readonly optionMouseEnter: Observable<MpAutocompleteOptionComponent> = defer(
    () => {
      if (this.options) {
        return merge<MpAutocompleteOptionComponent>(
          ...this.options.map(option => option.mouseEntered)
        );
      }
      return this.ngZone.onStable.asObservable().pipe(
        take(1),
        switchMap(() => this.optionMouseEnter)
      );
    }
  );

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    @Host() @Optional() public noAnimation?: MpNoAnimationDirective
  ) {}

  ngAfterContentInit(): void {
    if (!this.mpDataSource) {
      this.optionsInit();
    }
  }

  ngAfterViewInit(): void {
    if (this.mpDataSource) {
      this.optionsInit();
    }
  }

  ngOnDestroy(): void {
    this.dataSourceChangeSubscription.unsubscribe();
    this.selectionChangeSubscription.unsubscribe();
    this.optionMouseEnterSubscription.unsubscribe();
  }

  setVisibility(): void {
    this.showPanel = !!this.options.length;
    this.changeDetectorRef.markForCheck();
  }

  setActiveItem(index: number): void {
    const activeItem = this.options.toArray()[index];
    if (activeItem && !activeItem.active) {
      this.activeItem = activeItem;
      this.activeItemIndex = index;
      this.clearSelectedOptions(this.activeItem);
      this.activeItem.setActiveStyles();
      this.changeDetectorRef.markForCheck();
    }
  }

  setNextItemActive(): void {
    const nextIndex =
      this.activeItemIndex + 1 <= this.options.length - 1
        ? this.activeItemIndex + 1
        : 0;
    this.setActiveItem(nextIndex);
  }

  setPreviousItemActive(): void {
    const previousIndex =
      this.activeItemIndex - 1 < 0
        ? this.options.length - 1
        : this.activeItemIndex - 1;
    this.setActiveItem(previousIndex);
  }

  getOptionIndex(value: MpSafeAny): number {
    return this.options.reduce(
      (
        result: number,
        current: MpAutocompleteOptionComponent,
        index: number
      ) => {
        return result === -1
          ? this.compareWith(value, current.mpValue)
            ? index
            : -1
          : result;
      },
      -1
    )!;
  }

  updatePosition(position: MpDropDownPosition): void {
    this.dropDownPosition = position;
    this.changeDetectorRef.markForCheck();
  }

  private optionsInit(): void {
    this.setVisibility();
    this.subscribeOptionChanges();
    const changes = this.mpDataSource
      ? this.fromDataSourceOptions.changes
      : this.fromContentOptions.changes;
    // async
    this.dataSourceChangeSubscription = changes.subscribe(e => {
      if (!e.dirty && this.isOpen) {
        setTimeout(() => this.setVisibility());
      }
      this.subscribeOptionChanges();
    });
  }

  /**
   * Clear the status of options
   */
  clearSelectedOptions(
    skip?: MpAutocompleteOptionComponent | null,
    deselect: boolean = false
  ): void {
    this.options.forEach(option => {
      if (option !== skip) {
        if (deselect) {
          option.deselect();
        }
        option.setInactiveStyles();
      }
    });
  }

  private subscribeOptionChanges(): void {
    this.selectionChangeSubscription.unsubscribe();
    this.selectionChangeSubscription = this.optionSelectionChanges
      .pipe(filter((event: MpOptionSelectionChange) => event.isUserInput))
      .subscribe((event: MpOptionSelectionChange) => {
        event.source.select();
        event.source.setActiveStyles();
        this.activeItem = event.source;
        this.activeItemIndex = this.getOptionIndex(this.activeItem.mpValue);
        this.clearSelectedOptions(event.source, true);
        this.selectionChange.emit(event.source);
      });

    this.optionMouseEnterSubscription.unsubscribe();
    this.optionMouseEnterSubscription = this.optionMouseEnter.subscribe(
      (event: MpAutocompleteOptionComponent) => {
        event.setActiveStyles();
        this.activeItem = event;
        this.activeItemIndex = this.getOptionIndex(this.activeItem.mpValue);
        this.clearSelectedOptions(event);
      }
    );
  }
}
