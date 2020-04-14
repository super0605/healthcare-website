/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { NgClassType, MpSizeLDSType } from '../core/types';
import { InputBoolean } from '../core/util';
import { MpInputDirective } from './input.directive';

@Component({
  selector: 'mp-input-group',
  exportAs: 'mpInputGroup',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="ant-input-wrapper ant-input-group"
      *ngIf="isAddOn; else noAddOnTemplate"
    >
      <span
        *ngIf="mpAddOnBefore || mpAddOnBeforeIcon"
        mp-input-group-slot
        type="addon"
        [icon]="mpAddOnBeforeIcon"
        [template]="mpAddOnBefore"
      >
      </span>
      <span
        *ngIf="isAffix; else contentTemplate"
        class="ant-input-affix-wrapper"
        [class.ant-input-affix-wrapper-sm]="isSmall"
        [class.ant-input-affix-wrapper-lg]="isLarge"
      >
        <ng-template [ngTemplateOutlet]="affixTemplate"></ng-template>
      </span>
      <span
        *ngIf="mpAddOnAfter || mpAddOnAfterIcon"
        mp-input-group-slot
        type="addon"
        [icon]="mpAddOnAfterIcon"
        [template]="mpAddOnAfter"
      ></span>
    </span>
    <ng-template #noAddOnTemplate>
      <ng-template [ngIf]="isAffix" [ngIfElse]="contentTemplate">
        <ng-template [ngTemplateOutlet]="affixTemplate"></ng-template>
      </ng-template>
    </ng-template>
    <ng-template #affixTemplate>
      <span
        *ngIf="mpPrefix || mpPrefixIcon"
        mp-input-group-slot
        type="prefix"
        [icon]="mpPrefixIcon"
        [template]="mpPrefix"
      ></span>
      <ng-template [ngTemplateOutlet]="contentTemplate"></ng-template>
      <span
        *ngIf="mpSuffix || mpSuffixIcon"
        mp-input-group-slot
        type="suffix"
        [icon]="mpSuffixIcon"
        [template]="mpSuffix"
      ></span>
    </ng-template>
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
  host: {
    '[class.ant-input-group-compact]': `mpCompact`,
    '[class.ant-input-search-enter-button]': `mpSearch`,
    '[class.ant-input-search]': `mpSearch`,
    '[class.ant-input-search-sm]': `mpSearch && isSmall`,
    '[class.ant-input-search-large]': `mpSearch && isLarge`,
    '[class.ant-input-group-wrapper]': `isAddOn`,
    '[class.ant-input-group-wrapper-lg]': `isAddOn && isLarge`,
    '[class.ant-input-group-wrapper-sm]': `isAddOn && isSmall`,
    '[class.ant-input-affix-wrapper]': `isAffix && !isAddOn`,
    '[class.ant-input-affix-wrapper-lg]': `isAffix && !isAddOn && isLarge`,
    '[class.ant-input-affix-wrapper-sm]': `isAffix && !isAddOn && isSmall`,
    '[class.ant-input-group]': `!isAffix && !isAddOn`,
    '[class.ant-input-group-lg]': `!isAffix && !isAddOn && isLarge`,
    '[class.ant-input-group-sm]': `!isAffix && !isAddOn && isSmall`
  }
})
export class MpInputGroupComponent implements AfterContentInit, OnChanges {
  @ContentChildren(MpInputDirective) listOfMpInputDirective: QueryList<
    MpInputDirective
  >;
  @Input() mpAddOnBeforeIcon: NgClassType;
  @Input() mpAddOnAfterIcon: NgClassType;
  @Input() mpPrefixIcon: NgClassType;
  @Input() mpSuffixIcon: NgClassType;
  @Input() mpAddOnBefore: string | TemplateRef<void>;
  @Input() mpAddOnAfter: string | TemplateRef<void>;
  @Input() mpPrefix: string | TemplateRef<void>;
  @Input() mpSuffix: string | TemplateRef<void>;
  @Input() mpSize: MpSizeLDSType;
  @Input() @InputBoolean() mpSearch = false;
  @Input() @InputBoolean() mpCompact = false;
  isLarge = false;
  isSmall = false;
  isAffix = false;
  isAddOn = false;

  updateChildrenInputSize(): void {
    if (this.listOfMpInputDirective) {
      this.listOfMpInputDirective.forEach(item => (item.mpSize = this.mpSize));
    }
  }

  ngAfterContentInit(): void {
    this.updateChildrenInputSize();
  }
  ngOnChanges(changes: SimpleChanges): void {
    const {
      mpSize,
      mpSuffix,
      mpPrefix,
      mpPrefixIcon,
      mpSuffixIcon,
      mpAddOnAfter,
      mpAddOnBefore,
      mpAddOnAfterIcon,
      mpAddOnBeforeIcon
    } = changes;
    if (mpSize) {
      this.updateChildrenInputSize();
      this.isLarge = this.mpSize === 'large';
      this.isSmall = this.mpSize === 'small';
    }
    if (mpSuffix || mpPrefix || mpPrefixIcon || mpSuffixIcon) {
      this.isAffix = !!(
        this.mpSuffix ||
        this.mpPrefix ||
        this.mpPrefixIcon ||
        this.mpSuffixIcon
      );
    }
    if (
      mpAddOnAfter ||
      mpAddOnBefore ||
      mpAddOnAfterIcon ||
      mpAddOnBeforeIcon
    ) {
      this.isAddOn = !!(
        this.mpAddOnAfter ||
        this.mpAddOnBefore ||
        this.mpAddOnAfterIcon ||
        this.mpAddOnBeforeIcon
      );
    }
  }
}
