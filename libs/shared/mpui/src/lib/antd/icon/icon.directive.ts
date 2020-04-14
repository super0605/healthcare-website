/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterContentChecked,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { IconDirective, ThemeType } from '@ant-design/icons-angular';
import { InputBoolean } from '../core/util';

import { MpIconPatchService, MpIconService } from './icon.service';

@Directive({
  selector: '[mp-icon]',
  exportAs: 'mpIcon',
  host: {
    '[class.anticon]': 'true',
    '[class]': 'hostClass'
  }
})
export class MpIconDirective extends IconDirective
  implements OnInit, OnChanges, AfterContentChecked {
  @Input()
  @InputBoolean()
  set mpSpin(value: boolean) {
    this.spin = value;
  }

  @Input() mpRotate: number = 0;

  @Input()
  set mpType(value: string) {
    this.type = value;
  }

  @Input()
  set mpTheme(value: ThemeType) {
    this.theme = value;
  }

  @Input()
  set mpTwotoneColor(value: string) {
    this.twoToneColor = value;
  }

  @Input()
  set mpIconfont(value: string) {
    this.iconfont = value;
  }

  private readonly el: HTMLElement;

  type: string;
  theme: ThemeType;
  hostClass: string;
  // @ts-ignore
  twotoneColor: string;

  private iconfont: string;
  private spin: boolean = false;

  constructor(
    elementRef: ElementRef,
    public iconService: MpIconService,
    public renderer: Renderer2,
    @Optional() iconPatch: MpIconPatchService
  ) {
    super(iconService, elementRef, renderer);

    if (iconPatch) {
      iconPatch.doPatch();
    }

    this.el = elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpType, mpTwotoneColor, mpSpin, mpTheme, mpRotate } = changes;

    if (mpType || mpTwotoneColor || mpSpin || mpTheme) {
      this.changeIcon2();
    } else if (mpRotate) {
      this.handleRotate(this.el.firstChild as SVGElement);
    } else {
      this._setSVGElement(
        this.iconService.createIconfontIcon(`#${this.iconfont}`)
      );
    }
  }

  ngOnInit(): void {
    this.renderer.setAttribute(
      this.el,
      'class',
      `anticon ${this.el.className}`.trim()
    );
  }

  /**
   * If custom content is provided, try to normalize SVG elements.
   */
  ngAfterContentChecked(): void {
    if (!this.type) {
      const children = this.el.children;
      let length = children.length;
      if (!this.type && children.length) {
        while (length--) {
          const child = children[length];
          if (child.tagName.toLowerCase() === 'svg') {
            this.iconService.normalizeSvgElement(child as SVGElement);
          }
        }
      }
    }
  }

  /**
   * Replacement of `changeIcon` for more modifications.
   */
  private changeIcon2(): void {
    this.setClassName();
    this._changeIcon().then(svgOrRemove => {
      if (svgOrRemove) {
        this.setSVGData(svgOrRemove);
        this.handleSpin(svgOrRemove);
        this.handleRotate(svgOrRemove);
      }
    });
  }

  private handleSpin(svg: SVGElement): void {
    if (this.spin || this.type === 'loading') {
      this.renderer.addClass(svg, 'anticon-spin');
    } else {
      this.renderer.removeClass(svg, 'anticon-spin');
    }
  }

  private handleRotate(svg: SVGElement): void {
    if (this.mpRotate) {
      this.renderer.setAttribute(
        svg,
        'style',
        `transform: rotate(${this.mpRotate}deg)`
      );
    } else {
      this.renderer.removeAttribute(svg, 'style');
    }
  }

  private setClassName(): void {
    this.hostClass = `anticon-${this.type}`;
  }

  private setSVGData(svg: SVGElement): void {
    this.renderer.setAttribute(svg, 'data-icon', this.type);
    this.renderer.setAttribute(svg, 'aria-hidden', 'true');
  }
}
