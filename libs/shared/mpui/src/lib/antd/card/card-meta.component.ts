/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'mp-card-meta',
  exportAs: 'mpCardMeta',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ant-card-meta-avatar" *ngIf="mpAvatar">
      <ng-template [ngTemplateOutlet]="mpAvatar"></ng-template>
    </div>
    <div class="ant-card-meta-detail" *ngIf="mpTitle || mpDescription">
      <div class="ant-card-meta-title" *ngIf="mpTitle">
        <ng-container *mpStringTemplateOutlet="mpTitle">{{
          mpTitle
        }}</ng-container>
      </div>
      <div class="ant-card-meta-description" *ngIf="mpDescription">
        <ng-container *mpStringTemplateOutlet="mpDescription">{{
          mpDescription
        }}</ng-container>
      </div>
    </div>
  `,
  host: {
    '[class.ant-card-meta]': 'true'
  }
})
export class MpCardMetaComponent {
  @Input() mpTitle: string | TemplateRef<void> | null = null;
  @Input() mpDescription: string | TemplateRef<void> | null = null;
  @Input() mpAvatar: TemplateRef<void> | null = null;
}
