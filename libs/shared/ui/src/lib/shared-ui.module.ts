import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { IconComponent } from './icon/icon.component';
import { LogoComponent } from './logo/logo.component';
import { RowComponent } from './row/row.component';
import { ColComponent } from './col/col.component';
import { FormComponent } from './form/form.component';
import { FormItemComponent } from './form-item/form-item.component';
import { FormLabelComponent } from './form-label/form-label.component';
import { FormControlComponent } from './form-control/form-control.component';
import { FormSplitComponent } from './form-split/form-split.component';
import { FormTextComponent } from './form-text/form-text.component';
import { InputComponent } from './input/input.component';
import { InputGroupComponent } from './input-group/input-group.component';
import { FormExplainComponent } from './form-explain/form-explain.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { CheckboxGroupComponent } from './checkbox-group/checkbox-group.component';
import { CheckboxWrapperComponent } from './checkbox-wrapper/checkbox-wrapper.component';
import { ButtonComponent } from './button/button.component';
import { TypographyComponent } from './typography/typography.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { MenuComponent } from './menu/menu.component';
import { TableComponent } from './table/table.component';
import { CardComponent } from './card/card.component';
import { ProfileAssignedCliniciansWidgetComponent } from './widgets/profile-assigned-clinicians-widget/profile-assigned-clinicians-widget.component';
import { ProfileBaseWidgetComponent } from './widgets/profile-base-widget/profile-base-widget.component';
import { ProfileClinicalHistoryWidgetComponent } from './widgets/profile-clinical-history-widget/profile-clinical-history-widget.component';
import { ProfileGeneralWidgetComponent } from './widgets/profile-general-widget/profile-general-widget.component';
import { ProfileSurgeryWidgetComponent } from './widgets/profile-surgery-widget/profile-surgery-widget.component';

const MODULES = [
  CommonModule,
  NgZorroAntdModule,
  FormsModule,
  ReactiveFormsModule,
  TranslateModule,
  InlineSVGModule
];

const COMPONENTS = [
  IconComponent,
  LogoComponent,
  RowComponent,
  ColComponent,
  FormComponent,
  FormItemComponent,
  FormLabelComponent,
  FormControlComponent,
  FormSplitComponent,
  FormTextComponent,
  InputComponent,
  InputGroupComponent,
  FormExplainComponent,
  CheckboxComponent,
  CheckboxGroupComponent,
  CheckboxWrapperComponent,
  ButtonComponent,
  TypographyComponent,
  DropdownComponent,
  MenuComponent,
  TableComponent,
  CardComponent,
  ProfileAssignedCliniciansWidgetComponent,
  ProfileBaseWidgetComponent,
  ProfileClinicalHistoryWidgetComponent,
  ProfileGeneralWidgetComponent,
  ProfileSurgeryWidgetComponent
];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES, ...COMPONENTS],
  declarations: [...COMPONENTS]
})
export class SharedUiModule {}
