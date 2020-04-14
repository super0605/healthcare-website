/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { PlatformModule } from '@angular/cdk/platform';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';

import { MpIconDirective } from './icon.directive';
import { NZ_ICONS, NZ_ICONS_PATCH, MpIconPatchService } from './icon.service';

@NgModule({
  exports: [MpIconDirective],
  declarations: [MpIconDirective],
  imports: [PlatformModule]
})
export class MpIconModule {
  static forRoot(icons: IconDefinition[]): ModuleWithProviders<MpIconModule> {
    return {
      ngModule: MpIconModule,
      providers: [
        {
          provide: NZ_ICONS,
          useValue: icons
        }
      ]
    };
  }

  static forChild(icons: IconDefinition[]): ModuleWithProviders<MpIconModule> {
    return {
      ngModule: MpIconModule,
      providers: [
        MpIconPatchService,
        {
          provide: NZ_ICONS_PATCH,
          useValue: icons
        }
      ]
    };
  }
}
