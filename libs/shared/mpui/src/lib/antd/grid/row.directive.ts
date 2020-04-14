/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { MediaMatcher } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {
  gridResponsiveMap,
  MpBreakpointKey,
  MpBreakpointService
} from '../core/services';
import { IndexableObject } from '../core/types';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export type MpJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between';
export type MpAlign = 'top' | 'middle' | 'bottom';

@Directive({
  selector: '[mp-row],mp-row,mp-form-item',
  exportAs: 'mpRow',
  host: {
    '[class.ant-row]': `true`,
    '[class.ant-row-top]': `mpAlign === 'top'`,
    '[class.ant-row-middle]': `mpAlign === 'middle'`,
    '[class.ant-row-bottom]': `mpAlign === 'bottom'`,
    '[class.ant-row-start]': `mpJustify === 'start'`,
    '[class.ant-row-end]': `mpJustify === 'end'`,
    '[class.ant-row-center]': `mpJustify === 'center'`,
    '[class.ant-row-space-around]': `mpJustify === 'space-around'`,
    '[class.ant-row-space-between]': `mpJustify === 'space-between'`
  }
})
export class MpRowDirective
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  /**
   * @deprecated don't need mpType="flex" after 9.0
   */
  @Input() mpType: 'flex' | null;
  @Input() mpAlign: MpAlign | null = null;
  @Input() mpJustify: MpJustify | null = null;
  @Input() mpGutter:
    | number
    | IndexableObject
    | [number, number]
    | [IndexableObject, IndexableObject]
    | null = null;

  readonly actualGutter$ = new ReplaySubject<[number, number]>(1);

  private readonly destroy$ = new Subject();

  getGutter(): [number, number] {
    const results: [number, number] = [0, 0];
    const gutter = this.mpGutter || 0;
    const normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, 0];
    normalizedGutter.forEach((g, index) => {
      if (typeof g === 'object') {
        results[index] = 0;
        Object.keys(gridResponsiveMap).map((screen: string) => {
          const bp = screen as MpBreakpointKey;
          if (
            this.mediaMatcher.matchMedia(gridResponsiveMap[bp]).matches &&
            g[bp]
          ) {
            results[index] = g![bp] as number;
          }
        });
      } else {
        results[index] = g || 0;
      }
    });
    return results;
  }

  setGutterStyle(): void {
    const [horizontalGutter, verticalGutter] = this.getGutter();
    this.actualGutter$.next([horizontalGutter, verticalGutter]);
    const renderGutter = (name: string, gutter: number) => {
      const nativeElement = this.elementRef.nativeElement;
      this.renderer.setStyle(nativeElement, name, `-${gutter / 2}px`);
    };
    if (horizontalGutter > 0) {
      renderGutter('margin-left', horizontalGutter);
      renderGutter('margin-right', horizontalGutter);
    }
    if (verticalGutter > 0) {
      renderGutter('margin-top', verticalGutter);
      renderGutter('margin-bottom', verticalGutter);
    }
  }

  constructor(
    public elementRef: ElementRef,
    public renderer: Renderer2,
    public mediaMatcher: MediaMatcher,
    public ngZone: NgZone,
    public platform: Platform,
    private breakpointService: MpBreakpointService
  ) {}

  ngOnInit(): void {
    this.setGutterStyle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mpGutter) {
      this.setGutterStyle();
    }
  }

  ngAfterViewInit(): void {
    if (this.platform.isBrowser) {
      this.breakpointService
        .subscribe(gridResponsiveMap)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.setGutterStyle();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
