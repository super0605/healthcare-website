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
  Directive,
  Input,
  TemplateRef
} from '@angular/core';

@Component({
  selector: 'mp-list-empty',
  exportAs: 'mpListHeader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mp-embed-empty
      [mpComponentName]="'list'"
      [specificContent]="mpNoResult"
    ></mp-embed-empty>
  `,
  host: {
    class: 'ant-list-empty-text'
  }
})
export class MpListEmptyComponent {
  @Input() mpNoResult: string | TemplateRef<void>;
}

@Component({
  selector: 'mp-list-header',
  exportAs: 'mpListHeader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
  `,
  host: {
    class: 'ant-list-header'
  }
})
export class MpListHeaderComponent {}

@Component({
  selector: 'mp-list-footer',
  exportAs: 'mpListFooter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
  `,
  host: {
    class: 'ant-list-footer'
  }
})
export class MpListFooterComponent {}

@Component({
  selector: 'mp-list-pagination',
  exportAs: 'mpListPagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
  `,
  host: {
    class: 'ant-list-pagination'
  }
})
export class MpListPaginationComponent {}

@Directive({
  selector: 'mp-list-load-more',
  exportAs: 'mpListLoadMoreDirective'
})
export class MpListLoadMoreDirective {}

@Directive({
  selector: 'mp-list[mpGrid]',
  host: {
    class: 'ant-list-grid'
  }
})
export class MpListGridDirective {}
