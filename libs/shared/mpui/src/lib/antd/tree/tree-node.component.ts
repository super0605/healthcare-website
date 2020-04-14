/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Host,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  SimpleChange,
  TemplateRef
} from '@angular/core';
import { MpNoAnimationDirective } from '../core/no-animation';

import {
  MpFormatBeforeDropEvent,
  MpFormatEmitEvent,
  MpTreeBaseService,
  MpTreeNode,
  MpTreeNodeOptions
} from '../core/tree';
import { InputBoolean } from '../core/util';
import { fromEvent, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mp-tree-node',
  exportAs: 'mpTreeNode',
  template: `
    <mp-tree-indent
      [mpTreeLevel]="mpTreeNode.level"
      [mpSelectMode]="mpSelectMode"
      [mpIsStart]="isStart"
      [mpIsEnd]="isEnd"
    ></mp-tree-indent>
    <mp-tree-node-switcher
      *ngIf="mpShowExpand"
      [mpShowExpand]="mpShowExpand"
      [mpShowLine]="mpShowLine"
      [mpExpandedIcon]="mpExpandedIcon"
      [mpSelectMode]="mpSelectMode"
      [context]="mpTreeNode"
      [isLeaf]="isLeaf"
      [isExpanded]="isExpanded"
      [isLoading]="isLoading"
      (click)="clickExpand($event)"
    ></mp-tree-node-switcher>
    <mp-tree-node-checkbox
      *ngIf="mpCheckable"
      (click)="clickCheckBox($event)"
      [mpSelectMode]="mpSelectMode"
      [isChecked]="isChecked"
      [isHalfChecked]="isHalfChecked"
      [isDisabled]="isDisabled"
      [isDisableCheckbox]="isDisableCheckbox"
    ></mp-tree-node-checkbox>
    <mp-tree-node-title
      [icon]="icon"
      [title]="title"
      [isLoading]="isLoading"
      [isSelected]="isSelected"
      [isDisabled]="isDisabled"
      [isMatched]="isMatched"
      [isExpanded]="isExpanded"
      [isLeaf]="isLeaf"
      [searchValue]="mpSearchValue"
      [treeTemplate]="mpTreeTemplate"
      [draggable]="mpDraggable"
      [showIcon]="mpShowIcon"
      [selectMode]="mpSelectMode"
      [context]="mpTreeNode"
      (dblclick)="dblClick($event)"
      (click)="clickSelect($event)"
      (contextmenu)="contextMenu($event)"
    ></mp-tree-node-title>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    '[class.ant-select-tree-treenode]': `mpSelectMode`,
    '[class.ant-select-tree-treenode-disabled]': `mpSelectMode && isDisabled`,
    '[class.ant-select-tree-treenode-switcher-open]': `mpSelectMode && isSwitcherOpen`,
    '[class.ant-select-tree-treenode-switcher-close]': `mpSelectMode && isSwitcherClose`,
    '[class.ant-select-tree-treenode-checkbox-checked]': `mpSelectMode && isChecked`,
    '[class.ant-select-tree-treenode-checkbox-indeterminate]': `mpSelectMode && isHalfChecked`,
    '[class.ant-select-tree-treenode-selected]': `mpSelectMode && isSelected`,
    '[class.ant-select-tree-treenode-loading]': `mpSelectMode && isLoading`,
    '[class.ant-tree-treenode]': `!mpSelectMode`,
    '[class.ant-tree-treenode-disabled]': `!mpSelectMode && isDisabled`,
    '[class.ant-tree-treenode-switcher-open]': `!mpSelectMode && isSwitcherOpen`,
    '[class.ant-tree-treenode-switcher-close]': `!mpSelectMode && isSwitcherClose`,
    '[class.ant-tree-treenode-checkbox-checked]': `!mpSelectMode && isChecked`,
    '[class.ant-tree-treenode-checkbox-indeterminate]': `!mpSelectMode && isHalfChecked`,
    '[class.ant-tree-treenode-selected]': `!mpSelectMode && isSelected`,
    '[class.ant-tree-treenode-loading]': `!mpSelectMode && isLoading`,
    '[style.display]': 'displayStyle',
    '(mousedown)': 'onMousedown($event)'
  }
})
export class MpTreeNodeComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * for global property
   */
  @Input() icon: string;
  @Input() title: string;
  @Input() isLoading: boolean;
  @Input() isSelected: boolean;
  @Input() isDisabled: boolean;
  @Input() isMatched: boolean;
  @Input() isExpanded: boolean;
  @Input() isLeaf: boolean;
  @Input() isChecked: boolean;
  @Input() isHalfChecked: boolean;
  @Input() isDisableCheckbox: boolean;
  @Input() isSelectable: boolean;
  @Input() canHide: boolean;
  @Input() isStart: boolean[];
  @Input() isEnd: boolean[];
  @Input() mpTreeNode: MpTreeNode;
  @Input() @InputBoolean() mpShowLine: boolean;
  @Input() @InputBoolean() mpShowExpand: boolean;
  @Input() @InputBoolean() mpCheckable: boolean;
  @Input() @InputBoolean() mpAsyncData: boolean;
  @Input() @InputBoolean() mpHideUnMatched = false;
  @Input() @InputBoolean() mpNoAnimation = false;
  @Input() @InputBoolean() mpSelectMode = false;
  @Input() @InputBoolean() mpShowIcon = false;
  @Input() mpExpandedIcon: TemplateRef<{
    $implicit: MpTreeNode;
    origin: MpTreeNodeOptions;
  }>;
  @Input() mpTreeTemplate: TemplateRef<{
    $implicit: MpTreeNode;
    origin: MpTreeNodeOptions;
  }>;
  @Input() mpBeforeDrop: (
    confirm: MpFormatBeforeDropEvent
  ) => Observable<boolean>;
  @Input() mpSearchValue = '';
  @Input() mpDraggable: boolean;
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

  /**
   * drag var
   */
  destroy$ = new Subject();
  dragPos = 2;
  dragPosClass: { [key: string]: string } = {
    '0': 'drag-over',
    '1': 'drag-over-gap-bottom',
    '-1': 'drag-over-gap-top'
  };

  /**
   * default set
   */
  get displayStyle(): string {
    // to hide unmatched nodes
    return this.mpSearchValue &&
      this.mpHideUnMatched &&
      !this.isMatched &&
      !this.isExpanded &&
      this.canHide
      ? 'none'
      : '';
  }

  get isSwitcherOpen(): boolean {
    return this.isExpanded && !this.isLeaf;
  }

  get isSwitcherClose(): boolean {
    return !this.isExpanded && !this.isLeaf;
  }

  onMousedown(event: MouseEvent): void {
    if (this.mpSelectMode) {
      event.preventDefault();
    }
  }

  /**
   * collapse node
   * @param event
   */
  clickExpand(event: MouseEvent): void {
    event.preventDefault();
    if (!this.isLoading && !this.isLeaf) {
      // set async state
      if (
        this.mpAsyncData &&
        this.mpTreeNode.children.length === 0 &&
        !this.isExpanded
      ) {
        this.mpTreeNode.isLoading = true;
      }
      this.mpTreeNode.setExpanded(!this.isExpanded);
    }
    this.mpTreeService.setExpandedNodeList(this.mpTreeNode);
    const eventNext = this.mpTreeService.formatEvent(
      'expand',
      this.mpTreeNode,
      event
    );
    this.mpExpandChange.emit(eventNext);
  }

  clickSelect(event: MouseEvent): void {
    event.preventDefault();
    if (this.isSelectable && !this.isDisabled) {
      this.mpTreeNode.isSelected = !this.mpTreeNode.isSelected;
    }
    this.mpTreeService.setSelectedNodeList(this.mpTreeNode);
    const eventNext = this.mpTreeService.formatEvent(
      'click',
      this.mpTreeNode,
      event
    );
    this.mpClick.emit(eventNext);
  }

  dblClick(event: MouseEvent): void {
    event.preventDefault();
    const eventNext = this.mpTreeService.formatEvent(
      'dblclick',
      this.mpTreeNode,
      event
    );
    this.mpDblClick.emit(eventNext);
  }

  contextMenu(event: MouseEvent): void {
    event.preventDefault();
    const eventNext = this.mpTreeService.formatEvent(
      'contextmenu',
      this.mpTreeNode,
      event
    );
    this.mpContextMenu.emit(eventNext);
  }

  /**
   * check node
   * @param event
   */
  clickCheckBox(event: MouseEvent): void {
    event.preventDefault();
    // return if node is disabled
    if (this.isDisabled || this.isDisableCheckbox) {
      return;
    }
    this.mpTreeNode.isChecked = !this.mpTreeNode.isChecked;
    this.mpTreeNode.isHalfChecked = false;
    this.mpTreeService.setCheckedNodeList(this.mpTreeNode);
    const eventNext = this.mpTreeService.formatEvent(
      'check',
      this.mpTreeNode,
      event
    );
    this.mpCheckBoxChange.emit(eventNext);
  }

  clearDragClass(): void {
    const dragClass = [
      'drag-over-gap-top',
      'drag-over-gap-bottom',
      'drag-over'
    ];
    dragClass.forEach(e => {
      this.renderer.removeClass(this.elementRef.nativeElement, e);
    });
  }

  /**
   * drag event
   * @param e
   */
  handleDragStart(e: DragEvent): void {
    try {
      // ie throw error
      // firefox-need-it
      e.dataTransfer!.setData('text/plain', this.mpTreeNode.key!);
    } catch (error) {
      // empty
    }
    this.mpTreeService.setSelectedNode(this.mpTreeNode);
    const eventNext = this.mpTreeService.formatEvent(
      'dragstart',
      this.mpTreeNode,
      e
    );
    this.mpOnDragStart.emit(eventNext);
  }

  handleDragEnter(e: DragEvent): void {
    e.preventDefault();
    // reset position
    this.dragPos = 2;
    this.ngZone.run(() => {
      const eventNext = this.mpTreeService.formatEvent(
        'dragenter',
        this.mpTreeNode,
        e
      );
      this.mpOnDragEnter.emit(eventNext);
    });
  }

  handleDragOver(e: DragEvent): void {
    e.preventDefault();
    const dropPosition = this.mpTreeService.calcDropPosition(e);
    if (this.dragPos !== dropPosition) {
      this.clearDragClass();
      this.dragPos = dropPosition;
      // leaf node will pass
      if (!(this.dragPos === 0 && this.isLeaf)) {
        this.renderer.addClass(
          this.elementRef.nativeElement,
          this.dragPosClass[this.dragPos]
        );
      }
    }
    const eventNext = this.mpTreeService.formatEvent(
      'dragover',
      this.mpTreeNode,
      e
    );
    this.mpOnDragOver.emit(eventNext);
  }

  handleDragLeave(e: DragEvent): void {
    e.preventDefault();
    this.clearDragClass();
    const eventNext = this.mpTreeService.formatEvent(
      'dragleave',
      this.mpTreeNode,
      e
    );
    this.mpOnDragLeave.emit(eventNext);
  }

  handleDragDrop(e: DragEvent): void {
    this.ngZone.run(() => {
      this.clearDragClass();
      const node = this.mpTreeService.getSelectedNode();
      if (
        !node ||
        (node && node.key === this.mpTreeNode.key) ||
        (this.dragPos === 0 && this.isLeaf)
      ) {
        return;
      }
      // pass if node is leafNo
      const dropEvent = this.mpTreeService.formatEvent(
        'drop',
        this.mpTreeNode,
        e
      );
      const dragEndEvent = this.mpTreeService.formatEvent(
        'dragend',
        this.mpTreeNode,
        e
      );
      if (this.mpBeforeDrop) {
        this.mpBeforeDrop({
          dragNode: this.mpTreeService.getSelectedNode()!,
          node: this.mpTreeNode,
          pos: this.dragPos
        }).subscribe((canDrop: boolean) => {
          if (canDrop) {
            this.mpTreeService.dropAndApply(this.mpTreeNode, this.dragPos);
          }
          this.mpOnDrop.emit(dropEvent);
          this.mpOnDragEnd.emit(dragEndEvent);
        });
      } else if (this.mpTreeNode) {
        this.mpTreeService.dropAndApply(this.mpTreeNode, this.dragPos);
        this.mpOnDrop.emit(dropEvent);
      }
    });
  }

  handleDragEnd(e: DragEvent): void {
    e.preventDefault();
    this.ngZone.run(() => {
      // if user do not custom beforeDrop
      if (!this.mpBeforeDrop) {
        const eventNext = this.mpTreeService.formatEvent(
          'dragend',
          this.mpTreeNode,
          e
        );
        this.mpOnDragEnd.emit(eventNext);
      }
    });
  }

  /**
   * Listening to dragging events.
   */
  handDragEvent(): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.mpDraggable) {
        const nativeElement = this.elementRef.nativeElement;
        this.destroy$ = new Subject();
        fromEvent<DragEvent>(nativeElement, 'dragstart')
          .pipe(takeUntil(this.destroy$))
          .subscribe((e: DragEvent) => this.handleDragStart(e));
        fromEvent<DragEvent>(nativeElement, 'dragenter')
          .pipe(takeUntil(this.destroy$))
          .subscribe((e: DragEvent) => this.handleDragEnter(e));
        fromEvent<DragEvent>(nativeElement, 'dragover')
          .pipe(takeUntil(this.destroy$))
          .subscribe((e: DragEvent) => this.handleDragOver(e));
        fromEvent<DragEvent>(nativeElement, 'dragleave')
          .pipe(takeUntil(this.destroy$))
          .subscribe((e: DragEvent) => this.handleDragLeave(e));
        fromEvent<DragEvent>(nativeElement, 'drop')
          .pipe(takeUntil(this.destroy$))
          .subscribe((e: DragEvent) => this.handleDragDrop(e));
        fromEvent<DragEvent>(nativeElement, 'dragend')
          .pipe(takeUntil(this.destroy$))
          .subscribe((e: DragEvent) => this.handleDragEnd(e));
      } else {
        this.destroy$.next();
        this.destroy$.complete();
      }
    });
  }

  markForCheck(): void {
    this.cdr.markForCheck();
  }

  constructor(
    public mpTreeService: MpTreeBaseService,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    @Host() @Optional() public noAnimation?: MpNoAnimationDirective
  ) {}

  ngOnInit(): void {
    this.mpTreeNode.component = this;
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
    const { mpDraggable } = changes;
    if (mpDraggable) {
      this.handDragEvent();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
