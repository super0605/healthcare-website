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
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MpI18nService } from '../i18n';

const MpEmptyDefaultImages = ['default', 'simple'] as const;
type MpEmptyNotFoundImageType =
  | typeof MpEmptyDefaultImages[number]
  | null
  | string
  | TemplateRef<void>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-empty',
  exportAs: 'mpEmpty',
  template: `
    <div class="ant-empty-image">
      <ng-container *ngIf="!isImageBuildIn">
        <ng-container *mpStringTemplateOutlet="mpNotFoundImage">
          <img
            [src]="mpNotFoundImage"
            [alt]="isContentString ? mpNotFoundContent : 'empty'"
          />
        </ng-container>
      </ng-container>
      <mp-empty-default
        *ngIf="isImageBuildIn && mpNotFoundImage !== 'simple'"
      ></mp-empty-default>
      <mp-empty-simple
        *ngIf="isImageBuildIn && mpNotFoundImage === 'simple'"
      ></mp-empty-simple>
    </div>
    <p class="ant-empty-description" *ngIf="mpNotFoundContent !== null">
      <ng-container *mpStringTemplateOutlet="mpNotFoundContent">
        {{ isContentString ? mpNotFoundContent : locale['description'] }}
      </ng-container>
    </p>
    <div class="ant-empty-footer" *ngIf="mpNotFoundFooter">
      <ng-container *mpStringTemplateOutlet="mpNotFoundFooter">
        {{ mpNotFoundFooter }}
      </ng-container>
    </div>
  `,
  host: {
    class: 'ant-empty'
  }
})
export class MpEmptyComponent implements OnChanges, OnInit, OnDestroy {
  @Input() mpNotFoundImage: MpEmptyNotFoundImageType = 'default';
  @Input() mpNotFoundContent: string | TemplateRef<void> | null;
  @Input() mpNotFoundFooter: string | TemplateRef<void>;

  isContentString = false;
  isImageBuildIn = true;
  locale: { [key: string]: string } = {};

  private readonly destroy$ = new Subject<void>();

  constructor(private i18n: MpI18nService, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { mpNotFoundContent, mpNotFoundImage } = changes;

    if (mpNotFoundContent) {
      const content = mpNotFoundContent.currentValue;
      this.isContentString = typeof content === 'string';
    }

    if (mpNotFoundImage) {
      const image = mpNotFoundImage.currentValue || 'default';
      this.isImageBuildIn =
        MpEmptyDefaultImages.findIndex(i => i === image) > -1;
    }
  }

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Empty');
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
