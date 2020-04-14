import { NgModule } from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { NZ_ICONS } from '@medopad/shared/mpui';

/**
 * AntDesign Icons
 */
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(
  key => antDesignIcons[key]
);

@NgModule({
  providers: [{ provide: NZ_ICONS, useValue: icons }]
})
export class IconsProviderModule {}
