/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChange,
  SkipSelf,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { treeCollapseMotion } from '../core/animation';
import { MpConfigService, WithConfig } from '../core/config';
import { MpNoAnimationDirective } from '../core/no-animation';
import {
  flattenTreeData,
  MpFormatBeforeDropEvent,
  MpFormatEmitEvent,
  MpTreeBase,
  MpTreeBaseService,
  MpTreeHigherOrderServiceToken,
  MpTreeNode,
  MpTreeNodeKey,
  MpTreeNodeOptions
} from '../core/tree';
import { MpSafeAny } from '../core/types';
import { InputBoolean } from '../core/util';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MpTreeService } from './tree.service';

export function MpTreeServiceFactory(
  higherOrderService: MpTreeBaseService,
  treeService: MpTreeService
): MpTreeBaseService {
  return higherOrderService ? higherOrderService : treeService;
}

const NZ_CONFIG_COMPONENT_NAME = 'tree';

@Component({
  selector: 'mp-tree',
  exportAs: 'mpTree',
  animations: [treeCollapseMotion],
  template: `
    <div role="tree">
      <input [ngStyle]="HIDDEN_STYLE" />
    </div>
    <div
      [class.ant-select-tree-list]="mpSelectMode"
      [class.ant-tree-list]="mpSelectMode"
    >
      <div>
        <cdk-virtual-scroll-viewport
          *ngIf="mpVirtualHeight"
          [class.ant-select-tree-list-holder-inner]="mpSelectMode"
          [class.ant-tree-list-holder-inner]="mpSelectMode"
          [itemSize]="mpVirtualItemSize"
          [minBufferPx]="mpVirtualMinBufferPx"
          [maxBufferPx]="mpVirtualMaxBufferPx"
          [style.height]="mpVirtualHeight"
        >
          <ng-container
            *cdkVirtualFor="
              let node of mpFlattenNodes;
              trackBy: trackByFlattenNode
            "
          >
            <ng-template
              [ngTemplateOutlet]="nodeTemplate"
              [ngTemplateOutletContext]="{ $implicit: node }"
            ></ng-template>
          </ng-container>
        </cdk-virtual-scroll-viewport>

        <div
          *ngIf="!mpVirtualHeight"
          [class.ant-select-tree-list-holder-inner]="mpSelectMode"
          [class.ant-tree-list-holder-inner]="mpSelectMode"
          [@.disabled]="beforeInit || noAnimation?.mpNoAnimation"
          [mpNoAnimation]="noAnimation?.mpNoAnimation"
          [@treeCollapseMotion]="mpFlattenNodes.length"
        >
          <ng-container
            *ngFor="let node of mpFlattenNodes; trackBy: trackByFlattenNode"
          >
            <ng-template
              [ngTemplateOutlet]="nodeTemplate"
              [ngTemplateOutletContext]="{ $implicit: node }"
            ></ng-template>
          </ng-container>
        </div>
      </div>
    </div>
    <ng-template #nodeTemplate let-treeNode>
      <mp-tree-node
        [icon]="treeNode.icon"
        [title]="treeNode.title"
        [isLoading]="treeNode.isLoading"
        [isSelected]="treeNode.isSelected"
        [isDisabled]="treeNode.isDisabled"
        [isMatched]="treeNode.isMatched"
        [isExpanded]="treeNode.isExpanded"
        [isLeaf]="treeNode.isLeaf"
        [isStart]="treeNode.isStart"
        [isEnd]="treeNode.isEnd"
        [isChecked]="treeNode.isChecked"
        [isHalfChecked]="treeNode.isHalfChecked"
        [isDisableCheckbox]="treeNode.isDisableCheckbox"
        [isSelectable]="treeNode.isSelectable"
        [canHide]="treeNode.canHide"
        [mpTreeNode]="treeNode"
        [mpSelectMode]="mpSelectMode"
        [mpShowLine]="mpShowLine"
        [mpExpandedIcon]="mpExpandedIcon"
        [mpDraggable]="mpDraggable"
        [mpCheckable]="mpCheckable"
        [mpShowExpand]="mpShowExpand"
        [mpAsyncData]="mpAsyncData"
        [mpSearchValue]="mpSearchValue"
        [mpHideUnMatched]="mpHideUnMatched"
        [mpBeforeDrop]="mpBeforeDrop"
        [mpShowIcon]="mpShowIcon"
        [mpTreeTemplate]="mpTreeTemplate || mpTreeTemplateChild"
        (mpExpandChange)="eventTriggerChanged($event)"
        (mpClick)="eventTriggerChanged($event)"
        (mpDblClick)="eventTriggerChanged($event)"
        (mpContextMenu)="eventTriggerChanged($event)"
        (mpCheckBoxChange)="eventTriggerChanged($event)"
        (mpOnDragStart)="eventTriggerChanged($event)"
        (mpOnDragEnter)="eventTriggerChanged($event)"
        (mpOnDragOver)="eventTriggerChanged($event)"
        (mpOnDragLeave)="eventTriggerChanged($event)"
        (mpOnDragEnd)="eventTriggerChanged($event)"
        (mpOnDrop)="eventTriggerChanged($event)"
      >
      </mp-tree-node>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MpTreeService,
    {
      provide: MpTreeBaseService,
      useFactory: MpTreeServiceFactory,
      deps: [
        [new SkipSelf(), new Optional(), MpTreeHigherOrderServiceToken],
        MpTreeService
      ]
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MpTreeComponent),
      multi: true
    }
  ],
  host: {
    '[class.ant-select-tree]': `mpSelectMode`,
    '[class.ant-select-tree-show-line]': `mpSelectMode && mpShowLine`,
    '[class.ant-select-tree-icon-hide]': `mpSelectMode && !mpShowIcon`,
    '[class.ant-select-tree-block-node]': `mpSelectMode && mpBlockNode`,
    '[class.ant-tree]': `!mpSelectMode`,
    '[class.ant-tree-show-line]': `!mpSelectMode && mpShowLine`,
    '[class.ant-tree-icon-hide]': `!mpSelectMode && !mpShowIcon`,
    '[class.ant-tree-block-node]': `!mpSelectMode && mpBlockNode`,
    '[class.draggable-tree]': `mpDraggable`
  }
})
export class MpTreeComponent extends MpTreeBase
  implements OnInit, OnDestroy, ControlValueAccessor, OnChanges, AfterViewInit {
  @Input()
  @InputBoolean()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  mpShowIcon: boolean;
  @Input()
  @InputBoolean()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  mpHideUnMatched: boolean;
  @Input()
  @InputBoolean()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  mpBlockNode: boolean;
  @Input() @InputBoolean() mpExpandAll = false;
  @Input() @InputBoolean() mpSelectMode = false;
  @Input() @InputBoolean() mpCheckStrictly = false;
  @Input() @InputBoolean() mpShowExpand: boolean = true;
  @Input() @InputBoolean() mpShowLine = false;
  @Input() @InputBoolean() mpCheckable = false;
  @Input() @InputBoolean() mpAsyncData = false;
  @Input() @InputBoolean() mpDraggable: boolean = false;
  @Input() @InputBoolean() mpMultiple = false;
  @Input() mpExpandedIcon: TemplateRef<{
    $implicit: MpTreeNode;
    origin: MpTreeNodeOptions;
  }>;
  @Input() mpVirtualItemSize = 28;
  @Input() mpVirtualMaxBufferPx = 500;
  @Input() mpVirtualMinBufferPx = 28;
  @Input() mpVirtualHeight: number | boolean = false;
  @Input() mpTreeTemplate: TemplateRef<{
    $implicit: MpTreeNode;
    origin: MpTreeNodeOptions;
  }>;
  @Input() mpBeforeDrop: (
    confirm: MpFormatBeforeDropEvent
  ) => Observable<boolean>;
  @Input() mpData: MpTreeNodeOptions[] | MpTreeNode[] = [];
  @Input() mpExpandedKeys: MpTreeNodeKey[] = [];
  @Input() mpSelectedKeys: MpTreeNodeKey[] = [];
  @Input() mpCheckedKeys: MpTreeNodeKey[] = [];
  @Input() mpSearchValue: string;
  @Input() mpSearchFunc: (node: MpTreeNodeOptions) => boolean;
  @ContentChild('mpTreeTemplate', { static: true })
  mpTreeTemplateChild: TemplateRef<{
    $implicit: MpTreeNode;
    origin: MpTreeNodeOptions;
  }>;
  @ViewChild(CdkVirtualScrollViewport, { read: CdkVirtualScrollViewport })
  cdkVirtualScrollViewport: CdkVirtualScrollViewport;
  mpFlattenNodes: MpTreeNode[] = [];
  beforeInit = true;

  @Output() readonly mpExpandedKeysChange: EventEmitter<
    string[]
  > = new EventEmitter<string[]>();
  @Output() readonly mpSelectedKeysChange: EventEmitter<
    string[]
  > = new EventEmitter<string[]>();
  @Output() readonly mpCheckedKeysChange: EventEmitter<
    string[]
  > = new EventEmitter<string[]>();
  @Output() readonly mpSearchValueChange = new EventEmitter<
    MpFormatEmitEvent
  >();
  @Output() readonly mpClick = new EventEmitter<MpFormatEmitEvent>();
  @Output() readonly mpDblClick = new EventEmitter<MpFormatEmitEvent>();
  @Output() readonly mpContextMenu = new EventEmitter<MpFormatEmitEvent>();
  @Output() readonly mpCheckBoxChange = new EventEmitter<MpFormatEmitEvent>();
  @Output() readonly mpExpandChange = new EventEmitter<MpFormatEmitEvent>();
  @Output() readonly mpOnDragStart = new EventEmitter<MpFormatEmitEvent>();
  @Output() readonly mpOnDragEnter = new EventEmitter<MpFormatEmitEvent>();
  @Output() readonly mpOnDragOver = new EventEmitter<MpFormatEmitEvent>();
  @Output() readonly mpOnDragLeave = new EventEmitter<MpFormatEmitEvent>();
  @Output() readonly mpOnDrop = new EventEmitter<MpFormatEmitEvent>();
  @Output() readonly mpOnDragEnd = new EventEmitter<MpFormatEmitEvent>();

  HIDDEN_STYLE = {
    width: 0,
    height: 0,
    display: 'flex',
    overflow: 'hidden',
    opacity: 0,
    border: 0,
    padding: 0,
    margin: 0
  };

  destroy$ = new Subject();

  onChange: (value: MpTreeNode[]) => void = () => null;
  onTouched: () => void = () => null;

  writeValue(value: MpTreeNode[]): void {
    this.handleMpData(value);
  }

  registerOnChange(fn: (_: MpTreeNode[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Render all properties of mpTree
   * @param changes: all changes from @Input
   */
  renderTreeProperties(changes: {
    [propertyName: string]: SimpleChange;
  }): void {
    let useDefaultExpandedKeys = false;
    let expandAll = false;
    const {
      mpData,
      mpExpandedKeys,
      mpSelectedKeys,
      mpCheckedKeys,
      mpCheckStrictly,
      mpExpandAll,
      mpMultiple,
      mpSearchValue
    } = changes;

    if (mpExpandAll) {
      useDefaultExpandedKeys = true;
      expandAll = this.mpExpandAll;
    }

    if (mpMultiple) {
      this.mpTreeService.isMultiple = this.mpMultiple;
    }

    if (mpCheckStrictly) {
      this.mpTreeService.isCheckStrictly = this.mpCheckStrictly;
    }

    if (mpData) {
      this.handleMpData(this.mpData);
    }

    if (mpCheckedKeys || mpCheckStrictly) {
      this.handleCheckedKeys(this.mpCheckedKeys);
    }

    if (mpExpandedKeys || mpExpandAll) {
      useDefaultExpandedKeys = true;
      this.handleExpandedKeys(expandAll || this.mpExpandedKeys);
    }

    if (mpSelectedKeys) {
      this.handleSelectedKeys(this.mpSelectedKeys, this.mpMultiple);
    }

    if (mpSearchValue) {
      if (!(mpSearchValue.firstChange && !this.mpSearchValue)) {
        useDefaultExpandedKeys = false;
        this.handleSearchValue(this.mpSearchValue, this.mpSearchFunc);
        this.mpSearchValueChange.emit(
          this.mpTreeService.formatEvent('search', null, null)
        );
      }
    }

    // flatten data
    const currentExpandedKeys = this.getExpandedNodeList().map(v => v.key);
    const newExpandedKeys = useDefaultExpandedKeys
      ? expandAll || this.mpExpandedKeys
      : currentExpandedKeys;
    this.handleFlattenNodes(this.mpTreeService.rootNodes, newExpandedKeys);
  }

  trackByFlattenNode(_: number, node: MpTreeNode): string {
    return node.key;
  }
  // Deal with properties
  /**
   * mpData
   * @param value
   */
  handleMpData(value: MpSafeAny[]): void {
    if (Array.isArray(value)) {
      const data = this.coerceTreeNodes(value);
      this.mpTreeService.initTree(data);
    }
  }

  handleFlattenNodes(
    data: MpTreeNode[],
    expandKeys: MpTreeNodeKey[] | true = []
  ): void {
    this.mpTreeService.flattenTreeData(data, expandKeys);
  }

  handleCheckedKeys(keys: MpTreeNodeKey[]): void {
    this.mpTreeService.conductCheck(keys, this.mpCheckStrictly);
  }

  handleExpandedKeys(keys: MpTreeNodeKey[] | true = []): void {
    this.mpTreeService.conductExpandedKeys(keys);
  }

  handleSelectedKeys(keys: MpTreeNodeKey[], isMulti: boolean): void {
    this.mpTreeService.conductSelectedKeys(keys, isMulti);
  }

  handleSearchValue(
    value: string,
    searchFunc?: (node: MpTreeNodeOptions) => boolean
  ): void {
    const dataList = flattenTreeData(this.mpTreeService.rootNodes, true).map(
      v => v.data
    );
    const checkIfMatched = (node: MpTreeNode): boolean => {
      if (searchFunc) {
        return searchFunc(node.origin);
      }
      return !value || !node.title.toLowerCase().includes(value.toLowerCase())
        ? false
        : true;
    };
    dataList.forEach(v => {
      v.isMatched = checkIfMatched(v);
      v.canHide = !v.isMatched;
      if (!v.isMatched) {
        v.setExpanded(false);
        this.mpTreeService.setExpandedNodeList(v);
      } else {
        // expand
        this.mpTreeService.expandNodeAllParentBySearch(v);
      }
      this.mpTreeService.setMatchedNodeList(v);
    });
  }

  /**
   * Handle emit event
   * @param event
   * handle each event
   */
  eventTriggerChanged(event: MpFormatEmitEvent): void {
    const node = event.node!;
    switch (event.eventName) {
      case 'expand':
        this.renderTree();
        this.mpExpandChange.emit(event);
        break;
      case 'click':
        this.mpClick.emit(event);
        break;
      case 'dblclick':
        this.mpDblClick.emit(event);
        break;
      case 'contextmenu':
        this.mpContextMenu.emit(event);
        break;
      case 'check':
        // Render checked state with nodes' property `isChecked`
        this.mpTreeService.setCheckedNodeList(node);
        if (!this.mpCheckStrictly) {
          this.mpTreeService.conduct(node);
        }
        // Cause check method will rerender list, so we need recover it and next the new event to user
        const eventNext = this.mpTreeService.formatEvent(
          'check',
          node,
          event.event!
        );
        this.mpCheckBoxChange.emit(eventNext);
        break;
      case 'dragstart':
        // if node is expanded
        if (node.isExpanded) {
          node.setExpanded(!node.isExpanded);
          this.renderTree();
        }
        this.mpOnDragStart.emit(event);
        break;
      case 'dragenter':
        const selectedNode = this.mpTreeService.getSelectedNode();
        if (
          selectedNode &&
          selectedNode.key !== node.key &&
          !node.isExpanded &&
          !node.isLeaf
        ) {
          node.setExpanded(true);
          this.renderTree();
        }
        this.mpOnDragEnter.emit(event);
        break;
      case 'dragover':
        this.mpOnDragOver.emit(event);
        break;
      case 'dragleave':
        this.mpOnDragLeave.emit(event);
        break;
      case 'dragend':
        this.mpOnDragEnd.emit(event);
        break;
      case 'drop':
        this.renderTree();
        this.mpOnDrop.emit(event);
        break;
    }
  }

  /**
   * Click expand icon
   */
  renderTree(): void {
    this.handleFlattenNodes(
      this.mpTreeService.rootNodes,
      this.getExpandedNodeList().map(v => v.key)
    );
    this.cdr.markForCheck();
  }
  // Handle emit event end

  constructor(
    mpTreeService: MpTreeBaseService,
    public mpConfigService: MpConfigService,
    private cdr: ChangeDetectorRef,
    @Host() @Optional() public noAnimation?: MpNoAnimationDirective
  ) {
    super(mpTreeService);
  }

  ngOnInit(): void {
    this.mpTreeService.flattenNodes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.mpFlattenNodes = data;
        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
    this.renderTreeProperties(changes);
  }

  ngAfterViewInit(): void {
    this.beforeInit = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
