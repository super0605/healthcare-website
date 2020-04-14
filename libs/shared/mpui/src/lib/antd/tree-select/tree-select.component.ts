/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BACKSPACE } from '@angular/cdk/keycodes';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange
} from '@angular/cdk/overlay';
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  Host,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  Self,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { slideMotion, zoomMotion } from '../core/animation';
import { MpConfigService, WithConfig } from '../core/config';
import { MpNoAnimationDirective } from '../core/no-animation';
import { MpSizeLDSType } from '../core/types';
import { InputBoolean, isNotNil } from '../core/util';

import { merge, of as observableOf, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import {
  MpFormatEmitEvent,
  MpTreeBase,
  MpTreeBaseService,
  MpTreeHigherOrderServiceToken,
  MpTreeNode,
  MpTreeNodeOptions
} from '../core/tree';
import { MpSelectSearchComponent } from '../select';
import { MpTreeComponent } from '../tree';

import { MpTreeSelectService } from './tree-select.service';

export function higherOrderServiceFactory(
  injector: Injector
): MpTreeBaseService {
  return injector.get(MpTreeSelectService);
}

const NZ_CONFIG_COMPONENT_NAME = 'treeSelect';
const TREE_SELECT_DEFAULT_CLASS =
  'ant-select-dropdown ant-select-tree-dropdown';

@Component({
  selector: 'mp-tree-select',
  exportAs: 'mpTreeSelect',
  animations: [slideMotion, zoomMotion],
  template: `
    <ng-template
      cdkConnectedOverlay
      mpConnectedOverlay
      [cdkConnectedOverlayOrigin]="cdkOverlayOrigin"
      [cdkConnectedOverlayOpen]="mpOpen"
      [cdkConnectedOverlayHasBackdrop]="true"
      [cdkConnectedOverlayMinWidth]="
        mpDropdownMatchSelectWidth ? null : triggerWidth
      "
      [cdkConnectedOverlayWidth]="
        mpDropdownMatchSelectWidth ? triggerWidth : null
      "
      (backdropClick)="closeDropDown()"
      (detach)="closeDropDown()"
      (positionChange)="onPositionChange($event)"
    >
      <div
        [class]="dropdownClassName"
        [@slideMotion]="mpOpen ? dropDownPosition : 'void'"
        [@.disabled]="noAnimation?.mpNoAnimation"
        [mpNoAnimation]="noAnimation?.mpNoAnimation"
        [class.ant-select-dropdown-placement-bottomLeft]="
          dropDownPosition === 'bottom'
        "
        [class.ant-select-dropdown-placement-topLeft]="
          dropDownPosition === 'top'
        "
        [ngStyle]="mpDropdownStyle"
      >
        <mp-tree
          #treeRef
          [hidden]="isNotFound"
          mpNoAnimation
          mpSelectMode
          [mpData]="mpNodes"
          [mpMultiple]="mpMultiple"
          [mpSearchValue]="inputValue"
          [mpHideUnMatched]="mpHideUnMatched"
          [mpShowIcon]="mpShowIcon"
          [mpCheckable]="mpCheckable"
          [mpAsyncData]="mpAsyncData"
          [mpShowExpand]="mpShowExpand"
          [mpShowLine]="mpShowLine"
          [mpExpandedIcon]="mpExpandedIcon"
          [mpExpandAll]="mpDefaultExpandAll"
          [mpExpandedKeys]="expandedKeys"
          [mpCheckedKeys]="mpCheckable ? value : []"
          [mpSelectedKeys]="!mpCheckable ? value : []"
          [mpTreeTemplate]="treeTemplate"
          [mpCheckStrictly]="mpCheckStrictly"
          (mpExpandChange)="onExpandedKeysChange($event)"
          (mpClick)="mpTreeClick.emit($event)"
          (mpCheckedKeysChange)="updateSelectedNodes()"
          (mpSelectedKeysChange)="updateSelectedNodes()"
          (mpCheckBoxChange)="mpTreeCheckBoxChange.emit($event)"
          (mpSearchValueChange)="setSearchValues($event)"
        >
        </mp-tree>
        <span
          *ngIf="mpNodes.length === 0 || isNotFound"
          class="ant-select-not-found"
        >
          <mp-embed-empty
            [mpComponentName]="'tree-select'"
            [specificContent]="mpNotFoundContent"
          ></mp-embed-empty>
        </span>
      </div>
    </ng-template>

    <div cdkOverlayOrigin class="ant-select-selector">
      <ng-container *ngIf="isMultiple">
        <mp-select-item
          *ngFor="
            let node of selectedNodes | slice: 0:mpMaxTagCount;
            trackBy: trackValue
          "
          [@zoomMotion]
          [@.disabled]="noAnimation?.mpNoAnimation"
          [mpNoAnimation]="noAnimation?.mpNoAnimation"
          [deletable]="true"
          [disabled]="node.isDisabled || mpDisabled"
          [label]="mpDisplayWith(node)"
          (@zoomMotion.done)="updatePosition()"
          (delete)="removeSelected(node, true)"
        ></mp-select-item>

        <mp-select-item
          *ngIf="selectedNodes.length > mpMaxTagCount"
          [@zoomMotion]
          (@zoomMotion.done)="updatePosition()"
          [@.disabled]="noAnimation?.mpNoAnimation"
          [mpNoAnimation]="noAnimation?.mpNoAnimation"
          [contentTemplateOutlet]="mpMaxTagPlaceholder"
          [contentTemplateOutletContext]="selectedNodes | slice: mpMaxTagCount"
          [deletable]="false"
          [disabled]="false"
          [label]="'+ ' + (selectedNodes.length - mpMaxTagCount) + ' ...'"
        ></mp-select-item>
      </ng-container>

      <mp-select-search
        *ngIf="mpShowSearch"
        (keydown)="onKeyDownInput($event)"
        (isComposingChange)="isComposing = $event"
        (valueChange)="setInputValue($event)"
        [value]="inputValue"
        [mirrorSync]="isMultiple"
        [disabled]="mpDisabled"
        [showInput]="mpOpen"
      >
      </mp-select-search>

      <mp-select-placeholder
        *ngIf="mpPlaceHolder && selectedNodes.length === 0"
        [placeholder]="mpPlaceHolder"
        [style.display]="placeHolderDisplay"
      >
      </mp-select-placeholder>

      <mp-select-item
        *ngIf="!isMultiple && selectedNodes.length === 1"
        [deletable]="false"
        [disabled]="false"
        [label]="mpDisplayWith(selectedNodes[0])"
      ></mp-select-item>

      <mp-select-arrow *ngIf="!isMultiple"></mp-select-arrow>

      <mp-select-clear
        *ngIf="mpAllowClear"
        (clear)="onClearSelection()"
      ></mp-select-clear>
    </div>
  `,
  providers: [
    MpTreeSelectService,
    {
      provide: MpTreeHigherOrderServiceToken,
      useFactory: higherOrderServiceFactory,
      deps: [[new Self(), Injector]]
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MpTreeSelectComponent),
      multi: true
    }
  ],
  host: {
    '[class.ant-select-lg]': 'mpSize==="large"',
    '[class.ant-select-sm]': 'mpSize==="small"',
    '[class.ant-select-enabled]': '!mpDisabled',
    '[class.ant-select-disabled]': 'mpDisabled',
    '[class.ant-select-single]': '!isMultiple',
    '[class.ant-select-show-arrow]': '!isMultiple',
    '[class.ant-select-show-search]': '!isMultiple',
    '[class.ant-select-multiple]': 'isMultiple',
    '[class.ant-select-allow-clear]': 'mpAllowClear',
    '[class.ant-select-open]': 'mpOpen',
    '(click)': 'trigger()'
  }
})
export class MpTreeSelectComponent extends MpTreeBase
  implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  @Input() @InputBoolean() mpAllowClear: boolean = true;
  @Input() @InputBoolean() mpShowExpand: boolean = true;
  @Input() @InputBoolean() mpShowLine: boolean = false;
  @Input()
  @InputBoolean()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, true)
  mpDropdownMatchSelectWidth: boolean;
  @Input() @InputBoolean() mpCheckable: boolean = false;
  @Input()
  @InputBoolean()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  mpHideUnMatched: boolean;
  @Input()
  @InputBoolean()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  mpShowIcon: boolean;
  @Input() @InputBoolean() mpShowSearch: boolean = false;
  @Input() @InputBoolean() mpDisabled = false;
  @Input() @InputBoolean() mpAsyncData = false;
  @Input() @InputBoolean() mpMultiple = false;
  @Input() @InputBoolean() mpDefaultExpandAll = false;
  @Input() @InputBoolean() mpCheckStrictly = false;
  @Input() mpExpandedIcon: TemplateRef<{ $implicit: MpTreeNode }>;
  @Input() mpNotFoundContent: string;
  @Input() mpNodes: Array<MpTreeNode | MpTreeNodeOptions> = [];
  @Input() mpOpen = false;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'default')
  mpSize: MpSizeLDSType;
  @Input() mpPlaceHolder = '';
  @Input() mpDropdownStyle: { [key: string]: string };
  @Input() mpDropdownClassName: string;
  @Input()
  set mpExpandedKeys(value: string[]) {
    this.expandedKeys = value;
  }
  get mpExpandedKeys(): string[] {
    return this.expandedKeys;
  }

  @Input() mpDisplayWith: (node: MpTreeNode) => string | undefined = (
    node: MpTreeNode
  ) => node.title;
  @Input() mpMaxTagCount: number;
  @Input() mpMaxTagPlaceholder: TemplateRef<{ $implicit: MpTreeNode[] }>;
  @Output() readonly mpOpenChange = new EventEmitter<boolean>();
  @Output() readonly mpCleared = new EventEmitter<void>();
  @Output() readonly mpRemoved = new EventEmitter<MpTreeNode>();
  @Output() readonly mpExpandChange = new EventEmitter<MpFormatEmitEvent>();
  @Output() readonly mpTreeClick = new EventEmitter<MpFormatEmitEvent>();
  @Output() readonly mpTreeCheckBoxChange = new EventEmitter<
    MpFormatEmitEvent
  >();

  @ViewChild(MpSelectSearchComponent, { static: false })
  mpSelectSearchComponent: MpSelectSearchComponent;
  @ViewChild('treeRef', { static: false }) treeRef: MpTreeComponent;
  @ViewChild(CdkOverlayOrigin, { static: true })
  cdkOverlayOrigin: CdkOverlayOrigin;
  @ViewChild(CdkConnectedOverlay, { static: false })
  cdkConnectedOverlay: CdkConnectedOverlay;

  @Input() mpTreeTemplate: TemplateRef<{ $implicit: MpTreeNode }>;
  @ContentChild('mpTreeTemplate', { static: true })
  mpTreeTemplateChild: TemplateRef<{ $implicit: MpTreeNode }>;
  get treeTemplate(): TemplateRef<{ $implicit: MpTreeNode }> {
    return this.mpTreeTemplate || this.mpTreeTemplateChild;
  }

  dropdownClassName = TREE_SELECT_DEFAULT_CLASS;
  triggerWidth: number;
  isComposing = false;
  isDestroy = true;
  isNotFound = false;
  inputValue = '';
  dropDownPosition: 'top' | 'center' | 'bottom' = 'bottom';
  selectionChangeSubscription: Subscription;
  selectedNodes: MpTreeNode[] = [];
  expandedKeys: string[] = [];
  value: string[] = [];

  onChange: (value: string[] | string | null) => void;
  onTouched: () => void = () => null;

  get placeHolderDisplay(): string {
    return this.inputValue || this.isComposing || this.selectedNodes.length
      ? 'none'
      : 'block';
  }

  get isMultiple(): boolean {
    return this.mpMultiple || this.mpCheckable;
  }

  constructor(
    mpTreeService: MpTreeSelectService,
    public mpConfigService: MpConfigService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    @Host() @Optional() public noAnimation?: MpNoAnimationDirective
  ) {
    super(mpTreeService);
    this.renderer.addClass(this.elementRef.nativeElement, 'ant-select');
    this.renderer.addClass(this.elementRef.nativeElement, 'ant-tree-select');
  }

  ngOnInit(): void {
    this.isDestroy = false;
    this.selectionChangeSubscription = this.subscribeSelectionChange();
  }

  ngOnDestroy(): void {
    this.isDestroy = true;
    this.closeDropDown();
    this.selectionChangeSubscription.unsubscribe();
  }

  setDisabledState(isDisabled: boolean): void {
    this.mpDisabled = isDisabled;
    this.closeDropDown();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpNodes, mpDropdownClassName } = changes;
    if (mpNodes) {
      this.updateSelectedNodes(true);
    }
    if (mpDropdownClassName) {
      const className =
        this.mpDropdownClassName && this.mpDropdownClassName.trim();
      this.dropdownClassName = className
        ? `${TREE_SELECT_DEFAULT_CLASS} ${className}`
        : TREE_SELECT_DEFAULT_CLASS;
    }
  }

  writeValue(value: string[] | string): void {
    if (isNotNil(value)) {
      if (this.isMultiple && Array.isArray(value)) {
        this.value = value;
      } else {
        this.value = [value as string];
      }
      this.updateSelectedNodes(true);
    } else {
      this.value = [];
      this.selectedNodes.forEach(node => {
        this.removeSelected(node, false);
      });
      this.selectedNodes = [];
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (_: string[] | string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  trigger(): void {
    if (this.mpDisabled || (!this.mpDisabled && this.mpOpen)) {
      this.closeDropDown();
    } else {
      this.openDropdown();
      if (this.mpShowSearch || this.isMultiple) {
        this.focusOnInput();
      }
    }
  }

  openDropdown(): void {
    if (!this.mpDisabled) {
      this.mpOpen = true;
      this.mpOpenChange.emit(this.mpOpen);
      this.updateCdkConnectedOverlayStatus();
      this.updatePosition();
    }
  }

  closeDropDown(): void {
    this.onTouched();
    this.mpOpen = false;
    this.inputValue = '';
    this.mpOpenChange.emit(this.mpOpen);
    this.cdr.markForCheck();
  }

  onKeyDownInput(e: KeyboardEvent): void {
    const keyCode = e.keyCode;
    const eventTarget = e.target as HTMLInputElement;
    if (this.isMultiple && !eventTarget.value && keyCode === BACKSPACE) {
      e.preventDefault();
      if (this.selectedNodes.length) {
        const removeNode = this.selectedNodes[this.selectedNodes.length - 1];
        this.removeSelected(removeNode);
      }
    }
  }

  onExpandedKeysChange(value: MpFormatEmitEvent): void {
    this.mpExpandChange.emit(value);
    this.expandedKeys = [...value.keys!];
  }

  setInputValue(value: string): void {
    this.inputValue = value;
    this.updatePosition();
  }

  removeSelected(node: MpTreeNode, emit: boolean = true): void {
    node.isSelected = false;
    node.isChecked = false;
    if (this.mpCheckable) {
      this.mpTreeService.conduct(node);
    } else {
      this.mpTreeService.setSelectedNodeList(node, this.mpMultiple);
    }

    if (emit) {
      this.mpRemoved.emit(node);
    }
  }

  focusOnInput(): void {
    if (this.mpSelectSearchComponent) {
      this.mpSelectSearchComponent.focus();
    }
  }

  subscribeSelectionChange(): Subscription {
    return merge(
      this.mpTreeClick.pipe(
        tap((event: MpFormatEmitEvent) => {
          const node = event.node!;
          if (this.mpCheckable && !node.isDisabled && !node.isDisableCheckbox) {
            node.isChecked = !node.isChecked;
            node.isHalfChecked = false;
            if (!this.mpCheckStrictly) {
              this.mpTreeService.conduct(node);
            }
          }
          if (this.mpCheckable) {
            node.isSelected = false;
          }
        }),
        filter((event: MpFormatEmitEvent) => {
          const node = event.node!;
          return this.mpCheckable
            ? !node.isDisabled && !node.isDisableCheckbox
            : !node.isDisabled && node.isSelectable;
        })
      ),
      this.mpCheckable ? this.mpTreeCheckBoxChange : observableOf(),
      this.mpCleared,
      this.mpRemoved
    ).subscribe(() => {
      this.updateSelectedNodes();
      const value = this.selectedNodes.map(node => node.key!);
      this.value = [...value];
      if (this.mpShowSearch || this.isMultiple) {
        this.inputValue = '';
        this.isNotFound = false;
      }
      if (this.isMultiple) {
        this.onChange(value);
        this.focusOnInput();
        this.updatePosition();
      } else {
        this.closeDropDown();
        this.onChange(value.length ? value[0] : null);
      }
    });
  }

  updateSelectedNodes(init: boolean = false): void {
    if (init) {
      const nodes = this.coerceTreeNodes(this.mpNodes);
      this.mpTreeService.isMultiple = this.isMultiple;
      this.mpTreeService.isCheckStrictly = this.mpCheckStrictly;
      this.mpTreeService.initTree(nodes);
      if (this.mpCheckable) {
        this.mpTreeService.conductCheck(this.value, this.mpCheckStrictly);
      } else {
        this.mpTreeService.conductSelectedKeys(this.value, this.isMultiple);
      }
    }

    this.selectedNodes = [
      ...(this.mpCheckable
        ? this.getCheckedNodeList()
        : this.getSelectedNodeList())
    ];
  }

  updatePosition(): void {
    setTimeout(() => {
      if (this.cdkConnectedOverlay && this.cdkConnectedOverlay.overlayRef) {
        this.cdkConnectedOverlay.overlayRef.updatePosition();
      }
    });
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    this.dropDownPosition = position.connectionPair.originY;
  }

  onClearSelection(): void {
    this.selectedNodes.forEach(node => {
      this.removeSelected(node, false);
    });
    this.mpCleared.emit();
  }

  setSearchValues($event: MpFormatEmitEvent): void {
    Promise.resolve().then(() => {
      this.isNotFound =
        (this.mpShowSearch || this.isMultiple) &&
        !!this.inputValue &&
        $event.matchedKeys!.length === 0;
    });
  }

  updateCdkConnectedOverlayStatus(): void {
    this.triggerWidth = this.cdkOverlayOrigin.elementRef.nativeElement.getBoundingClientRect().width;
  }

  trackValue(_index: number, option: MpTreeNode): string {
    return option.key!;
  }
}
