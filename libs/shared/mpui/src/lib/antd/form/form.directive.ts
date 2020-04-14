/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  SimpleChanges
} from '@angular/core';

import { MpConfigService, WithConfig } from '../core/config';
import { InputBoolean } from '../core/util';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { MpFormLabelComponent } from './form-label.component';

const NZ_CONFIG_COMPONENT_NAME = 'form';

@Directive({
  selector: '[mp-form]',
  exportAs: 'mpForm',
  host: { '[class]': 'hostClassMap' }
})
export class MpFormDirective
  implements OnInit, OnChanges, AfterContentInit, OnDestroy {
  @Input() mpLayout = 'horizontal';
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  @InputBoolean()
  mpNoColon: boolean;
  hostClassMap = {};

  @ContentChildren(MpFormLabelComponent, { descendants: true })
  mpFormLabelComponent: QueryList<MpFormLabelComponent>;

  destroy$ = new Subject();

  setClassMap(): void {
    this.hostClassMap = {
      [`ant-form-${this.mpLayout}`]: this.mpLayout
    };
  }

  updateItemsDefaultColon(): void {
    if (this.mpFormLabelComponent) {
      this.mpFormLabelComponent.forEach(item =>
        item.setDefaultNoColon(this.mpNoColon)
      );
    }
  }

  constructor(
    public mpConfigService: MpConfigService,
    elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.renderer.addClass(elementRef.nativeElement, 'ant-form');
  }

  ngOnInit(): void {
    this.setClassMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setClassMap();
    if (changes.hasOwnProperty('mpNoColon')) {
      this.updateItemsDefaultColon();
    }
  }

  ngAfterContentInit(): void {
    this.mpFormLabelComponent.changes
      .pipe(
        startWith(null),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateItemsDefaultColon();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
