/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'mp-list-item-meta-title',
  exportAs: 'mpListItemMetaTitle',
  template: `
    <h4 class="ant-list-item-meta-title">
      <ng-content></ng-content>
    </h4>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MpListItemMetaTitleComponent {}

@Component({
  selector: 'mp-list-item-meta-description',
  exportAs: 'mpListItemMetaDescription',
  template: `
    <div class="ant-list-item-meta-description">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MpListItemMetaDescriptionComponent {}

@Component({
  selector: 'mp-list-item-meta-avatar',
  exportAs: 'mpListItemMetaAvatar',
  template: `
    <div class="ant-list-item-meta-avatar">
      <mp-avatar *ngIf="mpSrc" [mpSrc]="mpSrc"></mp-avatar>
      <ng-content *ngIf="!mpSrc"></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MpListItemMetaAvatarComponent {
  @Input() mpSrc: string;
}
