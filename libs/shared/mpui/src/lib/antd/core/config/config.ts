/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { InjectionToken, TemplateRef, Type } from '@angular/core';

import { SafeUrl } from '@angular/platform-browser';
import { MpBreakpointEnum } from '../services';
import {
  MpSafeAny,
  MpShapeSCType,
  MpSizeDSType,
  MpSizeLDSType,
  MpSizeMDSType
} from '../types';

export interface MpConfig {
  affix?: AffixConfig;
  alert?: AlertConfig;
  anchor?: AnchorConfig;
  avatar?: AvatarConfig;
  backTop?: BackTopConfig;
  badge?: BadgeConfig;
  button?: ButtonConfig;
  card?: CardConfig;
  carousel?: CarouselConfig;
  cascader?: CascaderConfig;
  codeEditor?: CodeEditorConfig;
  collapse?: CollapseConfig;
  collapsePanel?: CollapsePanelConfig;
  descriptions?: DescriptionsConfig;
  drawer?: DrawerConfig;
  empty?: EmptyConfig;
  form?: FormConfig;
  icon?: IconConfig;
  message?: MessageConfig;
  modal?: ModalConfig;
  notification?: NotificationConfig;
  pageHeader?: PageHeaderConfig;
  progress?: ProgressConfig;
  rate?: RateConfig;
  space?: SpaceConfig;
  spin?: SpinConfig;
  switch?: SwitchConfig;
  table?: TableConfig;
  tabs?: TabsConfig;
  timePicker?: TimePickerConfig;
  tree?: TreeConfig;
  treeSelect?: TreeSelectConfig;
  typography?: TypographyConfig;
}

export interface AffixConfig {
  mpOffsetBottom?: number;
  mpOffsetTop?: number;
}

export interface AlertConfig {
  mpCloseable?: boolean;
  mpShowIcon?: boolean;
}

export interface AvatarConfig {
  mpShape?: MpShapeSCType;
  mpSize?: MpSizeLDSType | number;
}

export interface AnchorConfig {
  mpBounds?: number;
  mpOffsetBottom?: number;
  mpOffsetTop?: number;
  mpShowInkInFixed?: boolean;
}

export interface BackTopConfig {
  mpVisibilityHeight?: number;
}

export interface BadgeConfig {
  mpColor?: number;
  mpOverflowCount?: number;
  mpShowZero?: number;
}

export interface ButtonConfig {
  mpSize?: 'large' | 'default' | 'small';
}

export interface CodeEditorConfig {
  assetsRoot?: string | SafeUrl;
  defaultEditorOption?: MpSafeAny;
  useStaticLoading?: boolean;

  onLoad?(): void;
  onFirstEditorInit?(): void;
  onInit?(): void;
}

export interface CardConfig {
  mpSize?: MpSizeDSType;
  mpHoverable?: boolean;
  mpBordered?: boolean;
}

export interface CarouselConfig {
  mpAutoPlay?: boolean;
  mpAutoPlaySpeed?: boolean;
  mpDots?: boolean;
  mpEffect?: 'scrollx' | 'fade' | string;
  mpEnableSwipe?: boolean;
  mpVertical?: boolean;
}

export interface CascaderConfig {
  mpSize?: string;
}

export interface CollapseConfig {
  mpAccordion?: boolean;
  mpBordered?: boolean;
}

export interface CollapsePanelConfig {
  mpShowArrow?: boolean;
}

export interface DescriptionsConfig {
  mpBorder?: boolean;
  mpColumn?: { [key in MpBreakpointEnum]?: number } | number;
  mpSize?: 'default' | 'middle' | 'small';
  mpColon?: boolean;
}

export interface DrawerConfig {
  mpMask?: boolean;
  mpMaskClosable?: boolean;
}

export interface EmptyConfig {
  mpDefaultEmptyContent?:
    | Type<MpSafeAny>
    | TemplateRef<string>
    | string
    | undefined;
}

export interface FormConfig {
  mpNoColon?: boolean;
}

export interface IconConfig {
  mpTheme?: 'fill' | 'outline' | 'twotone';
  mpTwotoneColor?: string;
}

export interface MessageConfig {
  mpAnimate?: boolean;
  mpDuration?: number;
  mpMaxStack?: number;
  mpPauseOnHover?: boolean;
  mpTop?: number | string;
}

export interface ModalConfig {
  mpMask?: boolean;
  mpMaskClosable?: boolean;
}

export interface NotificationConfig extends MessageConfig {
  mpTop?: string | number;
  mpBottom?: string | number;
  mpPlacement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}

export interface PageHeaderConfig {
  mpGhost: boolean;
}

export interface ProgressConfig {
  mpGapDegree?: number;
  mpGapPosition?: 'top' | 'right' | 'bottom' | 'left';
  mpShowInfo?: boolean;
  mpStrokeSwitch?: number;
  mpStrokeWidth?: number;
  mpSize?: 'default' | 'small';
  mpStrokeLinecap?: 'round' | 'square';
  mpStrokeColor?: string;
}

export interface RateConfig {
  mpAllowClear?: boolean;
  mpAllowHalf?: boolean;
}

export interface SpaceConfig {
  mpSize?: 'small' | 'middle' | 'large' | number;
}

export interface SpinConfig {
  mpIndicator?: TemplateRef<void>;
}

export interface SwitchConfig {
  mpSize: MpSizeDSType;
}

export interface TableConfig {
  mpBordered?: boolean;
  mpSize?: MpSizeMDSType;
  mpShowQuickJumper?: boolean;
  mpShowSizeChanger?: boolean;
  mpSimple?: boolean;
  mpHideOnSinglePage?: boolean;
}

export interface TabsConfig {
  mpAnimated?:
    | boolean
    | {
        inkBar: boolean;
        tabPane: boolean;
      };
  mpSize?: MpSizeLDSType;
  mpType?: 'line' | 'card';
  mpTabBarGutter?: number;
  mpShowPagination?: boolean;
}

export interface TimePickerConfig {
  mpAllowEmpty?: boolean;
  mpClearText?: string;
  mpFormat?: string;
  mpHourStep?: number;
  mpMinuteStep?: number;
  mpSecondStep?: number;
  mpPopupClassName?: string;
  mpUse12Hours?: string;
}

export interface TreeConfig {
  mpBlockNode?: boolean;
  mpShowIcon?: boolean;
  mpHideUnMatched?: boolean;
}

export interface TreeSelectConfig {
  mpShowIcon?: string;
  mpShowLine?: boolean;
  mpDropdownMatchSelectWidth?: boolean;
  mpHideUnMatched?: boolean;
  mpSize?: 'large' | 'small' | 'default';
}

export interface TypographyConfig {
  mpEllipsisRows?: number;
}

export type MpConfigKey = keyof MpConfig;

/**
 * User should provide an object implements this interface to set global configurations.
 */
export const NZ_CONFIG = new InjectionToken<MpConfig>('mp-config');
