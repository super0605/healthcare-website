/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MpConfigService, WithConfig } from '../core/config';
import { warn } from '../core/logger';
import {
  gridResponsiveMap,
  MpBreakpointEnum,
  MpBreakpointService
} from '../core/services';
import { InputBoolean } from '../core/util';

import { merge, Subject } from 'rxjs';
import {
  auditTime,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { MpDescriptionsItemComponent } from './descriptions-item.component';
import {
  MpDescriptionsItemRenderProps,
  MpDescriptionsLayout,
  MpDescriptionsSize
} from './typings';

const NZ_CONFIG_COMPONENT_NAME = 'descriptions';
const defaultColumnMap: { [key in MpBreakpointEnum]: number } = {
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-descriptions',
  exportAs: 'mpDescriptions',
  preserveWhitespaces: false,
  template: `
    <div *ngIf="mpTitle" class="ant-descriptions-title">
      <ng-container *mpStringTemplateOutlet="mpTitle">{{
        mpTitle
      }}</ng-container>
    </div>
    <div class="ant-descriptions-view">
      <table>
        <tbody>
          <ng-container *ngIf="mpLayout === 'horizontal'">
            <tr
              class="ant-descriptions-row"
              *ngFor="let row of itemMatrix; let i = index"
            >
              <ng-container *ngFor="let item of row; let isLast = last">
                <!-- Horizontal & NOT Bordered -->
                <ng-container *ngIf="!mpBordered">
                  <td class="ant-descriptions-item" [colSpan]="item.span">
                    <span
                      class="ant-descriptions-item-label"
                      [class.ant-descriptions-item-colon]="mpColon"
                      >{{ item.title }}</span
                    >
                    <span class="ant-descriptions-item-content">
                      <ng-template
                        [ngTemplateOutlet]="item.content"
                      ></ng-template>
                    </span>
                  </td>
                </ng-container>
                <!-- Horizontal & Bordered -->
                <ng-container *ngIf="mpBordered">
                  <td
                    class="ant-descriptions-item-label"
                    *mpStringTemplateOutlet="item.title"
                  >
                    {{ item.title }}
                  </td>
                  <td
                    class="ant-descriptions-item-content"
                    [colSpan]="item.span * 2 - 1"
                  >
                    <ng-template
                      [ngTemplateOutlet]="item.content"
                    ></ng-template>
                  </td>
                </ng-container>
              </ng-container>
            </tr>
          </ng-container>

          <ng-container *ngIf="mpLayout === 'vertical'">
            <!-- Vertical & NOT Bordered -->
            <ng-container *ngIf="!mpBordered">
              <ng-container *ngFor="let row of itemMatrix; let i = index">
                <tr class="ant-descriptions-row">
                  <ng-container *ngFor="let item of row; let isLast = last">
                    <td class="ant-descriptions-item" [colSpan]="item.span">
                      <span
                        class="ant-descriptions-item-label"
                        [class.ant-descriptions-item-colon]="mpColon"
                        >{{ item.title }}</span
                      >
                    </td>
                  </ng-container>
                </tr>
                <tr class="ant-descriptions-row">
                  <ng-container *ngFor="let item of row; let isLast = last">
                    <td class="ant-descriptions-item" [colSpan]="item.span">
                      <span class="ant-descriptions-item-content">
                        <ng-template
                          [ngTemplateOutlet]="item.content"
                        ></ng-template>
                      </span>
                    </td>
                  </ng-container>
                </tr>
              </ng-container>
            </ng-container>
            <!-- Vertical & Bordered -->
            <ng-container *ngIf="mpBordered">
              <ng-container *ngFor="let row of itemMatrix; let i = index">
                <tr class="ant-descriptions-row">
                  <ng-container *ngFor="let item of row; let isLast = last">
                    <td
                      class="ant-descriptions-item-label"
                      [colSpan]="item.span"
                    >
                      {{ item.title }}
                    </td>
                  </ng-container>
                </tr>
                <tr class="ant-descriptions-row">
                  <ng-container *ngFor="let item of row; let isLast = last">
                    <td
                      class="ant-descriptions-item-content"
                      [colSpan]="item.span"
                    >
                      <ng-template
                        [ngTemplateOutlet]="item.content"
                      ></ng-template>
                    </td>
                  </ng-container>
                </tr>
              </ng-container>
            </ng-container>
          </ng-container>
        </tbody>
      </table>
    </div>
  `,
  host: {
    class: 'ant-descriptions',
    '[class.ant-descriptions-bordered]': 'mpBordered',
    '[class.ant-descriptions-middle]': 'mpSize === "middle"',
    '[class.ant-descriptions-small]': 'mpSize === "small"'
  }
})
export class MpDescriptionsComponent
  implements OnChanges, OnDestroy, AfterContentInit {
  @ContentChildren(MpDescriptionsItemComponent) items: QueryList<
    MpDescriptionsItemComponent
  >;

  @Input()
  @InputBoolean()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  mpBordered: boolean;
  @Input() mpLayout: MpDescriptionsLayout = 'horizontal';
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME, defaultColumnMap) mpColumn:
    | number
    | { [key in MpBreakpointEnum]: number };
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'default')
  mpSize: MpDescriptionsSize;
  @Input() mpTitle: string | TemplateRef<void> = '';
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, true)
  @InputBoolean()
  mpColon: boolean;

  itemMatrix: MpDescriptionsItemRenderProps[][] = [];
  realColumn = 3;

  private breakpoint: MpBreakpointEnum = MpBreakpointEnum.md;
  private destroy$ = new Subject<void>();

  constructor(
    public mpConfigService: MpConfigService,
    private cdr: ChangeDetectorRef,
    private breakpointService: MpBreakpointService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mpColumn) {
      this.prepareMatrix();
    }
  }

  ngAfterContentInit(): void {
    const contentChange$ = this.items.changes.pipe(
      startWith(this.items),
      takeUntil(this.destroy$)
    );

    merge(
      contentChange$,
      contentChange$.pipe(
        switchMap(() =>
          merge(...this.items.map(i => i.inputChange$)).pipe(auditTime(16))
        )
      ),
      this.breakpointService
        .subscribe(gridResponsiveMap)
        .pipe(tap(bp => (this.breakpoint = bp)))
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.prepareMatrix();
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Prepare the render matrix according to description items' spans.
   */
  private prepareMatrix(): void {
    if (!this.items) {
      return;
    }

    let currentRow: MpDescriptionsItemRenderProps[] = [];
    let width = 0;

    const column = (this.realColumn = this.getColumn());
    const items = this.items.toArray();
    const length = items.length;
    const matrix: MpDescriptionsItemRenderProps[][] = [];
    const flushRow = () => {
      matrix.push(currentRow);
      currentRow = [];
      width = 0;
    };

    for (let i = 0; i < length; i++) {
      const item = items[i];
      const { mpTitle: title, content, mpSpan: span } = item;

      width += span;

      // If the last item make the row's length exceeds `mpColumn`, the last
      // item should take all the space left. This logic is implemented in the template.
      // Warn user about that.
      if (width >= column) {
        if (width > column) {
          warn(`"mpColumn" is ${column} but we have row length ${width}`);
        }
        currentRow.push({ title, content, span: column - (width - span) });
        flushRow();
      } else if (i === length - 1) {
        currentRow.push({ title, content, span: column - (width - span) });
        flushRow();
      } else {
        currentRow.push({ title, content, span });
      }
    }

    this.itemMatrix = matrix;
  }

  private getColumn(): number {
    if (typeof this.mpColumn !== 'number') {
      return this.mpColumn[this.breakpoint];
    }

    return this.mpColumn;
  }
}
