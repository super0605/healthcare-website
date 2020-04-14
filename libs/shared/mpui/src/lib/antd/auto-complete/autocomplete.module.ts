/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MpNoAnimationModule } from '../core/no-animation';
import { MpOutletModule } from '../core/outlet';

import { MpAutocompleteOptgroupComponent } from './autocomplete-optgroup.component';
import { MpAutocompleteOptionComponent } from './autocomplete-option.component';
import { MpAutocompleteTriggerDirective } from './autocomplete-trigger.directive';
import { MpAutocompleteComponent } from './autocomplete.component';

@NgModule({
  declarations: [
    MpAutocompleteComponent,
    MpAutocompleteOptionComponent,
    MpAutocompleteTriggerDirective,
    MpAutocompleteOptgroupComponent
  ],
  exports: [
    MpAutocompleteComponent,
    MpAutocompleteOptionComponent,
    MpAutocompleteTriggerDirective,
    MpAutocompleteOptgroupComponent
  ],
  imports: [
    CommonModule,
    OverlayModule,
    FormsModule,
    MpOutletModule,
    MpNoAnimationModule
  ]
})
export class MpAutocompleteModule {}
