/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ContentObserver } from '@angular/cdk/observers';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { zoomBadgeMotion } from '../core/animation';
import { MpConfigService, WithConfig } from '../core/config';
import { InputBoolean, isEmpty } from '../core/util';
import { Subject } from 'rxjs';
import { startWith, take, takeUntil } from 'rxjs/operators';

import { badgePresetColors } from './preset-colors';
import { MpBadgeStatusType } from './types';

const NZ_CONFIG_COMPONENT_NAME = 'backTop';

@Component({
  selector: 'mp-badge',
  exportAs: 'mpBadge',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [zoomBadgeMotion],
  template: `
    <span #contentElement><ng-content></ng-content></span>
    <span
      class="ant-badge-status-dot ant-badge-status-{{
        mpStatus || presetColor
      }}"
      [style.background]="!presetColor && mpColor"
      *ngIf="mpStatus || mpColor"
      [ngStyle]="mpStyle"
    ></span>
    <span class="ant-badge-status-text" *ngIf="mpStatus || mpColor">{{
      mpText
    }}</span>
    <ng-container *mpStringTemplateOutlet="mpCount">
      <sup
        class="ant-scroll-number"
        *ngIf="showSup && viewInit"
        [@.disabled]="notWrapper"
        [@zoomBadgeMotion]
        [ngStyle]="mpStyle"
        [attr.title]="mpTitle === null ? '' : mpTitle || mpCount"
        [style.right.px]="mpOffset && mpOffset[0] ? -mpOffset[0] : null"
        [style.marginTop.px]="mpOffset && mpOffset[1] ? mpOffset[1] : null"
        [class.ant-badge-count]="!mpDot"
        [class.ant-badge-dot]="mpDot"
        [class.ant-badge-multiple-words]="countArray.length >= 2"
      >
        <ng-container *ngFor="let n of maxNumberArray; let i = index">
          <span
            class="ant-scroll-number-only"
            *ngIf="count <= mpOverflowCount"
            [style.transform]="'translateY(' + -countArray[i] * 100 + '%)'"
          >
            <ng-container *ngIf="!mpDot && countArray[i] !== undefined">
              <p
                *ngFor="let p of countSingleArray"
                class="ant-scroll-number-only-unit"
                [class.current]="p === countArray[i]"
              >
                {{ p }}
              </p>
            </ng-container>
          </span>
        </ng-container>
        <ng-container *ngIf="count > mpOverflowCount"
          >{{ mpOverflowCount }}+</ng-container
        >
      </sup>
    </ng-container>
  `,
  host: {
    class: 'ant-badge',
    '[class.ant-badge-status]': 'mpStatus'
  }
})
export class MpBadgeComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  private destroy$ = new Subject();
  notWrapper = true;
  viewInit = false;
  maxNumberArray: string[] = [];
  countArray: number[] = [];
  countSingleArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  presetColor: string | null = null;
  count: number;
  @ViewChild('contentElement', { static: false }) contentElement: ElementRef;
  @Input() @InputBoolean() mpShowZero: boolean = false;
  @Input() @InputBoolean() mpShowDot = true;
  @Input() @InputBoolean() mpDot = false;
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME, 99) mpOverflowCount: number;
  @Input() mpText: string;
  @Input() @WithConfig(NZ_CONFIG_COMPONENT_NAME) mpColor: string;
  @Input() mpTitle: string;
  @Input() mpStyle: { [key: string]: string };
  @Input() mpStatus: MpBadgeStatusType;
  @Input() mpCount: number | TemplateRef<void>;
  @Input() mpOffset: [number, number];

  checkContent(): void {
    this.notWrapper = isEmpty(this.contentElement.nativeElement);
    if (this.notWrapper) {
      this.renderer.addClass(
        this.elementRef.nativeElement,
        'ant-badge-not-a-wrapper'
      );
    } else {
      this.renderer.removeClass(
        this.elementRef.nativeElement,
        'ant-badge-not-a-wrapper'
      );
    }
  }

  get showSup(): boolean {
    return (
      (this.mpShowDot && this.mpDot) ||
      this.count > 0 ||
      (this.count === 0 && this.mpShowZero)
    );
  }

  generateMaxNumberArray(): void {
    this.maxNumberArray = this.mpOverflowCount.toString().split('');
  }

  constructor(
    public mpConfigService: MpConfigService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private contentObserver: ContentObserver,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.generateMaxNumberArray();
  }

  ngAfterViewInit(): void {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.viewInit = true;
      this.cdr.markForCheck();
    });

    this.contentObserver
      .observe(this.contentElement)
      .pipe(
        startWith(true),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.checkContent();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mpOverflowCount, mpCount, mpColor } = changes;
    if (mpCount && !(mpCount.currentValue instanceof TemplateRef)) {
      this.count = Math.max(0, mpCount.currentValue);
      this.countArray = this.count
        .toString()
        .split('')
        .map(item => +item);
    }
    if (mpOverflowCount) {
      this.generateMaxNumberArray();
    }
    if (mpColor) {
      this.presetColor =
        badgePresetColors.indexOf(this.mpColor) !== -1 ? this.mpColor : null;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
