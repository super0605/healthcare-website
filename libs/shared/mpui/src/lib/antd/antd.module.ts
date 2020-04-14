/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/./blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { MpAffixModule } from './affix';
import { MpAlertModule } from './alert';
import { MpAnchorModule } from './anchor';
import { MpAutocompleteModule } from './auto-complete';
import { MpAvatarModule } from './avatar';
import { MpBackTopModule } from './back-top';
import { MpBadgeModule } from './badge';
import { MpBreadCrumbModule } from './breadcrumb';
import { MpButtonModule } from './button';
import { MpCalendarModule } from './calendar';
import { MpCardModule } from './card';
import { MpCarouselModule } from './carousel';
import { MpCascaderModule } from './cascader';
import { MpCheckboxModule } from './checkbox';
import { MpCollapseModule } from './collapse';
import { MpCommentModule } from './comment';
import { warnDeprecation } from './core/logger';
import { MpNoAnimationModule } from './core/no-animation';
import { MpTransButtonModule } from './core/trans-button';
import { MpWaveModule } from './core/wave';
import { MpDatePickerModule } from './date-picker';
import { MpDescriptionsModule } from './descriptions';
import { MpDividerModule } from './divider';
import { MpDrawerModule } from './drawer';
import { MpDropDownModule } from './dropdown';
import { MpEmptyModule } from './empty';
import { MpFormModule } from './form';
import { MpGridModule } from './grid';
import { MpI18nModule } from './i18n';
import { MpIconModule } from './icon';
import { MpInputModule } from './input';
import { MpInputNumberModule } from './input-number';
import { MpLayoutModule } from './layout';
import { MpListModule } from './list';
import { MpMentionModule } from './mention';
import { MpMenuModule } from './menu';
import { MpMessageModule } from './message';
import { MpModalModule } from './modal';
import { MpNotificationModule } from './notification';
import { MpPageHeaderModule } from './page-header';
import { MpPaginationModule } from './pagination';
import { MpPopconfirmModule } from './popconfirm';
import { MpPopoverModule } from './popover';
import { MpProgressModule } from './progress';
import { MpRadioModule } from './radio';
import { MpRateModule } from './rate';
import { MpResultModule } from './result';
import { MpSelectModule } from './select';
import { MpSkeletonModule } from './skeleton';
import { MpSliderModule } from './slider';
import { MpSpinModule } from './spin';
import { MpStatisticModule } from './statistic';
import { MpStepsModule } from './steps';
import { MpSwitchModule } from './switch';
import { MpTableModule } from './table';
import { MpTabsModule } from './tabs';
import { MpTagModule } from './tag';
import { MpTimePickerModule } from './time-picker';
import { MpTimelineModule } from './timeline';
import { MpToolTipModule } from './tooltip';
import { MpTransferModule } from './transfer';
import { MpTreeModule } from './tree';
import { MpTreeSelectModule } from './tree-select';
import { MpTypographyModule } from './typography';
import { MpUploadModule } from './upload';

@NgModule({
  exports: [
    MpAffixModule,
    MpAlertModule,
    MpAnchorModule,
    MpAutocompleteModule,
    MpAvatarModule,
    MpBackTopModule,
    MpBadgeModule,
    MpButtonModule,
    MpBreadCrumbModule,
    MpCalendarModule,
    MpCardModule,
    MpCarouselModule,
    MpCascaderModule,
    MpCheckboxModule,
    MpCollapseModule,
    MpCommentModule,
    MpDatePickerModule,
    MpDescriptionsModule,
    MpDividerModule,
    MpDrawerModule,
    MpDropDownModule,
    MpEmptyModule,
    MpFormModule,
    MpGridModule,
    MpI18nModule,
    MpIconModule,
    MpInputModule,
    MpInputNumberModule,
    MpLayoutModule,
    MpListModule,
    MpMentionModule,
    MpMenuModule,
    MpMessageModule,
    MpModalModule,
    MpNoAnimationModule,
    MpNotificationModule,
    MpPageHeaderModule,
    MpPaginationModule,
    MpPopconfirmModule,
    MpPopoverModule,
    MpProgressModule,
    MpRadioModule,
    MpRateModule,
    MpResultModule,
    MpSelectModule,
    MpSkeletonModule,
    MpSliderModule,
    MpSpinModule,
    MpStatisticModule,
    MpStepsModule,
    MpSwitchModule,
    MpTableModule,
    MpTabsModule,
    MpTagModule,
    MpTimePickerModule,
    MpTimelineModule,
    MpToolTipModule,
    MpTransButtonModule,
    MpTransferModule,
    MpTreeModule,
    MpTreeSelectModule,
    MpTypographyModule,
    MpUploadModule,
    MpWaveModule
  ]
})
/**
 * @deprecated Use secondary entry eg: `import { MpButtonModule } from './button'`.
 */
export class SharedAntdModule {
  constructor() {
    warnDeprecation(
      'The `NgZorroAntdModule` has been deprecated and will be removed in 10.0.0.' +
        ' Please use secondary entry instead.'
    );
  }
}
