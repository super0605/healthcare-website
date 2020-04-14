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
  OnChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

export type MpResultIconType = 'success' | 'error' | 'info' | 'warning';
export type MpExceptionStatusType = '404' | '500' | '403';
export type MpResultStatusType = MpExceptionStatusType | MpResultIconType;

const IconMap = {
  success: 'check-circle',
  error: 'close-circle',
  info: 'exclamation-circle',
  warning: 'warning'
};
const ExceptionStatus = ['404', '500', '403'];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-result',
  exportAs: 'mpResult',
  template: `
    <div class="ant-result-icon">
      <ng-container *ngIf="!isException; else exceptionTpl">
        <ng-container *ngIf="icon">
          <ng-container *mpStringTemplateOutlet="icon">
            <i mp-icon [mpType]="icon" mpTheme="fill"></i>
          </ng-container>
        </ng-container>
        <ng-content *ngIf="!icon" select="[mp-result-icon]"></ng-content>
      </ng-container>
    </div>
    <ng-container *ngIf="mpTitle">
      <div class="ant-result-title" *mpStringTemplateOutlet="mpTitle">
        {{ mpTitle }}
      </div>
    </ng-container>
    <ng-content *ngIf="!mpTitle" select="div[mp-result-title]"></ng-content>
    <ng-container *ngIf="mpSubTitle">
      <div class="ant-result-subtitle" *mpStringTemplateOutlet="mpSubTitle">
        {{ mpSubTitle }}
      </div>
    </ng-container>
    <ng-content
      *ngIf="!mpSubTitle"
      select="div[mp-result-subtitle]"
    ></ng-content>
    <ng-content select="mp-result-content, [mp-result-content]"></ng-content>
    <div class="ant-result-extra" *ngIf="mpExtra">
      <ng-container *mpStringTemplateOutlet="mpExtra">
        {{ mpExtra }}
      </ng-container>
    </div>
    <ng-content *ngIf="!mpExtra" select="div[mp-result-extra]"></ng-content>

    <ng-template #exceptionTpl>
      <ng-container [ngSwitch]="mpStatus">
        <mp-result-not-found *ngSwitchCase="'404'"></mp-result-not-found>
        <mp-result-server-error *ngSwitchCase="'500'"></mp-result-server-error>
        <mp-result-unauthorized *ngSwitchCase="'403'"></mp-result-unauthorized>
      </ng-container>
    </ng-template>
  `,
  host: {
    '[class.ant-result]': 'true',
    '[class.ant-result-success]': `mpStatus === 'success'`,
    '[class.ant-result-error]': `mpStatus === 'error'`,
    '[class.ant-result-info]': `mpStatus === 'info'`,
    '[class.ant-result-warning]': `mpStatus === 'warning'`
  }
})
export class MpResultComponent implements OnChanges {
  @Input() mpIcon?: string | TemplateRef<void>;
  @Input() mpTitle: string | TemplateRef<void>;
  @Input() mpStatus: MpResultStatusType = 'info';
  @Input() mpSubTitle?: string | TemplateRef<void>;
  @Input() mpExtra?: string | TemplateRef<void>;

  icon?: string | TemplateRef<void>;
  isException = false;

  constructor() {}

  ngOnChanges(): void {
    this.setStatusIcon();
  }

  private setStatusIcon(): void {
    const icon = this.mpIcon;

    this.isException = ExceptionStatus.indexOf(this.mpStatus) !== -1;
    this.icon = icon
      ? typeof icon === 'string'
        ? IconMap[icon as MpResultIconType] || icon
        : icon
      : this.isException
      ? undefined
      : IconMap[this.mpStatus as MpResultIconType];
  }
}
