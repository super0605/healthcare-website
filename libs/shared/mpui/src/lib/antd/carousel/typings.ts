/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { InjectionToken, QueryList } from '@angular/core';
import { MpCarouselContentDirective } from './carousel-content.directive';
import { MpCarouselBaseStrategy } from './strategies/base-strategy';

export type MpCarouselEffects = 'fade' | 'scrollx' | string;
export type MpCarouselDotPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | string;

export interface MpCarouselComponentAsSource {
  carouselContents: QueryList<MpCarouselContentDirective>;
  el: HTMLElement;
  mpTransitionSpeed: number;
  vertical: boolean;
  slickListEl: HTMLElement;
  slickTrackEl: HTMLElement;
  activeIndex: number;
}

export interface MpCarouselStrategyRegistryItem {
  name: string;
  strategy: MpCarouselBaseStrategy;
}

export const NZ_CAROUSEL_CUSTOM_STRATEGIES = new InjectionToken<
  MpCarouselStrategyRegistryItem[]
>('mp-carousel-custom-strategies');

export interface PointerVector {
  x: number;
  y: number;
}

export interface FromToInterface {
  from: number;
  to: number;
}
