/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive } from '@angular/core';

@Directive({
  selector: 'mp-page-header-title, [mp-page-header-title]',
  exportAs: 'mpPageHeaderTitle',
  host: {
    class: 'ant-page-header-heading-title'
  }
})
export class MpPageHeaderTitleDirective {}

@Directive({
  selector: 'mp-page-header-subtitle, [mp-page-header-subtitle]',
  exportAs: 'mpPageHeaderSubtitle',
  host: {
    class: 'ant-page-header-heading-sub-title'
  }
})
export class MpPageHeaderSubtitleDirective {}

@Directive({
  selector: 'mp-page-header-content, [mp-page-header-content]',
  exportAs: 'mpPageHeaderContent',
  host: {
    class: 'ant-page-header-content'
  }
})
export class MpPageHeaderContentDirective {}

@Directive({
  selector: 'mp-page-header-tags, [mp-page-header-tags]',
  exportAs: 'mpPageHeaderTags',
  host: {
    class: 'ant-page-header-heading-tags'
  }
})
export class MpPageHeaderTagDirective {}

@Directive({
  selector: 'mp-page-header-extra, [mp-page-header-extra]',
  exportAs: 'mpPageHeaderExtra',
  host: {
    class: 'ant-page-header-heading-extra'
  }
})
export class MpPageHeaderExtraDirective {}

@Directive({
  selector: 'mp-page-header-footer, [mp-page-header-footer]',
  exportAs: 'mpPageHeaderFooter',
  host: {
    class: 'ant-page-header-footer'
  }
})
export class MpPageHeaderFooterDirective {}

@Directive({
  selector: 'mp-breadcrumb[mp-page-header-breadcrumb]',
  exportAs: 'mpPageHeaderBreadcrumb'
})
export class MpPageHeaderBreadcrumbDirective {}

@Directive({
  selector: 'mp-avatar[mp-page-header-avatar]',
  exportAs: 'mpPageHeaderAvatar'
})
export class MpPageHeaderAvatarDirective {}
