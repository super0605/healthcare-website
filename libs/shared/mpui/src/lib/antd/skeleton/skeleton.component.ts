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
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

import { toCssPixel } from '../core/util';
import {
  AvatarShape,
  AvatarSize,
  MpSkeletonAvatar,
  MpSkeletonParagraph,
  MpSkeletonTitle
} from './skeleton.type';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-skeleton',
  exportAs: 'mpSkeleton',
  host: {
    '[class.ant-skeleton-with-avatar]': '!!mpAvatar',
    '[class.ant-skeleton-active]': 'mpActive'
  },
  template: `
    <ng-container *ngIf="mpLoading">
      <div class="ant-skeleton-header" *ngIf="!!mpAvatar">
        <mp-skeleton-element
          mpType="avatar"
          [mpSize]="avatar.size"
          [mpShape]="avatar.shape"
        ></mp-skeleton-element>
      </div>
      <div class="ant-skeleton-content">
        <h3
          *ngIf="!!mpTitle"
          class="ant-skeleton-title"
          [style.width]="toCSSUnit(title.width)"
        ></h3>
        <ul *ngIf="!!mpParagraph" class="ant-skeleton-paragraph">
          <li
            *ngFor="let row of rowsList; let i = index"
            [style.width]="toCSSUnit(widthList[i])"
          ></li>
        </ul>
      </div>
    </ng-container>
    <ng-container *ngIf="!mpLoading">
      <ng-content></ng-content>
    </ng-container>
  `
})
export class MpSkeletonComponent implements OnInit, OnChanges {
  @Input() mpActive = false;
  @Input() mpLoading = true;
  @Input() mpTitle: MpSkeletonTitle | boolean = true;
  @Input() mpAvatar: MpSkeletonAvatar | boolean = false;
  @Input() mpParagraph: MpSkeletonParagraph | boolean = true;

  title: MpSkeletonTitle;
  avatar: MpSkeletonAvatar;
  paragraph: MpSkeletonParagraph;
  rowsList: number[] = [];
  widthList: Array<number | string> = [];

  constructor(
    private cdr: ChangeDetectorRef,
    renderer: Renderer2,
    elementRef: ElementRef
  ) {
    renderer.addClass(elementRef.nativeElement, 'ant-skeleton');
  }

  toCSSUnit(value: number | string = ''): string {
    return toCssPixel(value);
  }

  private getTitleProps(): MpSkeletonTitle {
    const hasAvatar: boolean = !!this.mpAvatar;
    const hasParagraph: boolean = !!this.mpParagraph;
    let width = '';
    if (!hasAvatar && hasParagraph) {
      width = '38%';
    } else if (hasAvatar && hasParagraph) {
      width = '50%';
    }
    return { width, ...this.getProps(this.mpTitle) };
  }

  private getAvatarProps(): MpSkeletonAvatar {
    const shape: AvatarShape =
      !!this.mpTitle && !this.mpParagraph ? 'square' : 'circle';
    const size: AvatarSize = 'large';
    return { shape, size, ...this.getProps(this.mpAvatar) };
  }

  private getParagraphProps(): MpSkeletonParagraph {
    const hasAvatar: boolean = !!this.mpAvatar;
    const hasTitle: boolean = !!this.mpTitle;
    const basicProps: MpSkeletonParagraph = {};
    // Width
    if (!hasAvatar || !hasTitle) {
      basicProps.width = '61%';
    }
    // Rows
    if (!hasAvatar && hasTitle) {
      basicProps.rows = 3;
    } else {
      basicProps.rows = 2;
    }
    return { ...basicProps, ...this.getProps(this.mpParagraph) };
  }

  private getProps<T>(prop: T | boolean | undefined): T | {} {
    return prop && typeof prop === 'object' ? prop : {};
  }

  private getWidthList(): Array<number | string> {
    const { width, rows } = this.paragraph;
    let widthList: Array<string | number> = [];
    if (width && Array.isArray(width)) {
      widthList = width;
    } else if (width && !Array.isArray(width)) {
      widthList = [];
      widthList[rows! - 1] = width;
    }
    return widthList;
  }

  private updateProps(): void {
    this.title = this.getTitleProps();
    this.avatar = this.getAvatarProps();
    this.paragraph = this.getParagraphProps();
    this.rowsList = [...Array(this.paragraph.rows)];
    this.widthList = this.getWidthList();
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.updateProps();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mpTitle || changes.mpAvatar || changes.mpParagraph) {
      this.updateProps();
    }
  }
}
