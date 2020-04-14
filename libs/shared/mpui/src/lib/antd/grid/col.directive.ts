/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterViewInit,
  Directive,
  ElementRef,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { IndexableObject, NgClassInterface } from '../core/types';
import { isNotNil } from '../core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MpRowDirective } from './row.directive';

export interface EmbeddedProperty {
  span?: number;
  pull?: number;
  push?: number;
  offset?: number;
  order?: number;
}

@Directive({
  selector: '[mp-col],mp-col,mp-form-control,mp-form-label',
  exportAs: 'mpCol',
  host: {
    '[class]': 'hostClassMap',
    '[style.flex]': 'hostFlexStyle'
  }
})
export class MpColDirective
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  private destroy$ = new Subject();
  hostClassMap: IndexableObject = {};
  hostFlexStyle: string | null = null;
  @Input() mpFlex: string | number | null = null;
  @Input() mpSpan: number | null = null;
  @Input() mpOrder: number | null = null;
  @Input() mpOffset: number | null = null;
  @Input() mpPush: number | null = null;
  @Input() mpPull: number | null = null;
  @Input() mpXs: number | EmbeddedProperty | null = null;
  @Input() mpSm: number | EmbeddedProperty | null = null;
  @Input() mpMd: number | EmbeddedProperty | null = null;
  @Input() mpLg: number | EmbeddedProperty | null = null;
  @Input() mpXl: number | EmbeddedProperty | null = null;
  @Input() mpXXl: number | EmbeddedProperty | null = null;

  setHostClassMap(): void {
    this.hostClassMap = {
      ['ant-col']: true,
      [`ant-col-${this.mpSpan}`]: isNotNil(this.mpSpan),
      [`ant-col-order-${this.mpOrder}`]: isNotNil(this.mpOrder),
      [`ant-col-offset-${this.mpOffset}`]: isNotNil(this.mpOffset),
      [`ant-col-pull-${this.mpPull}`]: isNotNil(this.mpPull),
      [`ant-col-push-${this.mpPush}`]: isNotNil(this.mpPush),
      ...this.generateClass()
    };
  }

  setHostFlexStyle(): void {
    this.hostFlexStyle = this.parseFlex(this.mpFlex);
  }

  parseFlex(flex: number | string | null): string | null {
    if (typeof flex === 'number') {
      return `${flex} ${flex} auto`;
    } else if (typeof flex === 'string') {
      if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
        return `0 0 ${flex}`;
      }
    }
    return flex;
  }

  generateClass(): object {
    const listOfSizeInputName: Array<keyof MpColDirective> = [
      'mpXs',
      'mpSm',
      'mpMd',
      'mpLg',
      'mpXl',
      'mpXXl'
    ];
    const listClassMap: NgClassInterface = {};
    listOfSizeInputName.forEach(name => {
      const sizeName = name.replace('mp', '').toLowerCase();
      if (isNotNil(this[name])) {
        if (typeof this[name] === 'number' || typeof this[name] === 'string') {
          listClassMap[`ant-col-${sizeName}-${this[name]}`] = true;
        } else {
          const embedded = this[name] as EmbeddedProperty;
          const prefixArray: Array<keyof EmbeddedProperty> = [
            'span',
            'pull',
            'push',
            'offset',
            'order'
          ];
          prefixArray.forEach(prefix => {
            const prefixClass = prefix === 'span' ? '-' : `-${prefix}-`;
            listClassMap[
              `ant-col-${sizeName}${prefixClass}${embedded[prefix]}`
            ] = embedded && isNotNil(embedded[prefix]);
          });
        }
      }
    });
    return listClassMap;
  }

  constructor(
    private elementRef: ElementRef,
    @Optional() @Host() public mpRowDirective: MpRowDirective,
    public renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.setHostClassMap();
    this.setHostFlexStyle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setHostClassMap();
    const { mpFlex } = changes;
    if (mpFlex) {
      this.setHostFlexStyle();
    }
  }

  ngAfterViewInit(): void {
    if (this.mpRowDirective) {
      this.mpRowDirective.actualGutter$
        .pipe(takeUntil(this.destroy$))
        .subscribe(([horizontalGutter, verticalGutter]) => {
          const renderGutter = (name: string, gutter: number) => {
            const nativeElement = this.elementRef.nativeElement;
            this.renderer.setStyle(nativeElement, name, `${gutter / 2}px`);
          };
          if (horizontalGutter > 0) {
            renderGutter('padding-left', horizontalGutter);
            renderGutter('padding-right', horizontalGutter);
          }
          if (verticalGutter > 0) {
            renderGutter('padding-top', verticalGutter);
            renderGutter('padding-bottom', verticalGutter);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
