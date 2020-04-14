/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { MediaMatcher } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

import { MpResizeService } from './resize';

export enum MpBreakpointEnum {
  xxl = 'xxl',
  xl = 'xl',
  lg = 'lg',
  md = 'md',
  sm = 'sm',
  xs = 'xs'
}

export type BreakpointMap = { [key in MpBreakpointEnum]: string };
export type BreakpointBooleanMap = { [key in MpBreakpointEnum]: boolean };
export type MpBreakpointKey = keyof typeof MpBreakpointEnum;

export const gridResponsiveMap: BreakpointMap = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)'
};

export const siderResponsiveMap: BreakpointMap = {
  xs: '(max-width: 479.98px)',
  sm: '(max-width: 575.98px)',
  md: '(max-width: 767.98px)',
  lg: '(max-width: 991.98px)',
  xl: '(max-width: 1199.98px)',
  xxl: '(max-width: 1599.98px)'
};

@Injectable({
  providedIn: 'root'
})
export class MpBreakpointService {
  constructor(
    private resizeService: MpResizeService,
    private mediaMatcher: MediaMatcher
  ) {
    this.resizeService.subscribe().subscribe(() => {});
  }

  subscribe(breakpointMap: BreakpointMap): Observable<MpBreakpointEnum>;
  subscribe(
    breakpointMap: BreakpointMap,
    fullMap: true
  ): Observable<BreakpointBooleanMap>;
  subscribe(
    breakpointMap: BreakpointMap,
    fullMap?: true
  ): Observable<MpBreakpointEnum | BreakpointBooleanMap> {
    if (fullMap) {
      const get = () => this.matchMedia(breakpointMap, true);
      return this.resizeService.subscribe().pipe(
        map(get),
        startWith(get()),
        distinctUntilChanged(
          (
            x: [MpBreakpointEnum, BreakpointBooleanMap],
            y: [MpBreakpointEnum, BreakpointBooleanMap]
          ) => x[0] === y[0]
        ),
        map(x => x[1])
      );
    } else {
      const get = () => this.matchMedia(breakpointMap);
      return this.resizeService.subscribe().pipe(
        map(get),
        startWith(get()),
        distinctUntilChanged()
      );
    }
  }

  private matchMedia(breakpointMap: BreakpointMap): MpBreakpointEnum;
  private matchMedia(
    breakpointMap: BreakpointMap,
    fullMap: true
  ): [MpBreakpointEnum, BreakpointBooleanMap];
  private matchMedia(
    breakpointMap: BreakpointMap,
    fullMap?: true
  ): MpBreakpointEnum | [MpBreakpointEnum, BreakpointBooleanMap] {
    let bp = MpBreakpointEnum.md;

    const breakpointBooleanMap: Partial<BreakpointBooleanMap> = {};

    Object.keys(breakpointMap).map(breakpoint => {
      const castBP = breakpoint as MpBreakpointEnum;
      const matched = this.mediaMatcher.matchMedia(gridResponsiveMap[castBP])
        .matches;

      breakpointBooleanMap[breakpoint as MpBreakpointEnum] = matched;

      if (matched) {
        bp = castBP;
      }
    });

    if (fullMap) {
      return [bp, breakpointBooleanMap as BreakpointBooleanMap];
    } else {
      return bp;
    }
  }
}
