/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { QueryList } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { MpCarouselContentDirective } from '../carousel-content.directive';

import { MpCarouselBaseStrategy } from './base-strategy';

export class MpCarouselOpacityStrategy extends MpCarouselBaseStrategy {
  withCarouselContents(
    contents: QueryList<MpCarouselContentDirective> | null
  ): void {
    super.withCarouselContents(contents);

    if (this.contents) {
      this.slickTrackEl.style.width = `${this.length * this.unitWidth}px`;

      this.contents.forEach(
        (content: MpCarouselContentDirective, i: number) => {
          this.renderer.setStyle(
            content.el,
            'opacity',
            this.carouselComponent!.activeIndex === i ? '1' : '0'
          );
          this.renderer.setStyle(content.el, 'position', 'relative');
          this.renderer.setStyle(content.el, 'width', `${this.unitWidth}px`);
          this.renderer.setStyle(
            content.el,
            'left',
            `${-this.unitWidth * i}px`
          );
          this.renderer.setStyle(content.el, 'transition', [
            'opacity 500ms ease 0s',
            'visibility 500ms ease 0s'
          ]);
        }
      );
    }
  }

  switch(_f: number, _t: number): Observable<void> {
    const { to: t } = this.getFromToInBoundary(_f, _t);
    const complete$ = new Subject<void>();

    this.contents.forEach((content: MpCarouselContentDirective, i: number) => {
      this.renderer.setStyle(content.el, 'opacity', t === i ? '1' : '0');
    });

    setTimeout(() => {
      complete$.next();
      complete$.complete();
    }, this.carouselComponent!.mpTransitionSpeed);

    return complete$;
  }

  dispose(): void {
    this.contents.forEach((content: MpCarouselContentDirective) => {
      this.renderer.setStyle(content.el, 'transition', null);
    });

    super.dispose();
  }
}
