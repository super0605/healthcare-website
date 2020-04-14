/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Platform } from '@angular/cdk/platform';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { MpConfigService, WithConfig } from '../core/config';
import { MpShapeSCType, MpSizeLDSType } from '../core/types';

const NZ_CONFIG_COMPONENT_NAME = 'avatar';

@Component({
  selector: 'mp-avatar',
  exportAs: 'mpAvatar',
  template: `
    <i mp-icon *ngIf="mpIcon && hasIcon" [mpType]="mpIcon"></i>
    <img
      *ngIf="mpSrc && hasSrc"
      [src]="mpSrc"
      [attr.srcset]="mpSrcSet"
      [attr.alt]="mpAlt"
      (error)="imgError($event)"
    />
    <span
      class="ant-avatar-string"
      #textEl
      [ngStyle]="textStyles"
      *ngIf="mpText && hasText"
      >{{ mpText }}</span
    >
  `,
  host: {
    '[class]': 'classMap',
    '[style.width]': 'customSize',
    '[style.height]': 'customSize',
    '[style.line-height]': 'customSize',
    '[style.font-size]': '(hasIcon && customSize) ? (mpSize / 2 + "px") : null'
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MpAvatarComponent implements OnChanges {
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'circle')
  mpShape: MpShapeSCType;
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME, 'default') mpSize:
    | MpSizeLDSType
    | number;
  @Input() mpText: string;
  @Input() mpSrc: string;
  @Input() mpSrcSet: string;
  @Input() mpAlt: string;
  @Input() mpIcon: string;
  @Output() readonly mpError = new EventEmitter<Event>();

  hasText: boolean = false;
  hasSrc: boolean = true;
  hasIcon: boolean = false;
  textStyles: {};
  classMap: {};
  customSize: string | null = null;

  @ViewChild('textEl', { static: false }) textEl: ElementRef;

  private el: HTMLElement = this.elementRef.nativeElement;

  constructor(
    public mpConfigService: MpConfigService,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private platform: Platform
  ) {}

  setClass(): void {
    this.classMap = {
      ['ant-avatar']: true,
      [`ant-avatar-lg`]: this.mpSize === 'large',
      [`ant-avatar-sm`]: this.mpSize === 'small',
      [`ant-avatar-${this.mpShape}`]: this.mpShape,
      [`ant-avatar-icon`]: this.mpIcon,
      [`ant-avatar-image`]: this.hasSrc // downgrade after image error
    };
    this.cdr.detectChanges();
  }

  imgError($event: Event): void {
    this.mpError.emit($event);
    if (!$event.defaultPrevented) {
      this.hasSrc = false;
      this.hasIcon = false;
      this.hasText = false;
      if (this.mpIcon) {
        this.hasIcon = true;
      } else if (this.mpText) {
        this.hasText = true;
      }
      this.setClass();
      this.setSizeStyle();
      this.notifyCalc();
    }
  }

  ngOnChanges(): void {
    this.hasText = !this.mpSrc && !!this.mpText;
    this.hasIcon = !this.mpSrc && !!this.mpIcon;
    this.hasSrc = !!this.mpSrc;

    this.setClass();
    this.setSizeStyle();
    this.notifyCalc();
  }

  private calcStringSize(): void {
    if (!this.hasText) {
      return;
    }

    const childrenWidth = this.textEl.nativeElement.offsetWidth;
    const avatarWidth = this.el.getBoundingClientRect().width;
    const scale =
      avatarWidth - 8 < childrenWidth ? (avatarWidth - 8) / childrenWidth : 1;
    this.textStyles = {
      transform: `scale(${scale}) translateX(-50%)`
    };
    if (this.customSize) {
      Object.assign(this.textStyles, {
        lineHeight: this.customSize
      });
    }
    this.cdr.detectChanges();
  }

  private notifyCalc(): void {
    // If use ngAfterViewChecked, always demands more computations, so......
    if (this.platform.isBrowser) {
      setTimeout(() => {
        this.calcStringSize();
      });
    }
  }

  private setSizeStyle(): void {
    if (typeof this.mpSize === 'number') {
      this.customSize = `${this.mpSize}px`;
    } else {
      this.customSize = null;
    }
    this.cdr.markForCheck();
  }
}
